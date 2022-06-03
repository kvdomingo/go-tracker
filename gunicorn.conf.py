wsgi_app = "go_tracker.wsgi:application"

workers = 1
worker_class = "gevent"

timeout = 30

errorlog = "-"
accesslog = "-"
capture_output = True
loglevel = "debug"
