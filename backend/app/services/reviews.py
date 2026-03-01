import uuid
from datetime import datetime
from typing import List, TypedDict

from core.config import config
from data.netrating import calculate_rating, calculate_rating_per_cat
from database import get_db
from db import schema
from fastapi import Depends
from services.users import get_current_user
from sqlalchemy import case, delete, select, update
from sqlalchemy.orm import Session


def get_allreviews_prof(professor_id: int, db: Session = Depends(get_db)):
    """
    Get all reviews of a Professor

    :param professor_id: The Primary key professor ID, Not the Public ID.
    :type professor_id: int
    :param db: Database session
    :type db: Session
    """
    data = db.execute(
        select(schema.Review, schema.User)
        .join(schema.User, schema.User.user_id == schema.Review.user_id)
        .where(schema.Review.professor_id == professor_id)
    )
    rows = data.mappings().all()
    return _flatten_reviews_data(rows)


def get_cat_prof(professor_id: int, db: Session = Depends(get_db)):
    """
    Get all ratings of a Professor

    :param professor_id: The Primary key professor ID, Not the Public ID.
    :type professor_id: int
    :param db: Database session
    :type db: Session
    """
    data = db.execute(
        select(
            schema.Review.cat_1,
            schema.Review.cat_2,
            schema.Review.cat_3,
            schema.Review.cat_4,
        ).where(schema.Review.professor_id == professor_id)
    )
    rdata = [list(r) for r in data.all()]
    rdata = list(zip(*rdata))
    return {
        "CAT_1": rdata[0] if len(rdata) != 0 else [],
        "CAT_2": rdata[1] if len(rdata) != 0 else [],
        "CAT_3": rdata[2] if len(rdata) != 0 else [],
        "CAT_4": rdata[3] if len(rdata) != 0 else [],
    }


def generate_final_rating(professor_id: int, db: Session = Depends(get_db)):
    data = get_cat_prof(professor_id, db)
    reviews_count = len(data["CAT_1"])
    if reviews_count != 0:

        final_global_rating = calculate_rating(reviews_count, data)
        per_cat_rating = {
            "CAT_1": calculate_rating_per_cat(reviews_count, data["CAT_1"]),
            "CAT_2": calculate_rating_per_cat(reviews_count, data["CAT_2"]),
            "CAT_3": calculate_rating_per_cat(reviews_count, data["CAT_3"]),
            "CAT_4": calculate_rating_per_cat(reviews_count, data["CAT_4"]),
        }
    else:
        final_global_rating = 0
        per_cat_rating = {
            "CAT_1": 0,
            "CAT_2": 0,
            "CAT_3": 0,
            "CAT_4": 0,
        }

    return {"global_rating": final_global_rating, "categories": per_cat_rating}


def create_review(
    professor_id: int,
    token: str,
    CAT_1: float,
    CAT_2: float,
    CAT_3: float,
    CAT_4: float,
    review_text: str = None,
    db: Session = Depends(get_db),
):
    """
    Create a Review. Get a 422 if UserID<->ProfID pair already exists

    :param professor_id: The Primary key professor ID
    :type professor_id: int
    :param user_id: User ID
    :type user_id: uuid.UUID
    :param CAT_1: Teaching Effectiveness
    :type CAT_1: float
    :param CAT_2: Grading
    :type CAT_2: float
    :param CAT_3: Attendence Policy
    :type CAT_3: float
    :param CAT_4: Ease of Workload
    :type CAT_4: float
    :param review_text: Review given by user
    :type review_text: str
    :param db: Database session
    :type db: Session
    """
    user_data = get_current_user(token, db)
    new_review = schema.Review(
        professor_id=professor_id,
        user_id=user_data.user_id,
        created_at=datetime.now(tz=config.TZ),
        cat_1=CAT_1,
        cat_2=CAT_2,
        cat_3=CAT_3,
        cat_4=CAT_4,
        review_text=review_text,
    )
    db.add(new_review)

    db.commit()
    reviewdata = generate_final_rating(professor_id, db)

    db.execute(
        update(schema.Professor)
        .where(professor_id == schema.Professor.professor_id)
        .values(
            global_rating=reviewdata["global_rating"],
            cat_1=reviewdata["categories"]["CAT_1"],
            cat_2=reviewdata["categories"]["CAT_2"],
            cat_3=reviewdata["categories"]["CAT_3"],
            cat_4=reviewdata["categories"]["CAT_4"],
        )
    )
    db.commit()
    # db.refresh(new_review)
    return {"detail": "Success"}


