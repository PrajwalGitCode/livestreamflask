RTSP Overlay App — Quick README
================================

This repo is a small RTSP -> HLS streaming demo with overlay management (Flask + MongoDB backend, React frontend).

Quick start (dev)
- Install backend deps (create/activate venv first):
  pip install -r backend/requirements.txt  # or: pip install flask flask-cors python-dotenv pymongo dnspython
- Start backend (serves API and HLS files):
  python backend/app.py
- Install and run frontend (from repo root):
  cd frontend
  npm install
  npm run dev

Streaming (RTSP -> HLS)
- Install ffmpeg and ensure `ffmpeg.exe` is on your PATH.
- From the `backend` folder run the helper script and pass your RTSP URL:
  .\run_stream.ps1 -rtsp "rtsp://<your-stream>"
- The script writes HLS files to `backend/streams/hls/`. The frontend reads:
  http://localhost:5000/streams/hls/index.m3u8

Backend API (CRUD for overlays)
- Base URL: http://localhost:5000/api/overlays

- Create overlay (POST)
  POST /api/overlays
  JSON body example:
  {
    "name": "logo",
    "text": "My Overlay",
    "position": { "x": 10, "y": 20 },
    "size": { "width": 120, "height": 40 },
    "active": true
  }

  Response: 201 Created with {"_id": "...", "overlay": { ... }}

- List overlays (GET)
  GET /api/overlays
  Response: 200 OK, array of overlay objects

- Get single overlay (GET)
  GET /api/overlays/<id>

- Update overlay (PUT)
  PUT /api/overlays/<id>
  Body: partial or full overlay object (JSON). Example to toggle active:
  { "active": false }

- Delete overlay (DELETE)
  DELETE /api/overlays/<id>

Notes & data shape
- Overlays are simple JSON documents saved in MongoDB. Common fields:
  - _id: string (MongoDB ObjectId as string)
  - name: string
  - text: string (display text)
  - position: { x: number, y: number }
  - size: { width: number, height: number }
  - active: boolean (manager checkbox controls visibility)

Frontend usage
- Open http://localhost:5173 (Vite dev server). The UI has:
  - Video player (can be toggled via the manager checkbox).
  - Overlay Manager: add, edit, delete overlays and toggle active.
  - Overlay List: draggable overlays displayed on top of video when active.

Troubleshooting
- If VideoPlayer reports playlist 404: ensure ffmpeg produced `index.m3u8` in `backend/streams/hls/` and backend is running.
- If CORS/preflight errors appear: ensure backend is running on port 5000 and CORS config in `backend/app.py` allows `http://localhost:5173`.
- If MongoDB errors occur: set `MONGO_URI` and `DB_NAME` environment variables or update `backend/utils/db.py`.

<img width="1856" height="867" alt="image" src="https://github.com/user-attachments/assets/d7d34b96-3d0c-4042-83a5-231d3dfab11c" />

<img width="1537" height="886" alt="image" src="https://github.com/user-attachments/assets/7957c059-da04-42a3-9a46-5682bef5a4e5" />

