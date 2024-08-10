import functools
import bcrypt
import datetime
import jwt

from flask import (
    Blueprint, jsonify, g, request, session,current_app
)

from flaskr.db import get_db

def hash_password(password): 
    salt = bcrypt.gensalt()

    return bcrypt.hashpw(password.encode('utf-8'),salt)

def check_password(hash,password):
    return bcrypt.checkpw(password.encode('utf-8'),hash)

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register',methods=('POST'))
def register():
    username = request.form['username']
    password = request.form['password']
    db = get_db()
    error = None

    if not username:
        error = 'Username is required'
        code = 400
    elif not password:
        error = 'password is required'
        code = 400
    
    if error is None:
        try:
            db.execute(
                "INSERT INTO users (username,password_hash) VALUES (%s,%s)"\
                % (username,hash_password(password))
            )
            db.commit()
        except db.Integrityerror: #Unique constraint
            error = "User %s is already registered" % (username)
            code = 408
        else:
            return jsonify({"message": "User registered successfully"}),201
    return jsonify({"error": error}),code

@bp.route('/login',methods=('POST'))
def login():
    username = request.form['username']
    password = request.form['password']

    db = get_db()
    error = None
    user = db.execute(
        "SELECT * FROM users WHERE username = %s" % (username)
    ).fetchone()

    if user is None:
        error = "Invalid username"
    elif not check_password(user['password_hash'],password):
        error = "Incorrect password"
    
    if error is None:
        #Token valid for 4 weeks
        token = jwt.encode({
            'user_id': user['userID'],
            'exp': datetime.datetime.utcnow() +datetime.timedelta(weeks=4)
        },current_app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'token':token}), 200

    return jsonify({"error":error}), 401

@bp.route('/logout')
def logout():
    return jsonify({"message":"Logged out successfully"}), 200

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(*args,**kwargs):
        #get token
        auth_header = request.headers.get('Authorization')
        if auth_header is None or not auth_header.startswith("Bearer "):
            return jsonify({"error":"Authentication token is missing"}), 401

        token = auth_header.split(" ")[1]

        #decode token
        try:
            payload = jwt.decode(
                token,
                current_app.config['SECRET_KEY'],
                algorithms=['HS256']
            )
            g.user = payload['user_id'] #store userid in g
        except jwt.ExpiredSignatureError:
            return jsonify({"error":"Authentication token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error":"Invalid authentication token"}), 401
        return view(*args,**kwargs)
    return wrapped_view