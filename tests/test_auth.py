import pytest
from flask import g,session
from backend.db import get_db
import jwt

def test_register(client,app):
    response = client.post(
        '/auth/register',data={'username':'new_user','password':'Sonic@Hedgehog'}
    )

    with app.app_context():
        assert get_db().execute(
            "SELECT * FROM users WHERE username = 'new_user'"
        ).fetchone() is not None
    
@pytest.mark.parametrize(('username','password','message'),(
    ('','',b'Username is required'),
    ('a','',b'Password is required'),
    ('user','MarioLuigi',b'User is already registered'),
    ('abc','def',b'User registered successfully')
))
def test_register_validate_input(client,username,password,message):
    response = client.post(
        '/auth/register',
        data = {'username':username,'password':password}
    )
    assert message in response.data


def test_login(client,app):
    response = client.post(
        '/auth/login',data={'username':'user','password':'MarioLuigi'}
    )
    token = response.json.get('token')

    if token:
        try:
            decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            print(decoded_token)
        except jwt.ExpiredSignatureError:
            print("Token has expired")
        except jwt.InvalidTokenError:
            print("Invalid token")
    else:
        raise Exception("Token not found")
    
@pytest.mark.parametrize(('username','password','message'),(
    ('','',b'Invalid username'),
    ('user','MarioLuigi',b'Logged in successfully'),
    ('user','LuigiMario',b'Incorrect password'),
))
def test_login_validate_input(client,username,password,message):
    response = client.post(
        '/auth/login',
        data = {'username':username,'password':password}
    )
    if message == b'Logged in successfully':
        assert 'token' in response.json
        return None
    assert message in response.data