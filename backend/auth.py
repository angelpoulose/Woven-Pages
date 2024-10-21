import functools
import bcrypt
import datetime
import jwt

from flask import (
    Blueprint, jsonify, g, request,current_app
)

from backend.db import get_db

def hash_password(password): 
    salt = bcrypt.gensalt()

    return bcrypt.hashpw(password.encode('utf-8'),salt)

def check_password(hash,password):
    return bcrypt.checkpw(password.encode('utf-8'),hash)

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register',methods=['POST'])
def register():
    username =  request.form.get('username')
    password =  request.form.get('password')
    name = request.form.get('name')
    dob = request.form.get('dob')
    db = get_db()
    error = None
    code = 400

    if not username:
        error = 'Username is required'
    elif not password:
        error = 'Password is required'
    elif not name:
        error = 'Name is required'
    elif not dob:
        error = 'Date of birth is required'
    
    if error is None:
        try:
            db.execute(
                "INSERT INTO users (username,password_hash,name_,dob) VALUES (?,?,?,?)",
                (username,hash_password(password),name,dob)
            )
            db.commit()
        except db.IntegrityError: #Unique constraint
            error = "User is already registered"
            code = 409
        else:
            return jsonify({"message": "User registered successfully"}),201
    return jsonify({"error": error}),code

@bp.route('/login',methods=['POST'])
def login():
    username =  request.form.get('username')
    password =  request.form.get('password')

    db = get_db()
    error = None
    code = None
    user = db.execute(
        "SELECT * FROM users WHERE username = ?",(username,)
    ).fetchone()
    if user is None:
        error = "Invalid username"
        code = 404
    else:
        hash = user['password_hash']
        if (type(hash)==str):
            hash = hash.encode('utf-8')
        if not check_password(hash,password):
            error = "Incorrect password"
            code = 401
    if error is None:
        #Token valid for 4 weeks
        token = jwt.encode({
            'userID': user['userID'],
            'is_admin': user['isAdmin']
        },current_app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'token':token}), 200

    return jsonify({"error":error}), code

@bp.route('/logout',methods=['POST'])
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
            g.user = payload['userID'] #store userid in g
        except jwt.ExpiredSignatureError:
            return jsonify({"error":"Authentication token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error":"Invalid authentication token"}), 401
        return view(*args,**kwargs)
    return wrapped_view

def admin_required(view):
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
            g.user = payload['userID'] #store userid in g
            if not payload['is_admin']:
                return jsonify({"error":"Admin access required"}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({"error":"Authentication token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error":"Invalid authentication token"}), 401
        return view(*args,**kwargs)
    return wrapped_view