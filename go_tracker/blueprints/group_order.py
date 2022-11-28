from http import HTTPStatus

from flask import Blueprint, Response, jsonify, request
from pydantic import ValidationError
from redis_om import NotFoundError

from ..models import GroupOrder, Provider
from ..models.group_order import OrderStatus

group_order = Blueprint("group_order", __name__)


@group_order.route("/api/order", methods=["GET", "POST", "PATCH", "DELETE"], defaults={"pk": ""})
@group_order.route("/api/order/<string:pk>", methods=["GET", "POST", "PATCH", "DELETE"])
def order_view(pk: str):
    if pk and request.method == "POST":
        return Response(status=HTTPStatus.METHOD_NOT_ALLOWED)
    if not pk and request.method in ["PATCH", "DELETE"]:
        return Response({"error": "Missing `pk`"}, status=HTTPStatus.BAD_REQUEST)

    match request.method:
        case "GET":
            if pk:
                order = GroupOrder.get(pk)
                return jsonify(order.dict())
            else:
                show_completed = request.args.get("showCompleted", False)
                orders: list[GroupOrder]
                if show_completed:
                    orders = [GroupOrder.get(pk) for pk in GroupOrder.all_pks()]
                else:
                    orders = [order for order in GroupOrder.find(GroupOrder.status != OrderStatus.DELIVERED).all()]
                orders = sorted(orders, key=lambda o: o.order_date, reverse=True)
                return jsonify([order.dict() for order in orders])
        case "POST":
            req = request.json
            if not req:
                return Response({"error", "Empty body"}, status=HTTPStatus.BAD_REQUEST)
            try:
                if req.get("provider") is None:
                    return Response({"error": "provider is required"}, status=HTTPStatus.BAD_REQUEST)
                else:
                    pk = req.get("provider")["pk"]
                try:
                    provider = Provider.get(pk)
                except NotFoundError:
                    return Response(
                        {"Error": f"Provider with {pk=} not found"},
                        status=HTTPStatus.BAD_REQUEST,
                    )
                req.update({"provider": provider})
                order = GroupOrder(**req)
                order.save()
                return Response(order.json(), status=HTTPStatus.CREATED, content_type="application/json")
            except ValidationError as e:
                return Response(str(e), status=HTTPStatus.BAD_REQUEST, content_type="application/json")
        case "PATCH":
            req = request.json
            if not req:
                return Response({"error": "Empty body"}, status=HTTPStatus.BAD_REQUEST)
            try:
                order = GroupOrder.get(pk)
                order.update(**req)
                return Response(order.json(), status=HTTPStatus.OK, content_type="application/json")
            except ValidationError as e:
                return Response({"error": str(e)}, status=HTTPStatus.BAD_REQUEST, content_type="application/json")
        case "DELETE":
            GroupOrder.delete(pk)
            return Response(status=HTTPStatus.NO_CONTENT)
