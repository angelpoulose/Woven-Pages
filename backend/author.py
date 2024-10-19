from flask import (
    Blueprint,request,jsonify
)
from werkzeug.exceptions import abort

from backend.auth import admin_required
from backend.db import get_db

bp = Blueprint('author',__name__)

@bp.route('/author/<int:author_id>')
def author(author_id):
    db = get_db()
    author_info = db.execute(
        'SELECT * FROM authors WHERE authorID = ?',(author_id,)
    ).fetchone()
    if author_info is None:
        return jsonify({"error":"Author not found"}),404
    author_info = dict(author_info)
    return jsonify(author_info)