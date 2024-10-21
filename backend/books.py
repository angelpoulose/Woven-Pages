from flask import (
    Blueprint, request, jsonify,g
)
from werkzeug.exceptions import abort

from backend.auth import admin_required, login_required
from backend.db import get_db

bp = Blueprint('website',__name__)

@bp.route('/book')
def view_book():
    db = get_db()
    books = db.execute(
        '''SELECT books.*,
        authors.first_name || ' ' || authors.last_name AS author_name,
        AVG(reviews.rating) AS average_rating
        FROM books
        JOIN reviews ON books.bookID = reviews.book
        JOIN authors ON books.author = authors.authorID
        GROUP BY books.bookID, authors.first_name, authors.last_name
        ORDER BY average_rating DESC LIMIT 10'''
    ).fetchall()
    #convert rows to a list of dictionaries
    return jsonify([dict(row) for row in books])

@bp.route('/user_books')
@login_required
def user_books():
    db = get_db()
    books = db.execute(
        '''SELECT books.*,
        authors.first_name || ' ' || authors.last_name AS author_name,
        reviews.read_status AS read_status,
        AVG(reviews.rating) AS average_rating
        FROM books
        JOIN reviews ON books.bookID = reviews.book
        JOIN authors ON books.author = authors.authorID
        WHERE reviews.reviewer = ?
        GROUP BY books.bookID, authors.first_name, authors.last_name
        ORDER BY average_rating DESC LIMIT 10''',
        (g.user,)
    ).fetchall()
    return jsonify([dict(row) for row in books])

@bp.route('/book/<int:book_id>')
def book(book_id):
    db = get_db()
    book = db.execute(
        '''SELECT books.*,
        authors.first_name || ' ' || authors.last_name AS author_name,
        COALESCE(AVG(reviews.rating), 0) AS average_rating
        FROM books
        LEFT JOIN reviews ON books.bookID = reviews.book
        JOIN authors ON books.author = authors.authorID
        WHERE books.bookID = ?''',
        (book_id,)
    ).fetchone()
    genres = db.execute(
        '''SELECT genre FROM book_genre WHERE book = ?''',
        (book_id,)
    ).fetchall()
    
    if book is None:
        abort(404, f"Book id {book_id} doesn't exist.")
    
    book = dict(book)
    book['genres'] = [genre['genre'] for genre in genres]
    return jsonify(book)

@bp.route('/add_book',methods=['POST'])
@admin_required
def add_book():
    db = get_db()
    title = request.form.get('title')
    author = request.form.get('author')
    error = None
    try:
        genres = request.form.getlist('genre[]')
    except KeyError:
        genres = []
    if not title:
        error = 'Title is required'
    elif not author:
        error = 'Author is required'
    if error is not None:
        print(error)
        return jsonify({"error": error}),400
    
    db.execute(
        '''INSERT INTO books (title,author) VALUES (?,?)''',
        (title,author)
    )

    book_id = db.execute(
        '''SELECT bookID FROM books WHERE title = ? AND author = ?''',
        (title,author)
    ).fetchone()['bookID']

    for genre in genres:
        db.execute(
            '''INSERT INTO book_genre (book,genre) VALUES (?,?)''',
            (book_id,genre)
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
    db.execute(
        '''DELETE FROM book_genre WHERE book = ?''',
        (book_id,)
    )
    db.execute(
        "DELETE FROM editions WHERE book = ?",(book_id,)
    )
    db.execute(
        "DELETE FROM reviews WHERE book = ?",(book_id,)
    )
    db.commit()
    return jsonify({"message": "Book deleted successfully"}),200

@bp.route('/book/<int:book_id>/update',methods=['PUT'])
@admin_required
def update_book(book_id):
    db = get_db()
    title = request.form['title']
    author = request.form['author']
    genres = request.form.getlist('genres[]')
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
    db.execute(
        '''DELETE FROM book_genre WHERE book = ?''',
        (book_id,)
    )
    for genre in genres:
        db.execute(
            '''INSERT INTO book_genre (book,genre) VALUES (?,?)''',
            (book_id,genre)
        )
    db.commit()
    return jsonify({"message": "Book updated successfully"}),200