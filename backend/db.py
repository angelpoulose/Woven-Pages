import sqlite3

import click
from flask import current_app, g

def get_db():
    if 'db' not in g: # special object unique for each request
        g.db = sqlite3.connect( #Conncection is stored and reused
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row #returns rows that behave like dicts
    return g.db

def close_db(e=None):
    db = g.pop('db',None)

    if db is not None:
        db.close()

def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))
    with current_app.open_resource('data.sql') as f:
        db.executescript(f.read().decode('utf8'))

@click.command('init-db') #defines a command line command
def init_db_command():
    # Clear the exisiting data and create new tables
    init_db()
    click.echo('Initialized the database')

def init_app(app):
    app.teardown_appcontext(close_db) # call close_db when cleaning up
    app.cli.add_command(init_db_command) # ad init_db_command to flask interface