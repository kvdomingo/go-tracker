from redis_om import get_redis_connection
from go_tracker.config import REDIS_HOST, REDIS_PORT


redis_client = get_redis_connection(host=REDIS_HOST, port=REDIS_PORT)
