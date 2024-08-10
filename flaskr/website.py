from flask import (
    Blueprint, flash, g, redirect, request, jsonify
)
from werkzeug.exceptions import abort

from flaskr.auth import login_required
from flaskr.db import get_db

bp = Blueprint('website',__name__)

@bp.route('/')
def index():
    db = get_db()
    books = db.execute(
        '''SELECT books.*,
        AVG(reviews.rating) AS average_rating
        FROM books JOIN reviews ON books.bookID = reviews.book
        GROUP BY books.bookID ORDER BY average_rating DESC'''
    ).fetchall()
    #convert rows to a list of dictionaries
    return jsonify([dict(row) for row in books])