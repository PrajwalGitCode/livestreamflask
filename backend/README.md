Streaming RTSP to HLS (local dev)
================================

This project serves HLS files from `backend/streams` at:

   http://localhost:5000/streams/hls/index.m3u8

To stream an RTSP feed into that folder (so the frontend can play it), do the
following on Windows:

1) Install ffmpeg
   - Download from https://ffmpeg.org/download.html and add `ffmpeg.exe` to your PATH

2) From the `backend` folder run the provided PowerShell helper with your RTSP URL:

   .\run_stream.ps1 -rtsp "rtsp://807e9439d5ca.entrypoint.cloud.wowza.com:1935/app-rC94792j/068b9c9a_stream2"

3) Open the frontend (Vite dev at http://localhost:5173). The VideoPlayer
   component is configured to load the HLS URL above. If the playlist is not
   yet available, `VideoPlayer` will log a warning; wait a few seconds for
   ffmpeg to create the playlist and segments.

Notes:
- If `-c:v copy` doesn't work for your stream (some streams/codecs), edit
  `run_stream.ps1` to transcode with `libx264` (comment included in the script).
- This setup is intended for local development only. For production, use a
  streaming server or CDN.
