import uuid
from datetime import datetime

from pydantic import BaseModel


class Review(BaseModel):
    review_id: int
    professor_id: int
    user_id: uuid.UUID
    created_at: datetime
    likes: int
    dislikes: int
    is_deleted: bool
    CAT_1: float
    CAT_2: float
    CAT_3: float
    CAT_4: float
    review_text: str

    class Config:
        from_attributes = True


class Reaction(BaseModel):
    reaction_id: int
    user_id: uuid.UUID
    review_id: int
    reacted_at: datetime
    state: int

    class Config:
        from_attributes = True
