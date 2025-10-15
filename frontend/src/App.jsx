import { useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import OverlayList from "./components/OverlayList";
import OverlayManager from "./components/OverlayManager";

function App() {
  const [refresh, setRefresh] = useState(false);
  const hlsUrl = "http://localhost:5000/streams/hls/index.m3u8";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        🎥 RTSP Livestream with Overlays
      </h1>

      <div className="relative">
        <VideoPlayer src={hlsUrl} />
        <OverlayList key={refresh} />
      </div>

      <OverlayManager onRefresh={() => setRefresh((r) => !r)} />
    </div>
  );
}

export default App;
