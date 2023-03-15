import os.path

from flask import Flask, jsonify, send_from_directory

from .blueprints import group_order, provider
from .config import BASE_DIR, PYTHON_ENV

app = Flask(__name__, static_url_path="", static_folder=BASE_DIR / "ui")
app.register_blueprint(provider)
app.register_blueprint(group_order)


@app.route("/api")
def health():
    return jsonify({"status": "ok"})


if PYTHON_ENV != "development":

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path: str):
        if path != "" and os.path.exists(f"{app.static_folder}/{path}"):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, "index.html")

    @app.errorhandler(404)
    def not_found(_):
        return send_from_directory(app.static_folder, "index.html")
