

from app import db


class GameGenre(db.Model):
    __tablename__ = "game_genres"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    games = db.relationship("Game", back_populates="genre", lazy=True)


class Game(db.Model):
    __tablename__ = "games"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    genre = db.relationship("GameGenre", back_populates="games", lazy=True)
    genre_id = db.Column(db.Integer, db.ForeignKey("game_genres.id"))
    release_date = db.Column(db.Date, nullable=False)
    url_image = db.Column(db.String, nullable=True)
