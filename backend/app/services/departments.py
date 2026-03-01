from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import Optional, List

from db import schema
from models import departments
from database import get_db



def get_department_by_id(
    id: int, db: Session = Depends(get_db)
) -> Optional[departments.DepartmentOut]:
    result = db.execute(
        select(schema.Department).where(schema.Department.department_id == id)
    )
    data = result.scalars().first()
    return data

def get_all_departments(
        db: Session=Depends(get_db)
)->Optional[List[departments.DepartmentOut]]:
    result=db.execute(select(schema.Department)).scalars().all()
    return result