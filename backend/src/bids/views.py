from flask import Blueprint, request
from core.rest_api_extension import rest_api
from users.models import User
from bids.models import Bid
from bids.schemas import BidSchemaWrite, BidSchemaRead, BidListSchema
from bids.services import BidService

bids_bp = Blueprint('bids', __name__, url_prefix='/api/bids')

"""@bids_bp.route("", methods=["GET"])
@rest_api(
     description="Получение списка заявок",
     responses=[{200: GameListSchema}],
)
def get_games_list():
     games = GameService.get_all()
     return GameListSchema(games=[GameSchemaRead.model_validate(game, from_attributes=True) for game in games])"""


@bids_bp.route("", methods=["POST"])
@rest_api(
    description="Создание заявки",
    responses=[{201: BidSchemaWrite}]
)
def create_bid(bid_obj: BidSchemaWrite, user: User):
    bid = BidService.create(bid_obj, user)
    return BidSchemaRead.model_validate(bid), 201


@bids_bp.route("/loa", methods=["GET"])
@rest_api(
    description="Получение списка игр",
    responses=[{200: BidListSchema}],
    query_params=["game_search", "description_search"]
)
def get_bids_list():
    desc_search = request.args.get('description_search')
    game_search = request.args.get('game_search')
    bids = BidService.get_all(desc=desc_search, game_name=game_search)
    if bids:
        return BidListSchema(bids=[BidSchemaRead.model_validate(bid, from_attributes=True) for bid in bids])
    return 404


@bids_bp.route("/<int:bid_id>", methods=["GET"])
@rest_api(
    description="Получение заявки по id",
    responses=[{200: BidSchemaRead}],
)
def get_bid(bid_id: int):
    bid = BidService.get_by_id(bid_id)
    if bid:
        return BidSchemaRead.model_validate(bid, from_attributes=True)
    return 404
