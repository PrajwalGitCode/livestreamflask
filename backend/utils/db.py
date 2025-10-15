import os
from pymongo import MongoClient

# Read sensitive config from environment when available. Keep the existing
# connection string as a fallback for local/dev convenience.
MONGO_URI = os.getenv(
	"MONGO_URI",
	"mongodb+srv://streamuser:streampass@streamcluster.qwczaw8.mongodb.net/?retryWrites=true&w=majority&appName=streamcluster",
)
DB_NAME = os.getenv("DB_NAME", "rtsp_app")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Default overlays collection used by the routes
overlays_collection = db["overlays"]

def get_collection(name: str = "overlays"):
	"""Return a collection object from the configured database."""
	return db[name]

__all__ = ["client", "db", "overlays_collection", "get_collection"]
