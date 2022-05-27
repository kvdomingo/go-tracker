import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

PYTHON_ENV = os.environ.get("FLASK_ENV", "production")

BASE_DIR = Path(__file__).resolve().parent.parent

REDIS_HOST = os.environ.get("REDIS_HOST", "redis")

REDIS_PORT = os.environ.get("REDIS_PORT", 6379)

REDIS_OM_URL = os.environ.get("REDIS_OM_URL")
