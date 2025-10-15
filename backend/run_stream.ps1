<#
run_stream.ps1

Usage:
  .\run_stream.ps1 -rtsp "rtsp://..."

This script starts ffmpeg to read an RTSP stream and write HLS files into
the project's `streams/live` folder (which the Flask app serves at
http://localhost:5000/streams/live/index.m3u8).

It prefers to copy the video codec for efficiency; if that fails you can
edit the $ffmpegArgs to transcode (commented alternative provided).
#>
param(
    [Parameter(Mandatory=$true)]
    [string]$rtsp
)

$outDir = Resolve-Path (Join-Path $PSScriptRoot "..\streams\hls")
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

Write-Host "Writing HLS files to:" $outDir

# Recommended ffmpeg args for HLS (copy video codec when possible)
$ffmpegArgs = @(
    '-rtsp_transport', 'tcp',
    '-i', $rtsp,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-f', 'hls',
    '-hls_time', '4',
    '-hls_list_size', '5',
    '-hls_flags', 'delete_segments',
  '-hls_segment_filename', "$outDir\\segment_%03d.ts",
  "$outDir\\index.m3u8"
)

Write-Host "Starting ffmpeg..."
Write-Host "ffmpeg $($ffmpegArgs -join ' ')"

# Start ffmpeg (this will run until you stop it)
& ffmpeg.exe @ffmpegArgs

# If you need to transcode (if copy doesn't work for your stream),
# replace the -c:v copy with something like:
# '-c:v','libx264','-preset','veryfast','-b:v','2000k','-maxrate','2500k','-bufsize','5000k'