def get_review(user_id: uuid.UUID, professor_id: int, db: Session = Depends(get_db)):
    """
    Get review of a Professor by a User

    :param user_id: User ID
    :type user_id: uuid.UUID
    :param professor_id: The Primary key professor ID, Not the Public ID.
    :type professor_id: int
    :param db: Database session
    :type db: Session
    """
    data = db.execute(
        select(schema.Review)
        .where(schema.Review.user_id == user_id)
        .where(schema.Review.professor_id == professor_id)
    )
    return data.scalars().first()


def delete_review(token: str, professor_id: int, db: Session = Depends(get_db)):
    """
    Delete review of a Professor by a User

    :param user_id: User ID
    :type user_id: uuid.UUID
    :param professor_id: The Primary key professor ID, Not the Public ID.
    :type professor_id: int
    :param db: Database session
    :type db: Session
    """
    user_data = get_current_user(token, db)
    db.execute(
        delete(schema.Review)
        .where(schema.Review.user_id == user_data.user_id)
        .where(schema.Review.professor_id == professor_id)
    )
    db.commit()
    reviewdata = generate_final_rating(professor_id, db)

    db.execute(
        update(schema.Professor)
        .where(professor_id == schema.Professor.professor_id)
        .values(
            global_rating=reviewdata["global_rating"],
            cat_1=reviewdata["categories"]["CAT_1"],
            cat_2=reviewdata["categories"]["CAT_2"],
            cat_3=reviewdata["categories"]["CAT_3"],
            cat_4=reviewdata["categories"]["CAT_4"],
        )
    )
    db.commit()
    return {"detail": "Success"}


def edit_review(
    professor_id: int,
    token: str,
    ratingList: List[float],
    review_text: str | None,
    db: Session = Depends(get_db),
):
    """Edit a Review

    Args:
        professor_id (int): The Primary key professor ID, Not the Public ID.
        token (str): Token
        ratingList (List[float]): The list of category ratings
        review_text (str | None): The review text given by the user
        db (Session): Database session
    """

    user_data = get_current_user(token, db)

    flatten_review_text = review_text.strip()
    flatten_review_text = None if flatten_review_text == "" else flatten_review_text

    db.execute(
        update(schema.Review)
        .where(schema.Review.user_id == user_data.user_id)
        .where(schema.Review.professor_id == professor_id)
        .values(
            cat_1=ratingList[0],
            cat_2=ratingList[1],
            cat_3=ratingList[2],
            cat_4=ratingList[3],
            review_text=flatten_review_text,
        )
    )
    db.commit()
    reviewdata = generate_final_rating(professor_id, db)

    db.execute(
        update(schema.Professor)
        .where(professor_id == schema.Professor.professor_id)
        .values(
            global_rating=reviewdata["global_rating"],
            cat_1=reviewdata["categories"]["CAT_1"],
            cat_2=reviewdata["categories"]["CAT_2"],
            cat_3=reviewdata["categories"]["CAT_3"],
            cat_4=reviewdata["categories"]["CAT_4"],
        )
    )
    db.commit()
    return {"detail": "Success"}


