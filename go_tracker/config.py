import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

PYTHON_ENV = os.environ.get("FLASK_ENV", "production")

BASE_DIR = Path(__file__).resolve().parent.parent

REDIS_HOST = os.environ.get("REDIS_HOST")

REDIS_PORT = os.environ.get("REDIS_PORT")
