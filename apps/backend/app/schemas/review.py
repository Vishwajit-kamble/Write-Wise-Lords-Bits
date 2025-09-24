from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.review import ReviewStatus

class ReviewBase(BaseModel):
    comments: Optional[str] = None
    grammar_score: Optional[float] = None
    clarity_score: Optional[float] = None
    argument_score: Optional[float] = None
    ai_summary: Optional[str] = None

class ReviewCreate(ReviewBase):
    essay_id: int

class ReviewUpdate(ReviewBase):
    status: Optional[ReviewStatus] = None

class ReviewOut(ReviewBase):
    id: int
    essay_id: int
    reviewer_id: Optional[int] = None
    status: ReviewStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
