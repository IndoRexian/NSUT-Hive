from datetime import datetime
from zoneinfo import ZoneInfo

from auth.auth import *
from database import get_db
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from services.auth import create_otp_entry, verify_otp
from services.users import get_current_user
from sqlmodel import Session

router = APIRouter()


class Email(BaseModel):
    email: str


class OTPVerify(BaseModel):
    otp: str
    email: str


class OTPVerifyFinal(BaseModel):
    otp: str
    email: str
    username: str
    promotional_optin: bool
    avatar_style: str


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/verify-otp")  # for docs only


@router.post("/login/send-otp/")
async def login(body: Email, db: Session = Depends(get_db)):
    """Login

    Parameters
    ----------
    body : Email
        Contains Email ID
    db : Session
        Database session
    """

    otp = create_otp_entry(
        body.email, datetime.datetime.now(tz=ZoneInfo("Asia/Kolkata")), db
    )
    if config.environment != "development":
        signin_request(body.email, otp)
    return {"status": "Done"}


@router.post("/login/verify-otp/")
async def callback(body: OTPVerify, db: Session = Depends(get_db)):
    """
    Callback redirection

    Parameters
    ----------
    body : OTPVerify
        Contains OTP & Email ID
    db : Session
        Database session
    """
    return verify_otp(body.email, body.otp, False, db=db)


@router.post("/login/verify-otp/final/")
async def callback(body: OTPVerifyFinal, db: Session = Depends(get_db)):
    """
    Callback redirection For New Users

    Parameters
    ----------
    body : OTPVerifyFinal
        Contains OTP, Email ID, Username, Promotional Opt In Status & Avatar Style
    db : Session
        Database session
    """
    return verify_otp(
        body.email,
        body.otp,
        True,
        body.username,
        body.promotional_optin,
        body.avatar_style,
        db=db,
    )


@router.get("/me")
async def me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return get_current_user(token, db)
