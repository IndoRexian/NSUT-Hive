import hashlib
from datetime import datetime, timedelta

import jwt
from core.config import config
from cryptography.fernet import Fernet


def hash(value: str | int):
    return hashlib.sha256(str(value).encode("utf-8")).hexdigest()


def encrypt(value: str | int):
    if type(value) == str:
        return Fernet(config.FERNET_KEY).encrypt(bytes(value, "utf-8"))
    else:
        return Fernet(config.FERNET_KEY).encrypt(value.to_bytes())


def decrypt(value: bytes):
    return Fernet(config.FERNET_KEY).decrypt(value).decode()


def create_access_token(subject: str | int, expires_delta: timedelta) -> str:
    expire = datetime.now(config.TZ) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, config.APP_SECRET_KEY, algorithm="HS256")
    return encoded_jwt


def get_userid(token: str) -> str | None:
    try:

        decoded_jwt = jwt.decode(token, config.APP_SECRET_KEY, ["HS256"])

        return decoded_jwt["sub"]
    except Exception as e:

        return None
