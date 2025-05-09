from http.client import responses

from flask_jwt_extended import (create_access_token)
from flask import Blueprint
from werkzeug.exceptions import Unauthorized, NotFound

from core.rest_api_extension import rest_api
from users.models import User
from users.schemas import UserSchemaLogin, TokenSchema, \
    UserSchemaSignUp, UserReadSchema, UsersListSchema, UsersListSchema, \
    UserNotFoundSchema
from users.services import UserService

users_bp = Blueprint('users', __name__, url_prefix='/api/users')


@users_bp.route("/signup", methods=["POST"])
@rest_api(
    description="Регистрирует пользователя и возвращает токен c самим пользователем",
    responses=[{201: TokenSchema}]
)
def signup(user_creds: UserSchemaSignUp):
    user = UserService.create(user_creds)
    access_token = create_access_token(identity=str(user.id))
    user.token = access_token
    return TokenSchema.model_validate(user, from_attributes=True), 201


@users_bp.route("/login", methods=["POST"])
@rest_api(
    description="Создает токен авторизации на основе пароля "
                "и юзернейма и возвращает его вместе с пользомателем",
    responses=[{200: TokenSchema}]
)
def login(user_creds: UserSchemaLogin):
    user = UserService.get_by_pass_username(user_creds.password,
                                            user_creds.username)
    if user is None:
        raise Unauthorized("Username or password incorrect")

    access_token = create_access_token(identity=user.username)
    user.token = access_token
    return TokenSchema.model_validate(user, from_attributes=True), 200


@users_bp.route("/protected", methods=["POST"])
@rest_api(description="Эндпоинт требующий токен в заголовке",
          responses=[{200: UserReadSchema}])
def protected_endpoint(user: User):
    return UserReadSchema.model_validate(user, from_attributes=True), 200


@users_bp.route("/<int:id>", methods=["GET"])
@rest_api(
    description="Получение пользователя по id",
    responses=[{200: UserReadSchema}, {404: UserNotFoundSchema}]
)
def get_user(id: int):
    user = UserService.get(id)
    if user is None:
        raise NotFound("User not found")


@users_bp.route("/", methods=["GET"])
@rest_api(
    description="Получение всех пользователей", responses=[{200: UsersListSchema}]
)
def get_users_list():
    users = UserService.get_all()
    return UsersListSchema(
        users=[UserReadSchema.model_validate(user, from_attributes=True) for
               user in users])


@users_bp.route("/profile", methods=["GET"])
@rest_api(
    description="Получение текущего авторизованного пользователя (из токена)",
    responses=[{200: UserReadSchema}]
)
def get_profile_user(authed_user: User):
    user = UserService.get(authed_user.id)

    return UserReadSchema.model_validate(user, from_attributes=True)
