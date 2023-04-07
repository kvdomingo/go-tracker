from celery import Celery

app = Celery("tasks")
app.config_from_object("go_tracker.celeryconfig")

if __name__ == "__main__":
    app.start()
