from flask import Flask
from .config import BASE_DIR


app = Flask(__name__, static_url_path="", static_folder=BASE_DIR / "web" / "app")


@app.route("/api")
def health():
    return "OK"
