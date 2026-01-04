"""from auth0.authentication import Passwordless
from app.core import config

passwordless=Passwordless(
    domain=config.AUTH0_DOMAIN,
    client_id=config.AUTH0_CLIENT_ID,
    client_secret=config.AUTH0_CLIENT_SECRET,
)

passwordless.email('dheeraj26singh@gmail.com', 'code')"""

import datetime
import ssl
import time
from email.message import EmailMessage
from smtplib import SMTP, SMTP_SSL
from zoneinfo import ZoneInfo

import pyotp


def signin_request(email: str):
    context = ssl.create_default_context()
    with SMTP("smtp-relay.brevo.com", 587) as server:
        server.starttls(context=context)
        server.login(
            "indo.rexian@gmail.com",
            "xsmtpsib-b5d6c03eb4424129b8ee549a82e717ba2afe9fda8c34258308aee4530975ad45-BvUWPDjZChs8CWsc",
        )
        msg = EmailMessage()
        msg["From"] = "indo.rexian@gmail.com"
        msg["To"] = email
        msg["Subject"] = "Test email"
        otp = pyotp.OTP(pyotp.random_base32())
        created_at = datetime.datetime.now(tz=ZoneInfo("Asia/Kolkata"))
        expires_at = created_at + datetime.timedelta(minutes=10)
        msg.set_content(otp)
        server.send_message(msg)


'''def verify_otp(otp: str, email: str):
    response = supabase.auth.verify_otp(
        {
            "email": email,
            "token": otp,
            "type": "email",
        }
    )
    return response
'''