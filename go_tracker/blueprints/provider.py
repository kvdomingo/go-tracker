from flask import Blueprint, jsonify, Response, request
from http import HTTPStatus as status
from pydantic import ValidationError
from ..log import logger
from ..models import Provider


provider = Blueprint("provider", __name__)


@provider.route("/api/provider", methods=["GET", "POST"])
def list_providers():
    match request.method:
        case "GET":
            providers: list[Provider] = sorted([Provider.get(pk) for pk in Provider.all_pks()], key=lambda p: p.name)
            return jsonify([provider.dict() for provider in providers])
        case "POST":
            req = request.json
            if not req:
                return Response("Error: empty body", status=status.BAD_REQUEST)
            try:
                provider = Provider(**req)
                match = Provider.find(Provider.name == provider.name).all()
                logger.info(match)
                if len(match) > 0:
                    return Response(f"Provider {provider.name} already exists", status=status.CONFLICT)
                provider.save()
                return Response(provider.json(), status=status.CREATED, content_type="application/json")
            except ValidationError as e:
                return Response(str(e), status=status.BAD_REQUEST, content_type="application/json")


@provider.route("/api/provider/<string:pk>", methods=["GET", "PATCH", "DELETE"])
def op_provider(pk: str):
    match request.method:
        case "GET":
            provider = Provider.get(pk)
            return jsonify(provider.dict())
        case "PATCH":
            req = request.json
            if not req:
                return Response("Error: empty body", status=status.BAD_REQUEST)
            try:
                provider = Provider.get(pk)
                provider.update(**req)
                return Response(provider.json(), status=status.OK, content_type="application/json")
            except ValidationError as e:
                return Response(str(e), status=status.BAD_REQUEST, content_type="application/json")
        case "DELETE":
            Provider.delete(pk)
            return Response(status=status.NO_CONTENT)
