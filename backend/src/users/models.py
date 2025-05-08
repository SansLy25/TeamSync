from enum import Enum

from app import db


class UserGenderEnum(Enum):
    MALE = 'male'
    FEMALE = 'female'


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(300), nullable=False)
    bids = db.relationship("Bid", back_populates="author")
    gender = db.Column(db.String(30), nullable=False)
    bio = db.Column(db.Text(), nullable=False)
    avatar = db.Column(db.String(200), nullable=True)
    telegram_contact = db.Column(db.String(50), nullable=True)
    discord_contact = db.Column(db.String(50), nullable=True)
    steam_contact = db.Column(db.String(50), nullable=True)
