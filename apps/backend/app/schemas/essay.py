from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EssayBase(BaseModel):
    title: str
    content: str

class EssayCreate(EssayBase):
    pass

class EssayUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_draft: Optional[bool] = None

class EssayOut(EssayBase):
    id: int
    author_id: int
    is_draft: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
