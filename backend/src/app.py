from flask import Flask
from dotenv import load_dotenv
from os import getenv


from extensions import db, migrate, jwt, swagger

from users.views import users_bp
from core.openapi import register_openapi_spec_endpoint, generate_openapi_spec

load_dotenv()


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
    "SECRET_KEY": getenv("SECRET_KEY", "50jhfhK6BXmcSTsADWXdy3jXiVmO6D6n"),
}


def create_app():
    app = Flask(__name__)
    set_config(app)
    register_blueprints(app)
    register_extensions(app)

    return app


def set_config(app):
    for param in CONFIG:
        app.config[param] = CONFIG[param]

    db_conf = app.config["DATABASE"]
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f'postgresql://{db_conf["POSTGRES_USER"]}:'
        f'{db_conf["POSTGRES_PASSWORD"]}@{db_conf["POSTGRES_HOST"]}'
        f':{db_conf["POSTGRES_PORT"]}/{db_conf["POSTGRES_DB"]}'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


def register_blueprints(app):
    app.register_blueprint(users_bp)


def register_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db, directory="database/migrations/")
    jwt.init_app(app)
    register_openapi_spec_endpoint(app)
    swagger.init_app(app)
