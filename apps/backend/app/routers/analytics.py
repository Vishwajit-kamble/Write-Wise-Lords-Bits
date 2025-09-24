from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..db import get_db
from ..models.review import Review
from ..deps import require_roles
from ..models.user import UserRole

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/summary", dependencies=[Depends(require_roles("teacher", "admin"))])
def summary(db: Session = Depends(get_db)):
    avg_scores = db.query(
        func.avg(Review.grammar_score),
        func.avg(Review.clarity_score),
        func.avg(Review.argument_score),
        func.count(Review.id)
    ).one()
    return {
        "grammar_avg": float(avg_scores[0] or 0),
        "clarity_avg": float(avg_scores[1] or 0),
        "argument_avg": float(avg_scores[2] or 0),
        "reviews_count": int(avg_scores[3] or 0),
    }