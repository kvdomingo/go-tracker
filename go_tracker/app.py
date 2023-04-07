from flask import Flask
from flask_mail import Mail

from go_tracker.config import BASE_DIR, MAIL_CONFIG

app = Flask(__name__, static_url_path="", static_folder=BASE_DIR / "ui")
app.config.update(MAIL_CONFIG)

mail = Mail(app)
