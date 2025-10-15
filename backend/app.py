# backend/app.py
import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# load .env if present
load_dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(load_dotenv_path):
    from dotenv import load_dotenv as _load
    _load(load_dotenv_path)

from routes.overlay_routes import overlay_bp

app = Flask(__name__)
# Avoid automatic redirects for routes when trailing slash is missing.
# This prevents a preflight (OPTIONS) request from receiving a redirect,
# which would break CORS preflight checks in the browser.
app.url_map.strict_slashes = False

# CORS: allow your frontend origin (Vite default 5173). You can use "*" in dev.
CORS(
    app,
    origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

# Register blueprint for overlay API
app.register_blueprint(overlay_bp, url_prefix="/api/overlays")

@app.route("/")
def home():
    return jsonify({"message": "RTSP overlay backend running."})

# Serve HLS (.m3u8/.ts) files written by ffmpeg in ../streams
STREAMS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'streams'))
@app.route("/streams/<path:filename>")
def serve_streams(filename):
    # Security: in prod use nginx; this is for local dev only
    return send_from_directory(STREAMS_DIR, filename, conditional=True)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
