
from flask_jwt_extended import (create_access_token)
from flask import Blueprint
from werkzeug.exceptions import NotFound

from core.exception_catcher import exception_catcher
from core.jwt_auth import jwt_auth
from core.pydantic_validation import pydantic_validation
from core.rest_api_extension import rest_api
from core.swagger_docs import swagger_docs
from users.models import User
from users.schemas import UserSchemaLogin, TokenSchema, UserIdSchema
from users.services import UserService

users_bp = Blueprint('users', __name__, url_prefix='/api/users')


@users_bp.route("/signup", methods=["POST"])
@rest_api(
    description="Регистрирует пользователя и возвращает токен",
    responses=[{201: TokenSchema}]
)
def signup(user_creds: UserSchemaLogin):
    user = UserService.create(user_creds.password, user_creds.username)
    access_token = create_access_token(identity=str(user.id))
    return TokenSchema(token=access_token), 201


@users_bp.route("/login", methods=["POST"])
@rest_api(
    description="Создает токен авторизации на основе пароля и юзернейма",
    responses=[{200: TokenSchema}]
)
def login(user_creds: UserSchemaLogin):
    user = UserService.get_by_pass_username(user_creds.password,
                                            user_creds.username)
    if user is None:
        raise NotFound("Username or password incorrect")

    access_token = create_access_token(identity=user.username)
    return TokenSchema(token=access_token), 200


@users_bp.route("/protected", methods=["POST"])
@rest_api(description="Эндпоинт требующий авторизации", responses=[{200: UserIdSchema}])
def protected_endpoint(user: User):
    return UserIdSchema(id=user.id), 200