import { useRef } from "react";
import Draggable from "react-draggable";

export default function OverlayItem({ overlay, onUpdate }) {
  const nodeRef = useRef(null);

  const handleStop = (e, data) => {
    onUpdate(overlay._id, { position: { x: data.x, y: data.y } });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: overlay.position?.x || 0, y: overlay.position?.y || 0 }}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className="absolute p-1 bg-white bg-opacity-70 border rounded cursor-move pointer-events-auto"
        style={{
          width: overlay.size?.width || 100,
          height: overlay.size?.height || 40,
          fontSize: overlay.fontSize || 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {overlay.text || overlay.name}
      </div>
    </Draggable>
  );
}
