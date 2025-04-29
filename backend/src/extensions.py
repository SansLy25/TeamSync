from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flasgger import Swagger

"""
Инициализация расширений
"""
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
swagger = Swagger()
