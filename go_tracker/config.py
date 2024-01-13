import os
from ast import literal_eval
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

PYTHON_ENV = os.environ.get("FLASK_ENV", "production")

BASE_DIR = Path(__file__).resolve().parent.parent

REDIS_HOST = os.environ.get("REDIS_HOST", "redis")

REDIS_PORT = os.environ.get("REDIS_PORT", 6379)

REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD")

REDIS_OM_URL = f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}"

os.environ.setdefault("REDIS_OM_URL", REDIS_OM_URL)

LOCAL_TZ = "Asia/Manila"

MAIL_SERVER = os.environ.get("MAIL_SERVER")

MAIL_PORT = literal_eval(os.environ.get("MAIL_PORT"))

MAIL_USERNAME = os.environ.get("MAIL_USERNAME")

MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")

MAIL_RECIPIENT = os.environ.get("MAIL_RECIPIENT")
