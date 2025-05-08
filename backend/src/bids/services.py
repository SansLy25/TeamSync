from app import db
from models import Bid
from schemas import BidSchemaWrite, BidSchemaRead


class BidService:
    @staticmethod
    def get_by_id(id: int):
        return db.session.get(Bid, id)

    @staticmethod
    def get_all(desc=None, gameid=None):
        if desc and gameid:
            return db.session.query(Bid).filter(desc.lower() in Bid.description and gameid == Bid.game_id).all()
        if desc and not gameid:
            return db.session.query(Bid).filter(desc.lower() in Bid.description).all()
        if not desc and gameid:
            return db.session.query(Bid).filter(gameid == Bid.game_id).all()
        return db.session.query(Bid).all()

    @staticmethod
    def create(obj: BidSchemaWrite) -> BidSchemaRead:
        bid = Bid(**obj.model_dump())
        db.session.add(bid)
        db.session.commit()
        return bid
