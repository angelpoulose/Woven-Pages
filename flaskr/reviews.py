from flask import (
    Blueprint, g, request, jsonify
)

from flaskr.auth import login_required
from flaskr.db import get_db

bp = Blueprint('reviews',__name__)


@bp.route('/book/<int:book_id>/view_reviews')
def view_reviews(book_id):
    db = get_db()
    reviews = db.execute(
        '''SELECT reviews.*,users.username FROM reviews JOIN users ON reviews.reviewer = users.userID WHERE reviews.book = ?''',
        (book_id,)
    ).fetchall()
    return jsonify([dict(row) for row in reviews])

@bp.route('/book/<int:book_id>/review',methods=['POST'])
@login_required
def review(book_id):
    db = get_db()
    user_id = g.user['userID']
    rating = request.form['rating']
    comment = request.form['comment']

    error = None
    if not rating:
        error = 'Rating is required'
    elif not comment:
        error = 'Comment is required'
    elif len(comment)>=1000:
        error = 'Comment is too long'

    if error is not None:
        return jsonify({"error": error}),400
    
    db.execute(
        '''INSERT INTO reviews (book,reviewer,rating,user_Review)
        VALUES (?,?,?,?)''',
        (book_id,user_id,rating,comment)
    )
    db.commit()
    return jsonify({"message": "Review added successfully"}),201

@bp.route('/book/<int:book_id>/review',methods=['DELETE'])
@login_required
def delete_review(book_id):
    db = get_db()
    user_id = g.user['userID']
    db.execute(
        '''DELETE FROM reviews WHERE book = ? AND reviewer = ?''',
        (book_id,user_id)
    )
    db.commit()
    return jsonify({"message": "Review deleted successfully"}),200

@bp.route('/book/<int:book_id>/review',methods=['PUT'])
@login_required
def update_review(book_id):
    db = get_db()
    user_id = g.user['userID']
    rating = request.form['rating']
    comment = request.form['comment']
    original_values = db.execute(
        '''SELECT * FROM reviews WHERE book = ? AND reviewer = ?''',
        (book_id,user_id)
    ).fetchone()

    error = None
    if not rating:
        error = 'Rating is required'
    elif not comment:
        error = 'Comment is required'
    elif len(comment)>=1000:
        error = 'Comment is too long'

    if error is not None:
        return jsonify({"error": error}),400
    
    for key in request.form.keys():
        if request.form[key] is None:
            request.form[key] = original_values[key]

    db.execute(
        '''UPDATE reviews SET rating = ?, user_Review = ?
        WHERE book = ? AND reviewer = ?''',
        (rating,comment,book_id,user_id)
    )
    db.commit()
    return jsonify({"message": "Review updated successfully"}),200