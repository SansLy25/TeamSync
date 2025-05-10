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
        query = db.session.query(Bid).join(Game)

        if desc:
            query = query.filter(Bid.description.like(f'%{desc}%'))

        if game_name:
            query = query.filter(Game.name.like(f'%{game_name}%'))

        return query.all()

    @staticmethod
    def create(obj: BidSchemaWrite, user) -> BidSchemaRead:
        bid = Bid(game_id=obj.game_id, description=obj.description, details=obj.details, author_id=user.id, author=user)
        db.session.add(bid)
        db.session.commit()
        return bid
