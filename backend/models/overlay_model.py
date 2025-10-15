from typing import Any, Dict

def default_overlay(data: Dict[str, Any]) -> Dict[str, Any]:
    """Return a copy of data with sensible defaults for missing fields."""
    doc = dict(data or {})
    doc.setdefault("name", "overlay")
    doc.setdefault("position", {"x": 0, "y": 0})
    doc.setdefault("size", {"width": 100, "height": 40})
    # content can be text or image metadata
    doc.setdefault("content", {"type": "text", "text": ""})
    return doc

def doc_to_json(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a MongoDB document to a JSON-serializable dict.

    This will copy the document and convert the ObjectId to a string.
    """
    if not doc:
        return None
    out = dict(doc)
    # _id may be an ObjectId; convert to str for JSON
    try:
        out["_id"] = str(out.get("_id"))
    except Exception:
        out["_id"] = out.get("_id")
    return out
