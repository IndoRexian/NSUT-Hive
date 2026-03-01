from typing import List

from database import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import professors
from services.departments import *
from services.professors import *
from sqlalchemy.orm import Session

router = APIRouter()


@router.get(
    "/professor/",
    response_model=professors.ProfessorOut | List[professors.ProfessorOut],
)
def get_professor(
    profid: int | None = None,
    deptid: int | None = None,
    publicid: str | None = None,
    db: Session = Depends(get_db),
):
    """
    Get professor information by either Professor ID, Public Professor ID or Department ID.

    Parameters
    ----------
    profid : int | None
        The Primary key professor ID, Not the Public ID.
        If provided, the endpoint returns a single professor.

    publicid : str | None
        The 5 digit Public ID of the professor.
        If provided, the endpoint returns a single professor.

    deptid : int | None
        The department ID.
        If provided, the endpoint returns all professors in that department.

    Notes
    -----
    - At least one of `profid`, `publicid` or `deptid` must be provided.
    - Priority: profid > publicid > deptid
    """
    if profid is not None:
        data = get_professor_by_id(profid, db)
        if not data:
            raise HTTPException(
                status_code=404, detail=f"No Professor with professor id:{profid} found"
            )
        return data
    elif publicid is not None:
        data = get_professor_by_public_id(publicid, db)
        if not data:
            raise HTTPException(
                status_code=404,
                detail=f"No Professor with public professor id:{profid} found",
            )
        return data

    elif deptid is not None:
        data = get_professors_by_department_id(deptid, db)
        if not data:
            raise HTTPException(
                status_code=404,
                detail=f"No Professor with department id:{deptid} found",
            )
        return data
    else:
        raise HTTPException(
            status_code=400,
            detail="Provide either profid or deptid as a Query Parameter",
        )


@router.get("/professors/")
def get_professors(db: Session = Depends(get_db)):
    """
    Get all Professors at once.
    """
    data = get_all_professors(db)
    return data
