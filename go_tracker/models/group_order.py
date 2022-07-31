from datetime import datetime
from enum import IntEnum
from typing import Optional

from pydantic import confloat
from redis_om import Field, JsonModel, Migrator

from .provider import Provider


def get_timestamp():
    return int(datetime.utcnow().timestamp() * 1000)


class OrderStatus(IntEnum):
    UNPAID = 0
    PARTIALLY_PAID = 1
    FULLY_PAID = 2
    SHIPPED = 3
    DELIVERED = 4


class GroupOrder(JsonModel):
    item: str
    provider: Provider
    order_number: str
    order_date: int = Field(default_factory=get_timestamp)
    downpayment_deadline: Optional[int]
    payment_deadline: int
    status: OrderStatus = Field(index=True, default=OrderStatus.UNPAID.value)
    total_balance: confloat(ge=0) = Field(default=0.0)
    remaining_balance: confloat(ge=0) = Field(default=0.0)


Migrator().run()
