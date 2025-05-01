from app import db
from games.models import Game
from games.schemas import GameSchemaWrite, GameSchemaRead


class GameService:
    @staticmethod
    def get_by_id(id: int):
        return db.session.get(Game, id)


    @staticmethod
    def get_all():
        return db.session.query(Game).all()


    @staticmethod
    def create(obj: GameSchemaWrite) -> GameSchemaRead:
        game = Game(**obj.model_dump())
        db.session.add(game)
        db.session.commit()
        return game
