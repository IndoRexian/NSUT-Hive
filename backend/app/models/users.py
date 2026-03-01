import uuid
from datetime import datetime

from pydantic import BaseModel


class User(BaseModel):
    """
    Pydantic Model for Users
    """

    user_id: uuid.UUID
    username: str
    email_hash: str
    email_encrypted: str
    created_at: datetime
    promotional_optin: bool
    avatar_style: str

    class Config:
        from_attributes = True
