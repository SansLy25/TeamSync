from app import db


users = db.Table(
    'lobby_users_association', db.metadata,
    db.Column('lobby_id', db.Integer, db.ForeignKey('lobbies.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
)


class Lobby(db.Model):
    __tablename__ = "lobbies"
    id = db.Column(db.Integer, primary_key=True)
    members = db.relationship('User', secondary=users, backref="lobbies")
    platform = db.Column(db.String(30))
    author = db.relationship('User', backref="authored_lobbies")
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    skill_level = db.Column(db.Integer)
    goal = db.Column(db.String(100))
    slots = db.Column(db.Integer)
    filled_slots = db.Column(db.Integer)
    start_time = db.Column(db.DateTime)
    description = db.Column(db.Text)