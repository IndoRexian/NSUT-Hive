import uuid
from typing import Annotated, Any, List, Sequence

from database import get_db
from db import schema
from fastapi import APIRouter, Cookie, Depends, HTTPException, Request
from models import reviews
from pydantic import BaseModel
from services.reviews import *
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

router = APIRouter()


class PostReview(BaseModel):
    professor_id: int
    CAT_1: float
    CAT_2: float
    CAT_3: float
    CAT_4: float
    review_text: str | None


class DeleteReview(BaseModel):
    professor_id: int


class AddReaction(BaseModel):
    review_id: int
    state: int


@router.post("/review/add/")
def api_post_review(
    body: PostReview,
    token: Annotated[str | None, Cookie()] = None,
    db: Session = Depends(get_db),
):
    print(token)
    try:
        # if
        return create_review(
            body.professor_id,
            token,
            body.CAT_1,
            body.CAT_2,
            body.CAT_3,
            body.CAT_4,
            body.review_text,
            db,
        )
    except IntegrityError:
        raise HTTPException(
            status_code=422, detail="Review with the same User and Professor Exists."
        )


@router.post("/review/update/")
def api_update_review(
    body: PostReview,
    token: Annotated[str | None, Cookie()] = None,
    db: Session = Depends(get_db),
):
    print(token)
    try:
        return edit_review(
            body.professor_id,
            token,
            [body.CAT_1, body.CAT_2, body.CAT_3, body.CAT_4],
            body.review_text,
            db,
        )
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=422, detail=e._message())


@router.get("/review/get/")
def api_get_reviews(
    profid: int, userid: uuid.UUID = None, db: Session = Depends(get_db)
):
    """
    Gets all reviews if userid is not supplied, otherwise only the pair is provided

    :param profid: Description
    :type profid: int
    :param userid: Description
    :type userid: uuid.UUID
    """
    global_ratings = generate_final_rating(profid, db)
    if userid:
        data = get_review(userid, profid, db)
        result = {"data": [data]}
        if not data or not global_ratings:
            raise HTTPException(
                404, detail="No review found for the Professor by the User."
            )
    else:
        data = get_allreviews_prof(profid, db)
        # if not data or not global_ratings:
        #     raise HTTPException(404, detail="No review found for the Professor.")
        result = {"data": data}
    result.update(global_ratings)
    return result


@router.post("/review/delete/")
def api_delete_reviews(
    body: DeleteReview,
    token: Annotated[str | None, Cookie()] = None,
    db: Session = Depends(get_db),
):
    """
    Gets all reviews if userid is not supplied, otherwise only the pair is provided

    :param profid: Description
    :type profid: int
    :param userid: Description
    :type userid: uuid.UUID
    """
    try:
        return delete_review(token, body.professor_id, db)
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=422, detail=e._message())


@router.post("/review/reaction/add")
def api_add_reaction(
    body: AddReaction,
    token: Annotated[str | None, Cookie()] = None,
    db: Session = Depends(get_db),
):
    try:
        return add_reaction(body.review_id, token, body.state, db)
    except exc.IntegrityError as e:
        raise HTTPException(status_code=422, detail="Duplicate Entry Detected")
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=422, detail=e._message())


@router.post("/review/reaction/delete")
def api_delete_reaction(
    body: AddReaction,
    token: Annotated[str | None, Cookie()] = None,
    db: Session = Depends(get_db),
):
    try:
        return delete_reaction(body.review_id, token, body.state, db)
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=422, detail=e._message())


class Test(BaseModel):
    profid: int


@router.post("/review/reaction/getuser/")
def api_get_user_reactions(
    body: Test,
    token: Annotated[str | None, Cookie()] = None,
    db: Session = Depends(get_db),
):
    print("TOKEN:", token)
    data = get_user_reactions(token, body.profid, db)
    if not data:
        raise HTTPException(404, detail="No review found for the Professor.")
    return data


@router.get("/review/cat/")
def api_get_reviews(
    profid: int = None,
    token: Annotated[str | None, Cookie()] = None,
    db: Session = Depends(get_db),
):
    """


    :param profid: Description
    :type profid: int
    :param userid: Description
    :type userid: uuid.UUID
    """
    data2 = get_user_reactions(token, profid, db)
    data = get_cat_prof(profid, db)
    if not data:
        raise HTTPException(404, detail="No review found for the Professor.")
    # print(data)
    return data
    # return {"data": list(data)}


@router.get("/review/finalrating/")
def api_final_rating(profid: int, db: Session = Depends(get_db)):
    """
    Gets all reviews if userid is not supplied, otherwise only the pair is provided

    :param profid: Description
    :type profid: int
    :param userid: Description
    :type userid: uuid.UUID
    """

    data = generate_final_rating(profid, db)
    if not data:
        raise HTTPException(404, detail="No review found for the Professor.")

    return data
