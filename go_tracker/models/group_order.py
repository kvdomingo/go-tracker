from enum import Enum
from datetime import datetime
from redis_om import JsonModel, Field
from typing import Optional


def get_timestamp():
    return int(datetime.utcnow().timestamp() * 1000)


class OrderStatus(Enum):
    UNPAID = 0
    PARTIALLY_PAID = 1
    FULLY_PAID = 2
    SHIPPED = 3
    DELIVERED = 4


class GroupOrder(JsonModel):
    item: str
    provider_name: str
    order_number: str
    order_date: int = Field(default_factory=get_timestamp)
    downpayment_deadline: Optional[datetime]
    payment_deadline: datetime
    status: OrderStatus
