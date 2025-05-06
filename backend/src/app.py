from flask import Flask
from dotenv import load_dotenv
from os import getenv

from extensions import db, migrate, jwt, swagger

from users.views import users_bp
from games.views import games_bp

from core.openapi import register_openapi_spec_endpoint

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
    "SWAGGER": {
        "swagger_ui_bundle_js": "//unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js",
        "swagger_ui_standalone_preset_js": "//unpkg.com/swagger-ui-dist@3/swagger-ui-standalone-preset.js",
        "jquery_js": "//unpkg.com/jquery@2.2.4/dist/jquery.min.js",
        "swagger_ui_css": "//unpkg.com/swagger-ui-dist@3/swagger-ui.css",
        "specs_route": "/api/docs/",
        "specs": [
            {
                "endpoint": "api_spec",
                "route": "/api/docs/api_spec.json",
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
    }
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
    app.register_blueprint(games_bp)


def register_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db, directory="database/migrations/")
    jwt.init_app(app)
    register_openapi_spec_endpoint(app)
    swagger.init_app(app)
