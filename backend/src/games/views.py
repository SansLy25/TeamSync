from flask import Blueprint
from core.rest_api_extension import rest_api
from games.schemas import GameListSchema, GameSchemaRead, GameSchemaWrite
from games.services import GameService


games_bp = Blueprint('games', __name__, url_prefix='/api/games')


@games_bp.route("", methods=["GET"])
@rest_api(
     description="Получение списка игр",
     responses=[{200: GameListSchema}],
)
def get_games_list():
     games = GameService.get_all()
     return GameListSchema(games=[GameSchemaRead.model_validate(game, from_attributes=True) for game in games])


@games_bp.route("", methods=["POST"])
@rest_api(
     description="Создание игры",
     responses=[{200: GameSchemaRead}]
)
def create_game(game_obj: GameSchemaWrite):
     game = GameService.create(game_obj)
     return GameSchemaRead.model_validate(game)

