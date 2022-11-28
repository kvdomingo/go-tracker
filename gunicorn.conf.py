wsgi_app = "go_tracker.wsgi:application"

worker_class = "gevent"

timeout = 30

errorlog = "-"
accesslog = "-"
capture_output = True
loglevel = "debug"
