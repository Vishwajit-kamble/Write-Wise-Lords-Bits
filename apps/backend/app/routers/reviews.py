from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..models.review import Review
from ..models.user import User, UserRole
from ..schemas.review import ReviewOut, ReviewUpdate
from ..deps import get_current_user, require_roles

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.get("/my", response_model=list[ReviewOut])
def my_reviews(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Review).filter(Review.reviewer_id == user.id).order_by(Review.created_at.desc()).all()

@router.get("/essay/{essay_id}", response_model=list[ReviewOut])
def reviews_for_essay(essay_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Review).filter(Review.essay_id == essay_id).all()

@router.put("/{review_id}", response_model=ReviewOut, dependencies=[Depends(require_roles("teacher", "admin"))])
def update_review(review_id: int, payload: ReviewUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Not found")
    if user.role.value == "teacher" and review.reviewer_id and review.reviewer_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(review, field, value)
    db.commit()
    db.refresh(review)
    return review