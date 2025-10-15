# backend/routes/overlay_routes.py
from flask import Blueprint, request, jsonify
from bson import ObjectId
from utils import db as dbutils
from models import overlay_model

overlay_bp = Blueprint("overlay_bp", __name__)

# Use shared collection from utils.db
collection = getattr(dbutils, "overlays_collection", None)

def to_json(doc):
    return overlay_model.doc_to_json(doc)

@overlay_bp.route("/", methods=["POST"])
def create_overlay():
    data = request.get_json(force=True)
    if not data:
        return jsonify({"error":"No JSON supplied"}), 400
    # minimal defaults
    doc = overlay_model.default_overlay(data)
    if collection is None:
        return jsonify({"error": "Database not configured"}), 500
    result = collection.insert_one(doc)
    return jsonify({"_id": str(result.inserted_id), "overlay": to_json(doc)}), 201

@overlay_bp.route("/", methods=["GET"])
def list_overlays():
    if collection is None:
        return jsonify({"error": "Database not configured"}), 500
    docs = [to_json(d) for d in collection.find({})]
    return jsonify(docs), 200

@overlay_bp.route("/<id>", methods=["GET"])
def get_overlay(id):
    if collection is None:
        return jsonify({"error": "Database not configured"}), 500
    try:
        oid = ObjectId(id)
    except Exception:
        return jsonify({"error": "Invalid id"}), 400
    doc = collection.find_one({"_id": oid})
    if not doc:
        return jsonify({"error":"Not found"}), 404
    return jsonify(to_json(doc)), 200

@overlay_bp.route("/<id>", methods=["PUT"])
def update_overlay(id):
    data = request.get_json(force=True)
    if not data:
        return jsonify({"error":"No JSON supplied"}), 400
    if collection is None:
        return jsonify({"error": "Database not configured"}), 500
    try:
        oid = ObjectId(id)
    except Exception:
        return jsonify({"error": "Invalid id"}), 400
    res = collection.update_one({"_id": oid}, {"$set": data})
    if res.matched_count == 0:
        return jsonify({"error":"Not found"}), 404
    return jsonify({"ok": True}), 200

@overlay_bp.route("/<id>", methods=["DELETE"])
def delete_overlay(id):
    if collection is None:
        return jsonify({"error": "Database not configured"}), 500
    try:
        oid = ObjectId(id)
    except Exception:
        return jsonify({"error": "Invalid id"}), 400
    res = collection.delete_one({"_id": oid})
    if res.deleted_count == 0:
        return jsonify({"error":"Not found"}), 404
    return jsonify({"ok": True}), 200
