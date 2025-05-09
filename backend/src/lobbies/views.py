from http.client import responses

from flask import Blueprint
from werkzeug.exceptions import NotFound

from core.rest_api_extension import rest_api
from lobbies.schemas import LobbyWriteSchema, LobbyReadSchema
from lobbies.services import LobbyService
from users.models import User

lobbies_bp = Blueprint("lobbies", __name__, url_prefix="/api/lobbies")


@lobbies_bp.route("/", methods=["POST"])
@rest_api(
    description="Создание нового лобби",
    responses=[{201: LobbyReadSchema}]
)
def create_lobby(user: User, lobby_obj: LobbyWriteSchema):
    lobby = LobbyService.create(user, lobby_obj)
    return LobbyReadSchema.model_validate(lobby, from_attributes=True), 201


@lobbies_bp.route("/<int:lobby_id>", methods=["POST"])
@rest_api(
    description="Получение лобби по id",
    responses=[{201: LobbyReadSchema}]
)
def get_lobby(lobby_id: int):
    lobby = LobbyService.get(lobby_id)
    return LobbyReadSchema.model_validate(lobby, from_attributes=True)


# @lobbies_bp.route("/", methods=["GET"])
# @rest_api(
#     description="Получение всех лобби",
#     responses=[{200: LobbyReadSchema}]
# )
# def get_lobbies():
# # lobby = LobbyService.create(user, lobby_obj)
# # return LobbyReadSchema.model_validate(lobby, from_attributes=True), 200
