from http import HTTPStatus

from flask import Blueprint, Response, jsonify, request
from pydantic import ValidationError

from go_tracker.logging import logger
from go_tracker.models import Provider

provider = Blueprint("provider", __name__, url_prefix="/api/provider")


@provider.route("", methods=["GET", "POST", "PATCH", "DELETE"], defaults={"pk": ""})
@provider.route("<string:pk>", methods=["GET", "POST", "PATCH", "DELETE"])
def provider_view(pk: str):
    if pk and request.method == "POST":
        return Response(status=HTTPStatus.METHOD_NOT_ALLOWED)
    if not pk and request.method in ["PATCH", "DELETE"]:
        return Response({"error": "Missing `pk`"}, status=HTTPStatus.BAD_REQUEST)

    match request.method:
        case "GET":
            if pk:
                prov = Provider.get(pk)
                return jsonify(prov.dict())
            else:
                providers: list[Provider] = sorted(
                    [Provider.get(pk) for pk in Provider.all_pks()],
                    key=lambda pv: pv.name,
                )
                return jsonify([p.dict() for p in providers])
        case "POST":
            req = request.json
            if not req:
                return Response({"error": "Empty body"}, status=HTTPStatus.BAD_REQUEST)
            try:
                prov = Provider(**req)
                match = Provider.find(Provider.name == prov.name).all()
                logger.info(match)
                if len(match) > 0:
                    return Response(
                        f"Provider {prov.name} already exists",
                        status=HTTPStatus.CONFLICT,
                    )
                prov.save()
                return Response(
                    prov.json(),
                    status=HTTPStatus.CREATED,
                    content_type="application/json",
                )
            except ValidationError as e:
                return Response(
                    str(e),
                    status=HTTPStatus.BAD_REQUEST,
                    content_type="application/json",
                )
        case "PATCH":
            req = request.json
            if not req:
                return Response({"error": "Empty body"}, status=HTTPStatus.BAD_REQUEST)
            try:
                prov = Provider.get(pk)
                prov.update(**req)
                return Response(
                    prov.json(), status=HTTPStatus.OK, content_type="application/json"
                )
            except ValidationError as e:
                return Response(
                    str(e),
                    status=HTTPStatus.BAD_REQUEST,
                    content_type="application/json",
                )
        case "DELETE":
            Provider.delete(pk)
            return Response(status=HTTPStatus.NO_CONTENT)
