from flask import (
    Blueprint, request, jsonify
)
from backend.db import get_db

bp = Blueprint('user',__name__)

@bp.route('/user/<int:id>/info',methods = ['GET'])
def user_info(id):
    db = get_db()
    user_info = db.execute(
        'SELECT dob,isAdmin,name_,username FROM users WHERE userID = ?',(id,)
    ).fetchone()
    if user_info is None:
        return jsonify({"error":"Author not found"}),404
    return jsonify(dict(user_info))
