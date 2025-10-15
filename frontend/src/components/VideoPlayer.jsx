import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer({ src }) {
  const videoRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    if (!src) return;

    let hls = null;

    const setupHls = async () => {
      try {
        const res = await fetch(src, { method: "HEAD" });
        if (!res.ok) {
          console.warn("HLS playlist not available yet:", src, res.status);
          return;
        }

        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
          video.addEventListener("loadedmetadata", () => {
            video.play().catch(() => {});
          });
        }
      } catch (err) {
        console.warn("Error checking HLS playlist:", err);
      }
    };

    setupHls();

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <div className="flex justify-center items-center w-full min-h-[80vh] bg-black relative">
      <div className="relative w-[90vw] md:w-[1300px] aspect-[16/9] bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
        <video
          ref={videoRef}
          controls
          playsInline
          className="absolute inset-0 w-full h-full object-contain bg-black"
        />
        {/* ❌ Removed OverlayCanvas — overlays now handled by OverlayList in App.jsx */}
      </div>
    </div>
  );
}
