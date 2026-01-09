from typing import List, Optional

from database import get_db
from db import schema
from fastapi import Depends
from models import professors
from services.reviews import generate_final_rating
from sqlalchemy import select
from sqlalchemy.orm import Session


def get_professor_by_id(
    id: int, db: Session = Depends(get_db)
) -> Optional[professors.ProfessorOut]:
    result = db.execute(
        select(schema.Professor).where(schema.Professor.professor_id == id)
    )
    data = result.scalars().first()
    return data


def get_professor_by_public_id(
    public_id: str, db: Session = Depends(get_db)
) -> Optional[professors.ProfessorOut]:
    result = db.execute(
        select(schema.Professor).where(schema.Professor.public_id == public_id)
    )
    data = result.scalars().first()
    return data


def get_all_professors(db: Session = Depends(get_db)) -> List[professors.ProfessorOut]:
    result = db.execute(select(schema.Professor)).scalars().all()
    return result


def get_professors_by_department_id(
    department_id: int, db: Session = Depends(get_db)
) -> Optional[List[professors.ProfessorOut]]:
    result = (
        db.execute(
            select(schema.Professor).where(schema.Professor.department == department_id)
        )
        .scalars()
        .all()
    )
    return result
