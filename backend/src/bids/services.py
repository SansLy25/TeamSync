from app import db
from bids.models import Bid
from games.models import Game
from bids.schemas import BidSchemaWrite, BidSchemaRead


class BidService:
    @staticmethod
    def get_by_id(id: int):
        try:
            return db.session.get(Bid, id)
        except Exception:
            return None

    @staticmethod
    def get_all(desc=None, game_name=None):
        game_id = None
        if game_name:
            game_id = db.session.select(Game.id).where(Game.name == game_name)
        if desc and game_id:
            return db.session.query(Bid).filter(desc.lower() in Bid.description and game_id == Bid.game_id).all()
        if desc and not game_id:
            return db.session.query(Bid).filter(desc.lower() in Bid.description).all()
        if not desc and game_id:
            return db.session.query(Bid).filter(game_id == Bid.game_id).all()
        return db.session.query(Bid).all()

    @staticmethod
    def create(obj: BidSchemaWrite, user) -> BidSchemaRead:
        bid = Bid(author=user, **obj.model_dump())
        db.session.add(bid)
        db.session.commit()
        return bid
