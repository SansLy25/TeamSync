from functools import wraps

from flask_jwt_extended.exceptions import JWTExtendedException
from werkzeug.exceptions import Unauthorized
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from core.utils import get_func_instance_arg

from jwt.exceptions import PyJWTError

def jwt_auth(view):
    """
    Выполняет jwt аутентификацию пользователя исходя из токена
    в заголовке Authorization
    """
    @wraps(view)
    def wrapper(*args, **kwargs):
        from users.models import User

        _, arg_name = get_func_instance_arg(view, User)
        if arg_name is None:
            return view(*args, **kwargs)

        try:
            verify_jwt_in_request()

            user_identity = get_jwt_identity()

            user = User.query.filter_by(id=int(user_identity)).first()
            kwargs[arg_name] = user
            if not user:
                raise Unauthorized("User not exist for this token or it expired")

            return view(*args, **kwargs)

        except (PyJWTError, JWTExtendedException) as e:
            raise Unauthorized(str(e))

    return wrapper

