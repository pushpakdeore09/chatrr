from flask import Flask
from flask_cors import CORS # type: ignore
from .routes import main # type: ignore

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(main)

    return app
