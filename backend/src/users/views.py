from werkzeug.exceptions import NotFound
from flask_jwt_extended import (create_access_token)
from flask import Blueprint

from core.jwt_auth import jwt_auth
from core.pydantic_validation import pydantic_validation
from core.swagger_docs import swagger_docs
from users.models import User
from users.schemas import UserSchemaLogin, TokenSchema
from users.services import UserService


users_bp = Blueprint('users', __name__, url_prefix='/api/users')


@users_bp.route("/signup", methods=["POST"])
@swagger_docs(description="Регистрирует нового пользователя и возвращает токен",
              responses=[{201: TokenSchema}])
@jwt_auth
@pydantic_validation
def signup(user_creds: UserSchemaLogin, ):
    user = UserService.create(user_creds.password, user_creds.username)
    access_token = create_access_token(identity=str(user.id))
    return TokenSchema(token=access_token), 201


@users_bp.route("/login", methods=["POST"])
@swagger_docs(description="Генерирует токен для пользователя",
              responses=[{200: TokenSchema}])
@jwt_auth
@pydantic_validation
def login():
    return None, 200
