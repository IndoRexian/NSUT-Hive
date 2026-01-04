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
    """
    Login
    """

    otp = create_otp_entry(
        body.email, datetime.datetime.now(tz=ZoneInfo("Asia/Kolkata")), db
    )
    signin_request(body.email, otp)
    return {"status": "Done"}


"""@router.post('/login/access-token')
def login_access_token(
    formdata:OAuth2AuthorizationCodeBearer,
    x:OAuth2PasswordBearer
)"""


'''@router.get("/logout")
def logout(request: Request):
    """
    Redirects the user to the Auth0 Universal Login (https://auth0.com/docs/authenticate/login/auth0-universal-login)
    """
    return {"message": "Logout"}'''


@router.post("/login/verify-otp/")
async def callback(body: OTPVerify, db: Session = Depends(get_db)):
    """
    Callback redirect from Auth0
    """
    return verify_otp(body.email, body.otp, False, db=db)


@router.post("/login/verify-otp/final/")
async def callback(body: OTPVerifyFinal, db: Session = Depends(get_db)):
    """
    For New Users
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