def add_reaction(
    review_id: int,
    token: str,
    state: int,
    db: Session = Depends(get_db),
):
    """Add reaction to a review

    Parameters
    ----------
    review_id : int
        The review DB ID
    token : str
        User Token
    state : int
        Like/Dislike
    db : Session
        Database session
    """

    user_data = get_current_user(token, db)
    new_reaction = schema.Reaction(
        user_id=user_data.user_id,
        review_id=review_id,
        reacted_at=datetime.now(tz=config.TZ),
        state=state,
    )
    db.add(new_reaction)
    if state == 1:

        db.execute(
            update(schema.Review)
            .where(schema.Review.review_id == review_id)
            .values(likes=schema.Review.likes + 1)
        )
    else:

        db.execute(
            update(schema.Review)
            .where(schema.Review.review_id == review_id)
            .values(dislikes=schema.Review.dislikes + 1)
        )
    db.commit()
    return {"detail": "Success"}


def delete_reaction(
    review_id: int, token: str, state: 0 | 1, db: Session = Depends(get_db)
):
    """Deletes a reaction

    Parameters
    ----------
    review_id : int
        The review DB ID
    token : str
        User Token
    state : 0 | 1
        Like/Dislike
    db : Session
        Database session
    """

    user_data = get_current_user(token, db)
    db.execute(
        delete(schema.Reaction)
        .where(schema.Reaction.user_id == user_data.user_id)
        .where(schema.Reaction.review_id == review_id)
    )
    if state == 1:
        db.execute(
            update(schema.Review)
            .where(schema.Review.review_id == review_id)
            .values(
                likes=case(
                    (schema.Review.likes > 0, schema.Review.likes - 1),
                    else_=schema.Review.likes,
                )
            )
        )
    else:
        db.execute(
            update(schema.Review)
            .where(schema.Review.review_id == review_id)
            .values(
                dislikes=case(
                    (schema.Review.dislikes > 0, schema.Review.dislikes - 1),
                    else_=schema.Review.dislikes,
                )
            )
        )
    db.commit()
    return {"detail": "Success"}


def get_user_reactions(token: str, professor_id: int, db: Session = Depends(get_db)):
    """Get User reactions for a review

    Parameters
    ----------
    token : str
        User Token
    professor_id : int
        The Primary key professor ID, Not the Public ID.
    db : Session
        Database session
    """

    user_data = get_current_user(token, db)
    data = db.execute(
        select(schema.Review, schema.Reaction)
        .join(schema.Reaction, schema.Reaction.review_id == schema.Review.review_id)
        .where(schema.Reaction.user_id == user_data.user_id)
        .where(professor_id == schema.Review.professor_id)
    )
    rows = data.mappings().all()
    return _flatten_reactions_data(rows)


class ReviewsDataStructure(TypedDict):
    Review: schema.Review
    User: schema.User


class ReactionsDataStructure(TypedDict):
    Review: schema.Review
    Reaction: schema.Reaction


def _flatten_reviews_data(data: List[ReviewsDataStructure]):
    finaldata = []
    for datadict in data:
        _tempdict = {
            "review_id": datadict["Review"].review_id,
            "professor_id": datadict["Review"].professor_id,
            "user_id": datadict["User"].user_id,
            "username": datadict["User"].username,
            "avatar_style": datadict["User"].avatar_style,
            "created_at": datadict["Review"].created_at,
            "likes": datadict["Review"].likes,
            "dislikes": datadict["Review"].dislikes,
            "cat_1": datadict["Review"].cat_1,
            "cat_2": datadict["Review"].cat_2,
            "cat_3": datadict["Review"].cat_3,
            "cat_4": datadict["Review"].cat_4,
            "review_text": datadict["Review"].review_text,
            "is_deleted": datadict["Review"].is_deleted,
        }

        finaldata.append(_tempdict)
    return finaldata


def _flatten_reactions_data(data: List[ReactionsDataStructure]):
    finaldata = []
    for datadict in data:
        _tempdict = {
            "user_id": datadict["Reaction"].user_id,
            "review_id": datadict["Reaction"].review_id,
            "state": datadict["Reaction"].state,
        }
        finaldata.append(_tempdict)
    return finaldata
