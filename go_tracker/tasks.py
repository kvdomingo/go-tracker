from celery.schedules import crontab

from go_tracker.celery import app
from go_tracker.logging import logger
from go_tracker.models import GroupOrder
from go_tracker.models.group_order import OrderStatus


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(crontab(minute="*"), check_payment_deadlines)


@app.task
def check_payment_deadlines():
    orders: list[GroupOrder] = GroupOrder.find(
        GroupOrder.status < OrderStatus.FULLY_PAID
    ).all()
    out = "\n".join([order.item for order in orders])
    logger.info(out)
