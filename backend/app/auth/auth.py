import datetime
import ssl
from email.message import EmailMessage
from smtplib import SMTP
from zoneinfo import ZoneInfo

import pyotp
from core.config import config

with open("./data/otp.html", "r", encoding="utf-8") as fp:
    htmldata = fp.read()


def signin_request(email: str, otp: str):

    with SMTP("smtp-relay.brevo.com", 587) as server:
        try:
            context = ssl.create_default_context()
            server.starttls(context=context)
            smtp_email = config.SMTP_EMAIL
            key = config.SMTP_KEY
            server.login(
                smtp_email,
                key,
            )
            msg = EmailMessage()
            msg["From"] = "NSUT Hive <noreply@nsuthive.com>"
            msg["X-Mailer"] = "NSUT Hive"
            msg["To"] = email
            msg["Subject"] = "Login To NSUT Hive"
            # created_at = datetime.datetime.now(tz=ZoneInfo("Asia/Kolkata"))
            # expires_at = created_at + datetime.timedelta(minutes=10)
            msg.set_content(
                htmldata.replace("{{otp}}", otp).replace("{{email}}", email),
                subtype="html",
            )

            server.send_message(msg)
            return True
        except Exception as e:
            # (f"Sending Email Failed: {e}")
            return False
