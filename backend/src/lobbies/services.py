from werkzeug.exceptions import NotFound

from app import db
from games.models import Game
from games.services import GameService
from lobbies.models import Lobby
from lobbies.schemas import LobbyWriteSchema
from users.models import User


class LobbyService:
    @staticmethod
    def get(id: int):
        return db.session.query(Lobby).get(id)

    @staticmethod
    def get_list(
            platform=None,
            min_skill=None,
            max_skill=None,
            open_slots=None,
            search_game=None
    ):
        query = db.session.query(User).join(Game)

        if min_skill:
            query = query.filter(Lobby.skill_level >= min_skill)
        if max_skill:
            query = query.filter(Lobby.skill_level <= max_skill)

        if search_game:
            query = query.filter(Game.name.like(f'%{search_game}%'))
        if open_slots:
            query = query.filter(Lobby.filled_slots < Lobby.slots)
        if platform:
            query = query.filter(Lobby.platform == platform)

        return query.all()

    @staticmethod
    def create(user: User, lobby_obj: LobbyWriteSchema):
        kwargs = lobby_obj.model_dump()
        game_id = kwargs.pop("game_id")
        game = GameService.get_by_id(game_id)
        if game is None:
            raise NotFound("Game not found")

        lobby = Lobby(
            game=game,
            author=user,
            members=[user],
            filled_slots=1,
            **kwargs
        )

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
            lobby.filled_slots += 1

        db.session.commit()
        return lobby

    @staticmethod
    def leave(user: User, lobby_id):
        lobby = LobbyService.get(lobby_id)
        if lobby is None:
            return None

        if user in lobby.members:
            lobby.members.remove(User)
            lobby.filled_slots -= 1
        if user == lobby.author:
            db.session.delete(lobby)

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
