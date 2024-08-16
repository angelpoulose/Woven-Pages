"""
This module contains fixtures for testing the Flask application.
Fixtures:
- app: Fixture that creates and configures the Flask application for testing.
- client: Fixture that provides a test client for making requests to the Flask application.
- runner: Fixture that provides a test CLI runner for running CLI commands on the Flask application.
"""

import os

import tempfile

import pytest
from backend import create_app
from backend.db import get_db, init_db

with open(os.path.join(os.path.dirname(__file__), 'data.sql'), 'rb') as f:
    _data_sql = f.read().decode('utf8')

@pytest.fixture
def app():
    db_fd, db_path = tempfile.mkstemp()

    app = create_app({
        'TESTING': True,
        'DATABASE':db_path
    })

    with app.app_context():
        init_db()
        get_db().executescript(_data_sql)
    
    yield app

    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

@pytest.fixture
def auth(client):
    def login(username='user',password='MarioLuigi'):
        return client.post(
            '/auth/login',
            data={'username':username,'password':password}
        )
    return login

@pytest.fixture
def admin_auth(client):
    def login(username='admin',password='DBMS-Group4'):
        return client.post(
            '/auth/login',
            data={'username':username,'password':password}
        )
    return login

@pytest.fixture
def logout(client):
    return client.post('/auth/logout')