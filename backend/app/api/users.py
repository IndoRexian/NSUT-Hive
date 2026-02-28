from typing import Annotated, List

from database import get_db
from fastapi import APIRouter, Cookie, Depends, HTTPException
from services.users import *
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/get_user_by_id/")
def get_user_by_id(
    token: Annotated[str | None, Cookie()] = None,
    db: Session = Depends(get_db),
):
    """
    Get user information by  User ID.

    """

    data = get_current_user(token=token, db=db)

    return data
