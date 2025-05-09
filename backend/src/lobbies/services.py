from app import db
from lobbies.models import Lobby
from lobbies.schemas import LobbyWriteSchema
from users.models import User


class LobbyService:
    @staticmethod
    def get(id: int):
        return db.session.query(Lobby).get(id)


    @staticmethod
    def create(user: User, lobby_obj: LobbyWriteSchema):

        lobby = Lobby(author=user, **lobby_obj.model_dump())
        db.session.add(lobby)
        db.session.commit()
        return
