from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import Conflict

from app import db
from users.models import User

class UserService:
    @staticmethod
    def get(id):
        user = db.session.query(User).get(id)
        return user

    @staticmethod
    def create(user_creds):
        try:
            hashed_pass = generate_password_hash(user_creds.password, method="pbkdf2:sha256")
            delattr(user_creds, "password")
            user = User(password=hashed_pass, **user_creds.model_dump(mode="json"))
            db.session.add(user)
            db.session.commit()
        except IntegrityError as e:
            print(e)
            raise Conflict("User with this username already exists")
        return user

    @staticmethod
    def get_by_pass_username(password, username):
        user = db.session.query(User).filter_by(username=username).first()
        if not user:
            return None

        if check_password_hash(user.password, password):
            return user

        return None