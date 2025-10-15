from flask import Flask, send_from_directory
import subprocess
import os

app = Flask(__name__)

# RTSP URL
RTSP_URL = "rtsp://807e9439d5ca.entrypoint.cloud.wowza.com:1935/app-rC94792j/068b9c9a_stream2"

# Folder to store HLS output
HLS_FOLDER = os.path.join(os.path.dirname(__file__), "hls")
os.makedirs(HLS_FOLDER, exist_ok=True)

@app.route("/start")
def start_stream():
    """Start FFmpeg process to convert RTSP → HLS."""
    cmd = [
        "ffmpeg",
        "-i", RTSP_URL,
        "-c:v", "libx264",
        "-c:a", "aac",
        "-f", "hls",
        "-hls_time", "2",
        "-hls_list_size", "5",
        "-hls_flags", "delete_segments",
        os.path.join(HLS_FOLDER, "index.m3u8")
    ]

    subprocess.Popen(cmd)
    return "Stream started — visit /streams/index.m3u8"

@app.route("/streams/<path:filename>")
def serve_stream(filename):
    """Serve HLS files to frontend."""
    return send_from_directory(HLS_FOLDER, filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
