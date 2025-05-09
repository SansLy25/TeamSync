from flask import Blueprint, request
from types import SimpleNamespace
from werkzeug.exceptions import NotFound

from core.rest_api_extension import rest_api
from lobbies.schemas import LobbyWriteSchema, LobbyReadSchema, LobbyListSchema, \
    NonResponseSchema
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


@lobbies_bp.route("/<int:lobby_id>", methods=["GET"])
@rest_api(
    description="Получение лобби по id",
    responses=[{200: LobbyReadSchema}]
)
def get_lobby(lobby_id: int):
    lobby = LobbyService.get(lobby_id)
    if lobby is None:
        raise NotFound("Lobby not found")
    return LobbyReadSchema.model_validate(lobby, from_attributes=True)


@lobbies_bp.route("/", methods=["GET"])
@rest_api(
    description="Получение списка лобби с фильтрацией",
    responses=[{200: LobbyReadSchema}],
    query_params=[
        "platform",
        "search_game",
        "min_skill",
        "max_skill",
        "open_slots",
    ]
)
def get_list_lobby():
    query = request.args
    min_skill = query.get("min_skill")
    max_skill = query.get("max_skill")
    lobbies = LobbyService.get_list(
        platform=query.get('platform'),
        min_skill=int(min_skill) if min_skill else None,
        max_skill=int(max_skill) if max_skill else None,
        search_game=query.get("search_game"),
        open_slots=query.get("open_slots") == "true"
    )

    return LobbyListSchema(
        lobbies=[LobbyReadSchema.model_validate(lobby, from_attributes=True)
                 for lobby in lobbies])


@lobbies_bp.route("/<int:lobby_id>/join", methods=["PATCH"])
@rest_api(
    description="Присоединение к лобби, идемпотентен",
    responses=[{200: LobbyReadSchema}]

)
def join_lobby(user: User, lobby_id):
    lobby = LobbyService.join(user, lobby_id)
    if lobby is None:
        raise NotFound("Lobby not found")

    return LobbyReadSchema.model_validate(lobby, from_attributes=True)


@lobbies_bp.route("/<int:lobby_id>/leave", methods=["DELETE"])
@rest_api(
    description="Выход из лобби, идемпотентен (если пользователя"
                " нет в данном лобби то ошибки не будет), если"
                " пользователь создатель лобби это его удаляет",
    responses=[{204: NonResponseSchema}],
)
def leave_lobby(user: User, lobby_id):
    lobby = LobbyService.leave(user, lobby_id)
    if lobby is None:
        raise NotFound("Lobby not found")

    return None, 204

# @lobbies_bp.route("/", methods=["GET"])
# @rest_api(
#     description="Получение всех лобби",
#     responses=[{200: LobbyReadSchema}]
# )
# def get_lobbies():
# lobby = LobbyService.create(user, lobby_obj)
# return LobbyReadSchema.model_validate(lobby, from_attributes=True), 200
