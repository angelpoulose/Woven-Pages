import os

from flask import Flask
from flask_cors import CORS

def create_app(test_config=None):
    app = Flask(__name__,instance_relative_config=True)
    CORS(app)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path,'flaskr.sqlite') # work with sqlite now. Will sqitch to mysql later
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True) # replacw with config.py if exists
    else:
        app.config.from_mapping(test_config)
    
    try:
        os.makedirs(app.instance_path) # ensure app.instance_path exists
    except OSError:
        pass

    @app.route('/hello') # For testing flask app
    def hello():
        return 'Hi'
    
    from . import db
    db.init_app(app)
    
    from . import auth
    app.register_blueprint(auth.bp)

    from . import books
    app.register_blueprint(books.bp)

    from . import reviews
    app.register_blueprint(reviews.bp)

    from . import author
    app.register_blueprint(author.bp)

    return app