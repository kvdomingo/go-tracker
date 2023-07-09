import smtplib
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from celery.schedules import crontab

from go_tracker.celery import app
from go_tracker.config import (
    MAIL_PASSWORD,
    MAIL_PORT,
    MAIL_RECIPIENT,
    MAIL_SERVER,
    MAIL_USERNAME,
)
from go_tracker.jinja2 import get_jinja2_env
from go_tracker.logging import logger
from go_tracker.models import GroupOrder
from go_tracker.models.group_order import OrderStatus


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(crontab(hour=0, minute=0), payment_deadline_reminder)


@app.task
def payment_deadline_reminder():
    orders: list[GroupOrder] = GroupOrder.find(
        GroupOrder.status < OrderStatus.FULLY_PAID
    ).all()

    to_remind = []
    for order in orders:
        payment_deadline_plus1 = datetime.fromtimestamp(order.payment_deadline // 1000)
        payment_deadline_plus1 = payment_deadline_plus1.replace(
            day=payment_deadline_plus1.day + 1
        )
        today_midnight = datetime.now().replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        if payment_deadline_plus1 - today_midnight < timedelta(days=3):
            to_remind.append(
                {
                    **order.dict(),
                    "payment_deadline": datetime.fromtimestamp(
                        order.payment_deadline // 1000
                    ).strftime("%Y-%m-%d"),
                }
            )

    if len(to_remind) == 0:
        return 0

    logger.debug(to_remind)

    text = """
Hi,

This is to remind you that the following GOs are due for payment in less than 2 days:

    """
    text += "\n".join(
        [
            f'{t["item"]} - P{t["total_balance"]} - {t["payment_deadline"]}'
            for t in to_remind
        ]
    )
    text += "\ngo-tracker"

    env = get_jinja2_env()
    template = env.get_template("unpaid_balance.html.j2")
    subject = "GO Tracker - Unpaid Balances"
    html = template.render(subject=subject, orders=to_remind)

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = MAIL_USERNAME
    msg["To"] = MAIL_RECIPIENT
    msg.attach(part1)
    msg.attach(part2)

    try:
        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        server.starttls()
        server.ehlo()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(msg["From"], msg["To"], msg.as_string())
        return len(orders)
    except Exception as e:
        logger.exception(e)
        return 0
    finally:
        server.quit()
