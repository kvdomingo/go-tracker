from flask import Flask

from go_tracker.config import BASE_DIR

app = Flask(__name__, static_url_path="", static_folder=BASE_DIR / "ui")
