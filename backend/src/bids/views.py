from flask import Blueprint, request
from core.rest_api_extension import rest_api
from ..users.models import User
from models import Bid
from schemas import BidSchemaWrite, BidSchemaRead, BidListSchema
from services import BidService
from app import app, db

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
def create_bid(bid_obj: BidSchemaWrite):
    bid = BidService.create(bid_obj)
    return BidSchemaRead.model_validate(bid)


@bids_bp.route("", methods=["GET"])
@rest_api(
    description="Получение списка игр",
    responses=[{200: BidListSchema}],
)
def get_bids_list():
    desc_search = request.args.get('description_search')
    game_search = request.args.get('game_search')
    bids = BidService.get_all(desc=desc_search, gameid=game_search)
    return BidListSchema(games=[BidSchemaRead.model_validate(bid, from_attributes=True) for bid in bids])

@bids_bp.route("/<int:bid_id>", methods=["GET"])
@rest_api(
    description="Получение списка игр по айди",
    responses=[{200: BidListSchema}],
)
def get_bids_list(bid_id: int):
    bids = BidService.get_by_id(bid_id)
    return BidListSchema(games=[BidSchemaRead.model_validate(bid, from_attributes=True) for bid in bids])
