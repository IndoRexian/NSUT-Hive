from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pyotp
from core.security import create_access_token, hash
from database import get_db
from db import schema
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from models import users
from services.users import create_user
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session

tz = ZoneInfo("Asia/Kolkata")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/verify-otp")  # for docs only


def create_otp_entry(
    email: str, created_at: datetime, db: Session = Depends(get_db)
) -> None:
    otp = pyotp.TOTP(pyotp.random_base32()).now()
    print(otp)
    otp_entry = schema.OTPTOKEN(
        email_hash=hash(email),
        otp_hash=hash(otp),
        created_at=created_at,
        expires_at=created_at + timedelta(minutes=10),
        used=False,
    )
    data = (
        db.execute(
            select(schema.OTPTOKEN).where(hash(email) == schema.OTPTOKEN.email_hash)
        )
        .scalars()
        .first()
    )
    if data is None:
        # User Asking for the first time
        db.add(otp_entry)
        db.commit()
    else:
        # User asking again
        db.execute(
            delete(schema.OTPTOKEN).where(hash(email) == schema.OTPTOKEN.email_hash)
        )
        db.add(otp_entry)
        db.commit()
    print(data)
    return None


def force_expire_otp(email: str, otp: str, db: Session = Depends(get_db)):
    db.execute(
        update(schema.OTPTOKEN)
        .where(schema.OTPTOKEN.email_hash == hash(email))
        .where(schema.OTPTOKEN.otp_hash == hash(otp))
        .values(used=True)
    )
    db.commit()


def verify_otp(
    email: str,
    otp: str,
    new_user_stage: bool,
    username: str = None,
    promotional_optin: bool = True,
    avatar_style: str = None,
    db: Session = Depends(get_db),
) -> users.User | dict:
    """
    Returns access_token if everything goes well, and a 401 if OTP Invalid/Expired

    :param email: Description
    :type email: str
    :param otp: Description
    :type otp: str
    :param db: Description
    :type db: Session
    :return: Description
    :rtype: User | dict
    """
    email_hash = hash(email)
    data = (
        (
            db.execute(
                select(schema.OTPTOKEN)
                .where((email_hash == schema.OTPTOKEN.email_hash))
                .where((hash(otp) == schema.OTPTOKEN.otp_hash))
            )
        )
        .scalars()
        .first()
    )
    now = datetime.now(tz=tz)
    if data:
        if data.expires_at < now:
            force_expire_otp(email, otp, db)
            raise HTTPException(status_code=401, detail="OTP Expired")
        else:
            existing = (
                db.execute(
                    select(schema.User).where(schema.User.email_hash == email_hash)
                )
                .scalars()
                .first()
            )
            if existing is None:
                if new_user_stage:
                    force_expire_otp(email, otp, db)
                    status = create_user(
                        username, email, now, promotional_optin, avatar_style, db=db
                    )
                    return status
                return HTTPException(status_code=200, detail="New User")
            else:
                force_expire_otp(email, otp, db)
                access_token = create_access_token(
                    existing.user_id, timedelta(minutes=30)
                )
                return {"access_token": access_token, "detail": "Not New User"}
                """if new_user_stage:
                    force_expire_otp(email, otp, db)
                    access_token = create_access_token(
                        existing.user_id, timedelta(minutes=30)
                    )
                    return {"access_token": access_token, "detail":"Not New User"}
                else:
                    return HTTPException(status_code=200, detail="Not New User")"""
    else:
        raise HTTPException(status_code=401, detail="Invalid OTP")
