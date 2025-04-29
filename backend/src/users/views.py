
from flask_jwt_extended import (create_access_token)
from flask import Blueprint
from werkzeug.exceptions import NotFound

from core.exception_catcher import exception_catcher
from core.jwt_auth import jwt_auth
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


@users_bp.route("/login", methods=["POST"])
@swagger_docs(description="Login user", responses=[{200: TokenSchema}])
@exception_catcher
@jwt_auth
@pydantic_validation
def login(user_creds: UserSchemaLogin):
    user = UserService.get_by_pass_username(user_creds.password,
                                            user_creds.username)
    if user is None:
        raise NotFound("Username or password incorrect")

    access_token = create_access_token(identity=user.username)
    return TokenSchema(token=access_token), 200