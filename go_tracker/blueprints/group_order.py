from flask import Blueprint, jsonify, Response, request
from http import HTTPStatus as status
from pydantic import ValidationError
from redis_om import NotFoundError
from ..models import GroupOrder, Provider
from ..models.group_order import OrderStatus

group_order = Blueprint("group_order", __name__)


@group_order.route("/api/order", methods=["GET", "POST"])
def list_orders():
    match request.method:
        case "GET":
            show_done = request.args.get("show_done", False)
            if show_done:
                orders = [GroupOrder.get(pk).dict() for pk in GroupOrder.all_pks()]
            else:
                orders = [order.dict() for order in GroupOrder.find(GroupOrder.status != OrderStatus.DELIVERED).all()]
            return jsonify(orders)
        case "POST":
            req = request.json
            if not req:
                return Response("Error: empty body", status=status.BAD_REQUEST)
            try:
                if req.get("provider") is None:
                    return Response("Error: provider is required", status=status.BAD_REQUEST)
                else:
                    provider = req.pop("provider")
                try:
                    provider = Provider.get(provider)
                except NotFoundError:
                    return Response(
                        f'Error: Provider with id "{provider}" not found',
                        status=status.BAD_REQUEST,
                    )
                req.update({"provider": provider})
                order = GroupOrder(**req)
                order.save()
                return Response(order.json(), status=status.CREATED, content_type="application/json")
            except ValidationError as e:
                return Response(str(e), status=status.BAD_REQUEST, content_type="application/json")


@group_order.route("/api/order/<string:pk>", methods=["GET", "PATCH", "DELETE"])
def op_order(pk: str):
    match request.method:
        case "GET":
            order = GroupOrder.get(pk)
            return jsonify(order.dict())
        case "PATCH":
            req = request.json
            if not req:
                return Response("Error: empty body", status=status.BAD_REQUEST)
            try:
                order = GroupOrder.get(pk)
                order.update(**req)
                return Response(order.json(), status=status.OK, content_type="application/json")
            except ValidationError as e:
                return Response(str(e), status=status.BAD_REQUEST, content_type="application/json")
        case "DELETE":
            GroupOrder.delete(pk)
            return Response(status=status.NO_CONTENT)
