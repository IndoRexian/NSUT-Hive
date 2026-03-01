from pydantic import BaseModel

class DepartmentOut(BaseModel):
    '''
    Pydantic Model for Department
    '''
    department_id:int
    name:str
    link:str
    class Config:
        from_attributes=True