import os

from flask import jsonify, send_from_directory

from go_tracker.app import app
from go_tracker.blueprints import group_order, provider
from go_tracker.config import PYTHON_ENV

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


__all__ = ["app"]
