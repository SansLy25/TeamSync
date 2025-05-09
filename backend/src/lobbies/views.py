from flask import Blueprint

from core.rest_api_extension import rest_api
from lobbies.schemas import LobbyWriteSchema

lobbies_bp = Blueprint("lobbies", __name__, url_prefix="/api/lobbies")


@lobbies_bp.route("/", methods=["POST"])
@rest_api(
    description="Создание нового лобби"
)
def create_lobby(lobby: LobbyWriteSchema):
    pass