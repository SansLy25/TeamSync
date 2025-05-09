from app import db
from bids.models import Bid
from games.models import Game
from bids.schemas import BidSchemaWrite, BidSchemaRead


class BidService:
    @staticmethod
    def get_by_id(id: int):
        return db.session.get(Bid, id)

    @staticmethod
    def get_all(desc=None, game_name=None):
        game_id = None
        if game_name:
            game_id = db.session.query(Game.id).filter(Game.name == game_name).first()
            if not game_id:
                return None
        if desc and game_id:
            return db.session.query(Bid).filter(game_id == Bid.game_id).filter(Bid.description.ilike(f'%{desc}%')).all()
        if desc and not game_id:
            return db.session.query(Bid).filter(Bid.description.ilike(f'%{desc}%')).all()
        if not desc and game_id:
            return db.session.query(Bid).filter(game_id == Bid.game_id).all()
        if not desc and not game_id:
            return db.session.query(Bid).all()

    @staticmethod
    def create(obj: BidSchemaWrite, user) -> BidSchemaRead:
        bid = Bid(game_id=obj.game_id, description=obj.description, details=obj.details, author_id=user.id, author=user)
        db.session.add(bid)
        db.session.commit()
        return bid
