from flask import (
    Blueprint, g, request, jsonify
)
from werkzeug.exceptions import abort

from flaskr.auth import admin_required
from flaskr.db import get_db

bp = Blueprint('website',__name__)

@bp.route('/book')
def view_book():
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

@bp.route('/add_book',methods=['POST'])
@admin_required
def add_book():
    db = get_db()
    title = request.form['title']
    author = request.form['author']
    error = None
    if not title:
        error = 'Title is required'
    elif not author:
        error = 'Author is required'
    
    if error is not None:
        return jsonify({"error": error}),400
    
    db.execute(
        '''INSERT INTO books (title,author) VALUES (?,?)''',
        (title,author)
    )
    db.commit()
    return jsonify({"message": "Book added successfully"}),201

@bp.route('/book/<int:book_id>/delete',methods=['DELETE'])
@admin_required
def delete_book(book_id):
    db = get_db()
    db.execute(
        '''DELETE FROM books WHERE bookID = ?''',
        (book_id,)
    )
    db.commit()
    return jsonify({"message": "Book deleted successfully"}),200

@bp.route('/book/<int:book_id>/update',methods=['PUT'])
@admin_required
def update_book(book_id):
    db = get_db()
    title = request.form['title']
    author = request.form['author']
    error = None
    if not title:
        error = 'Title is required'
    elif not author:
        error = 'Author is required'
    
    if error is not None:
        return jsonify({"error": error}),400
    
    db.execute(
        '''UPDATE books SET title = ?, author = ? WHERE bookID = ?''',
        (title,author,book_id)
    )
    db.commit()
    return jsonify({"message": "Book updated successfully"}),200