from typing import Annotated, List

from database import get_db
from db import schema
from fastapi import APIRouter, Cookie, Depends, HTTPException
from models import users
from services.users import *
from sqlalchemy import select
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
    # data = get_userdata_by_id(token=token, db=db)

    return data


"""    data = get_user_by_id(userid, db)
    if not data:
        raise HTTPException(status_code=404, detail=f"User with id:{userid} not found")
    return data"""
