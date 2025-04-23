from flask import Flask
from dotenv import load_dotenv
from os import getenv

from database.create_db import get_db_and_migrate_objects

load_dotenv()
app = Flask(__name__)

CONFIG = {
    # Дополнительные параметры конфигурации добавлять в этот словарь

    "DATABASE": {
        "POSTGRES_HOST": getenv("POSTGRES_HOST", "localhost"),
        "POSTGRES_PORT": 5432,
        "POSTGRES_USER": getenv("POSTGRES_USER", "postgres"),
        "POSTGRES_PASSWORD": getenv("POSTGRES_PASSWORD", "postgres"),
        "POSTGRES_DB": getenv("POSTGRES_DB", "postgres"),
    },
    "DEBUG": getenv("DEBUG", "True").lower() == "true",
    "SECRET_KEY": getenv("SECRET_KEY", "secret_key")
}


def set_config():
    for param in CONFIG:
        app.config[param] = CONFIG[param]

    db_conf = app.config["DATABASE"]
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f'postgresql://{db_conf["POSTGRES_USER"]}:'
        f'{db_conf["POSTGRES_PASSWORD"]}@{db_conf["POSTGRES_HOST"]}'
        f':{db_conf["POSTGRES_PORT"]}/{db_conf["POSTGRES_DB"]}'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

set_config()

db, migrate = get_db_and_migrate_objects(app)
