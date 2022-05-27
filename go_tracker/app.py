from flask import Flask, jsonify
from .blueprints import group_order, provider
from .config import BASE_DIR


app = Flask(__name__, static_url_path="", static_folder=BASE_DIR / "web" / "app")
app.register_blueprint(provider)
app.register_blueprint(group_order)


@app.route("/api")
def health():
    return jsonify({"status": "ok"})
