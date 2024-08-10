from flask import (
    Blueprint, flash, g, redirect, request, jsonify
)
from werkzeug.exceptions import abort

from flaskr.auth import login_required
from flaskr.db import get_db

bp = Blueprint('website',__name__)

@bp.route('/book/')
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

@bp.route('/book/<int:book_id>')
def book(book_id):
    db = get_db()
    book = db.execute(
        '''SELECT books.*,
        AVG(reviews.rating) AS average_rating
        FROM books JOIN reviews ON books.bookID = reviews.book
        WHERE books.bookID = ?''',
        (book_id,)
    ).fetchone()
    if book is None:
        abort(404, f"Book id {book_id} doesn't exist.")
    return jsonify(dict(book))

@bp.route('/book/<int:book_id>/reviews')
def reviews(book_id):
    db = get_db()
    reviews = db.execute(
        '''SELECT reviews.* FROM reviews WHERE reviews.book = ?''',
        (book_id,)
    ).fetchall()
    return jsonify([dict(row) for row in reviews])