from go_tracker.config import LOCAL_TZ, REDIS_OM_URL

broker_url = REDIS_OM_URL

result_backend = REDIS_OM_URL
result_expires = 60 * 5

timezone = LOCAL_TZ
enable_utc = True
