from flask import session

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
        lobby = Lobby(author=user, members=[user], **lobby_obj.model_dump())
        db.session.add(lobby)
        db.session.commit()
        return lobby

    @staticmethod
    def join(user: User, lobby_id):
        lobby = LobbyService.get(lobby_id)
        if lobby is None:
            return None

        if user not in lobby.members:
            lobby.members.append(user)

        db.session.commit()
        return lobby

    @staticmethod
    def leave(user: User, lobby_id):
        lobby = LobbyService.get(lobby_id)
        if lobby is None:
            return None

        if user in lobby.members:
            lobby.members.remove(User)

        db.session.commit()
        return lobby


    @staticmethod
    def delete(lobby_id):
        lobby = LobbyService.get(lobby_id)
        if lobby is not None:
            db.session.delete(lobby)
            db.session.commit()
            return True
        return False
