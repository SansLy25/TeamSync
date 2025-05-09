from app import db


class Game(db.Model):
    __tablename__ = "games"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    release_date = db.Column(db.Date, nullable=False)
    url_image = db.Column(db.String, nullable=True)
    bids = db.relationship("Bid", back_populates="game")
