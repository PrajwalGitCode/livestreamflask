import { useState, useEffect } from "react";
import {
  getOverlays,
  createOverlay,
  deleteOverlay,
  updateOverlay,
} from "../api/overlayApi";

export default function OverlayManager({ onRefresh, onToggleVideo }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [width, setWidth] = useState(150);
  const [height, setHeight] = useState(50);
  const [overlays, setOverlays] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editText, setEditText] = useState("");
  const [editWidth, setEditWidth] = useState(150);
  const [editHeight, setEditHeight] = useState(50);

  // Load all overlays once on mount
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const res = await getOverlays();
      if (isMounted) setOverlays(res.data);
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchData = async () => {
    const res = await getOverlays();
    setOverlays(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const newOverlay = {
      name,
      text,
      position: { x: 50, y: 50 },
      size: { width: parseInt(width), height: parseInt(height) },
      active: false,
    };
    await createOverlay(newOverlay);
    setName("");
    setText("");
    setWidth(150);
    setHeight(50);
    fetchData();
    onRefresh();
  };

  const handleDelete = async (id) => {
    await deleteOverlay(id);
    setOverlays((prev) => prev.filter((o) => o._id !== id));
    onRefresh();
  };

  const startEdit = (overlay) => {
    setEditingId(overlay._id);
    setEditName(overlay.name);
    setEditText(overlay.text);
    setEditWidth(overlay.size?.width || 150);
    setEditHeight(overlay.size?.height || 50);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateOverlay(editingId, {
      name: editName,
      text: editText,
      size: { width: parseInt(editWidth), height: parseInt(editHeight) },
    });
    setEditingId(null);
    fetchData();
    onRefresh();
  };

  // ✅ Fixed version: only updates local state, no duplicate fetch
  const toggleActive = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    await updateOverlay(id, { active: updatedStatus });
    setOverlays((prev) =>
      prev.map((o) =>
        o._id === id ? { ...o, active: updatedStatus } : o
      )
    );
    onRefresh();
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-md mx-auto mt-6 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-5 text-center text-gray-800">
        Manage Overlays
      </h2>

      {/* Video toggle */}
      <div className="mb-4 flex items-center gap-2">
        <input
          id="showVideo"
          type="checkbox"
          defaultChecked={true}
          onChange={(e) => onToggleVideo && onToggleVideo(e.target.checked)}
          className="accent-blue-600"
        />
        <label htmlFor="showVideo" className="text-gray-700">
          Show video player
        </label>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="space-y-3">
        <input
          type="text"
          placeholder="Overlay Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Overlay Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-1/2 p-2 border rounded"
            min="50"
          />
          <input
            type="number"
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-1/2 p-2 border rounded"
            min="20"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Overlay
        </button>
      </form>

      {/* Overlay List */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2 text-gray-700">Existing Overlays</h3>
        <ul className="space-y-2">
          {overlays.map((ov) => (
            <li
              key={ov._id}
              className={`flex flex-col gap-2 p-3 rounded border ${
                ov.active
                  ? "bg-green-100 border-green-300"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {editingId === ov._id ? (
                <form onSubmit={handleUpdate} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="p-1 border rounded w-1/3"
                    />
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="p-1 border rounded w-1/2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editWidth}
                      onChange={(e) => setEditWidth(e.target.value)}
                      className="p-1 border rounded w-1/2"
                      min="50"
                    />
                    <input
                      type="number"
                      value={editHeight}
                      onChange={(e) => setEditHeight(e.target.value)}
                      className="p-1 border rounded w-1/2"
                      min="20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-green-600 font-semibold hover:text-green-800"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={ov.active || false}
                      onChange={() => toggleActive(ov._id, ov.active)}
                      className="accent-blue-600"
                    />
                    <div>
                      <span className="font-medium">{ov.name}</span>
                      <p className="text-sm text-gray-600 truncate">
                        {ov.text} ({ov.size?.width}x{ov.size?.height})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => startEdit(ov)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ov._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
