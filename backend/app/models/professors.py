from pydantic import BaseModel
from typing import Optional

class ProfessorOut(BaseModel):
    '''
    Pydantic Model for Professor
    '''
    professor_id:int
    public_id:str
    name:str
    department:int
    designation:Optional[str]
    qualifications:Optional[str]
    email:Optional[str]
    img_link:Optional[str]
    nsut_link:Optional[str]
    
    class Config:
        from_attributes=True