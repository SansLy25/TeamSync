from app import db

class Bid(db.Model):
    __tablename__ = "bids"
    id = db.Column(db.Integer, primary_key=True)
    game = db.relationship("Game", back_populates="bids")
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
    description  = db.Column(db.String(500), nullable=False)
    details = db.Column(db.String(500), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    author = db.relationship("User", back_populates="bids")
