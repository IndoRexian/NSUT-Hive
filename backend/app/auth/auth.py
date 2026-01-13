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
from smtplib import SMTP
from zoneinfo import ZoneInfo

import pyotp
from core.config import config

with open("./data/otp.html", "r", encoding="utf-8") as fp:
    htmldata = fp.read()


def signin_request(email: str, otp: str):

    context = ssl.create_default_context()

    with SMTP("smtp-relay.brevo.com", 587) as server:
        server.starttls(context=context)
        key = config.SMTP_KEY
        server.login(
            "indo.rexian@gmail.com",
            key,
        )
        msg = EmailMessage()
        msg["From"] = "NSUT Hive <noreply@nsuthive.com>"
        msg["X-Mailer"] = "NSUT Hive"
        msg["To"] = email
        msg["Subject"] = "Login To NSUT Hive"
        created_at = datetime.datetime.now(tz=ZoneInfo("Asia/Kolkata"))
        expires_at = created_at + datetime.timedelta(minutes=10)
        msg.set_content(
            htmldata.replace("{{otp}}", otp).replace("{{email}}", email), subtype="html"
        )
        try:
            server.send_message(msg)
            return True
        except:
            return False


"""def verify_otp(otp: str, email: str):
    response = supabase.auth.verify_otp(
        {
            "email": email,
            "token": otp,
            "type": "email",
        }
    )
    return response
"""
