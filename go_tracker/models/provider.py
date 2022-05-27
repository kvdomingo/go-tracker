from redis_om import JsonModel, Field, Migrator
from pydantic import AnyUrl


class Provider(JsonModel):
    name: str = Field(index=True)
    website: AnyUrl


Migrator().run()
