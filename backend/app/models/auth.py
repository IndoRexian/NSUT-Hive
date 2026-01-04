import uuid
from datetime import datetime

from pydantic import BaseModel


class OTPEntry(BaseModel):
    """
    Pydantic Model for OTPs
    """

    token_id: uuid.UUID
    email_hash: str
    otp_hash: str
    created_at: datetime
    expires_at: datetime
    used: bool = False

    class Config:
        from_attributes = True



