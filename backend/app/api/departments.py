from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import List
from db import schema
from database import get_db
from services.departments import *
from models import departments


router = APIRouter()


@router.get("/department/", response_model=departments.DepartmentOut)
def get_department(deptid: int, db: Session = Depends(get_db)):
    """
    Get department information by  Department ID.

    Parameters
    ----------

    deptid : int
        The department ID.
        If provided, the endpoint returns all professors in that department.

    """
    print("request made"    )
    data = get_department_by_id(deptid, db)
    if not data:
        raise HTTPException(
            status_code=404, detail=f"Department with id:{deptid} not found"
        )
    return data


@router.get("/departments/", response_model=List[departments.DepartmentOut])
def get_departments(db: Session = Depends(get_db)):
    """
    Get all Departments at once.
    """
    data = get_all_departments(db)
    return data
