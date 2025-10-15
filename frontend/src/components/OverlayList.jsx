import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { getOverlays, updateOverlay } from "../api/overlayApi";

export default function OverlayList() {
  const [overlays, setOverlays] = useState([]);

  useEffect(() => {
    fetchOverlays();
  }, []);

  const fetchOverlays = async () => {
    const res = await getOverlays();
    setOverlays(res.data.filter((o) => o.active));
  };

  const handleDragStop = async (id, d) => {
    const updated = overlays.map((o) =>
      o._id === id ? { ...o, position: { x: d.x, y: d.y } } : o
    );
    setOverlays(updated);
    await updateOverlay(id, { position: { x: d.x, y: d.y } });
  };

  const handleResizeStop = async (id, direction, ref, delta, position) => {
    const width = parseInt(ref.style.width);
    const height = parseInt(ref.style.height);
    const updated = overlays.map((o) =>
      o._id === id ? { ...o, size: { width, height }, position } : o
    );
    setOverlays(updated);
    await updateOverlay(id, { size: { width, height }, position });
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {overlays.map((ov) => (
        <Rnd
          key={ov._id}
          size={{
            width: ov.size?.width || 150,
            height: ov.size?.height || 50,
          }}
          position={{
            x: ov.position?.x || 50,
            y: ov.position?.y || 50,
          }}
          bounds="parent"
          enableResizing
          onDragStop={(e, d) => handleDragStop(ov._id, d)}
          onResizeStop={(e, dir, ref, delta, pos) =>
            handleResizeStop(ov._id, dir, ref, delta, pos)
          }
          className="pointer-events-auto"
        >
          <div className="bg-white/80 backdrop-blur-md border border-gray-400 text-black text-sm font-semibold flex items-center justify-center rounded shadow-md w-full h-full select-none cursor-move">
            {ov.text}
          </div>
        </Rnd>
      ))}
    </div>
  );
}
