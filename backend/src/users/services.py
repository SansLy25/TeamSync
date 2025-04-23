import hashlib

from app import db
from models import User

class UserService:
    @staticmethod
    def get(id):
        user = db.session.query(User).get(id)
        return user


    @staticmethod
    def create(password, username):
        pass

