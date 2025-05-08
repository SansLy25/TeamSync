from enum import Enum

from app import db
from sqlalchemy import String, Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, mapped_column

class UserGenderEnum(Enum):
    MALE = 'male'
    FEMALE = 'female'

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(300), nullable=False)
    bids = db.relationship("Bid", back_populates="author")
    # gender = db.Column(SQLAlchemyEnum(UserGenderEnum), nullable=False)
    # age = db.Column(db.Integer, nullable=False)
    # telegram_username = db.Column(db.String(50), nullable=True)
