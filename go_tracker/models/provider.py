from redis_om import JsonModel


class Provider(JsonModel):
    name: str
    twitter_username: str
