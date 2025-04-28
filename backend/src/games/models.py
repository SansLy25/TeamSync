from app import db


class GameGenre(db.Model):
    __tablename__ = "game_genres"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)


class Game(db.Model):
    __tablename__ = "games"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(500), nullable=False)
    genre = db.relationship("GameGenre", back_populates="games", lazy=True)
    release_date = db.Column(db.Date, nullable=False)
    rating = db.Column(db.Float, nullable=False)

