from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

"""
Инициализация БД, сама логика и ORM запросы
находятся в файлах services.py
"""
def get_db_and_migrate_objects(app):
    db = SQLAlchemy(app)
    return db, Migrate(app, db, directory="database/migrations")
