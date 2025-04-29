from werkzeug.exceptions import NotFound
from flask_jwt_extended import (create_access_token,
                                get_jwt_identity)
from flask import Blueprint

from core.pydantic_validation import pydantic_validation
from core.swagger_docs import swagger_docs
from users.schemas import UserSchemaLogin, TokenSchema
from users.services import UserService


users_bp = Blueprint('users', __name__, url_prefix='/api/users')


@users_bp.route("/signup", methods=["POST"])
@pydantic_validation
def signup(user_creds: UserSchemaLogin):
    user = UserService.create(user_creds.password, user_creds.username)
    access_token = create_access_token(identity=user.username)
    return TokenSchema(token=access_token), 201


@users_bp.route("/login/<int:id>", methods=["POST"])
@swagger_docs(description="Генерирует токен для пользователя", responses=[{200: TokenSchema}])
@pydantic_validation
def login(user_creds: UserSchemaLogin):
    user = UserService.get_by_pass_username(user_creds.password,
                                            user_creds.username)
    if user is None:
        raise NotFound("Username or password incorrect")

    access_token = create_access_token(identity=user.username)
    return TokenSchema(token=access_token), 200
