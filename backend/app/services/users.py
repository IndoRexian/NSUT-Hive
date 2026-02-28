from datetime import datetime, timedelta

import jwt
from core.config import config
from core.security import create_access_token, encrypt, get_userid, hash
from database import get_db
from db import schema
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import ExpiredSignatureError, InvalidSignatureError
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/verify-otp")


def create_user(
    username: str,
    email: str,
    created_at: datetime,
    promotional_optin: bool,
    avatar_style: str,
    db: Session = Depends(get_db),
):
    """
    Returns access_token on success, And a 422 if username exists

    :param username: Username of the user
    :type username: str
    :param email: Email ID
    :type email: str
    :param created_at: Datetime of account creation
    :type created_at: datetime
    :param promotional_optin: If opted for future emails
    :type promotional_optin: bool
    :param db: Database session
    :type db: Session
    """
    email_hash = hash(email)
    email_encrypted = encrypt(email)
    user_entry = schema.User(
        username=username,
        email_hash=email_hash,
        email_encrypted=email_encrypted.decode(),
        created_at=created_at,
        promotional_optin=promotional_optin,
        avatar_style=avatar_style,
    )
    try:
        db.add(user_entry)
        db.commit()
        db.refresh(user_entry)
        access_token = create_access_token(user_entry.user_id, timedelta(minutes=30))
        return {"access_token": access_token, "detail": "New User"}

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=422, detail="Username Exists")


def get_user_by_email(
    email_hash: str = None, email: str = None, db: Session = Depends(get_db)
):
    if email_hash:
        return (
            db.execute(select(schema.User).where(schema.User.email_hash == email_hash))
            .scalars()
            .first()
        )
    return (
        db.execute(select(schema.User).where(schema.User.email_hash == hash(email)))
        .scalars()
        .first()
    )


def get_userdata_by_id(
    user_id: str = None, token: str = None, db: Session = Depends(get_db)
):
    if user_id == None:
        extracted_user_id = get_userid(token)
    else:
        extracted_user_id = user_id
    return (
        db.execute(select(schema.User).where(schema.User.user_id == extracted_user_id))
        .scalars()
        .first()
    )


def get_current_user(token: str = None, db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=401, detail="No token specified.")
    try:
        payload = jwt.decode(token, config.APP_SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Expired token")
    except InvalidSignatureError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_userdata_by_id(user_id=user_id, db=db)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
