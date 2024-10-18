from flask import (
    Blueprint, g, request, jsonify
)
from werkzeug.exceptions import abort

from backend.auth import admin_required
from backend.db import get_db

bp = Blueprint('edition',__name__)

@bp.route('/edition/<int:edition_id>',methods=['GET'])
def get_edition(edition_id):
    db = get_db()
    edition = db.execute(
        'SELECT * FROM editions WHERE ISBN = ?',(edition_id,)
    ).fetchone()
    if edition is None:
        return jsonify({'message':'Edition not found'}),404
    return jsonify(dict(edition))

@bp.route('/book/<int:book_id>/editions',methods=['GET'])
def get_all_editions(book_id):
    db = get_db()
    editions = db.execute(
        'SELECT * FROM editions WHERE book = ?',(book_id,)
    ).fetchall()
    return jsonify([dict(edition) for edition in editions])

@bp.route('/edition/add',methods=['POST'])
@admin_required
def add_edition():
    db = get_db()
    edition = request.get_json()
    db.execute(
        "INSERT INTO editions (ISBN,book,format,pages,publisher,publish_date,lang) VALUES (?,?,?,?,?,?,?)",\
        (edition['ISBN'],edition['book'],edition['format'],edition['pages'],edition['publisher'],edition['publish_date'],edition['lang'])
    )
    db.commit()
    return jsonify({'message':'Edition added'})

@bp.route('/edition/<int:edition_id>/update',methods=['PUT'])
@admin_required
def update_edition(edition_id):
    db = get_db()
    edition = request.get_json()
    original_values = db.execute(
        'SELECT * FROM editions WHERE id = ?',(edition_id,)
    ).fetchone()
    for key in edition.keys():
        if edition[key] is None:
            edition[key] = original_values[key]
    db.execute(
        "UPDATE editions SET ISBN = ?, book = ?, format = ?, pages = ?, publisher = ?, publish_date = ?, lang = ? WHERE id = ?",\
        (edition['ISBN'],edition['book'],edition['format'],edition['pages'],edition['publisher'],edition['publish_date'],edition['lang'],edition_id)
    )
    db.commit()
    return jsonify({'message':'Edition updated'})

@bp.route('/edition/<int:edition_id>/delete',methods=['DELETE'])
@admin_required
def delete_edition(edition_id):
    db = get_db()
    db.execute(
        'DELETE FROM editions WHERE id = ?',(edition_id,)
    )
    db.commit()
    return jsonify({'message':'Edition deleted'})