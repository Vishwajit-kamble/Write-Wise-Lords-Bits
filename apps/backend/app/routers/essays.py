from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..models.essay import Essay
from ..models.user import User
from ..schemas.essay import EssayCreate, EssayOut, EssayUpdate
from ..deps import get_current_user
from ..celery_app import run_ai_feedback

router = APIRouter(prefix="/essays", tags=["essays"])

@router.post("", response_model=EssayOut)
def create_essay(payload: EssayCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    essay = Essay(author_id=user.id, title=payload.title, content=payload.content)
    db.add(essay)
    db.commit()
    db.refresh(essay)
    return essay

@router.get("", response_model=list[EssayOut])
def list_my_essays(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Essay).filter(Essay.author_id == user.id).order_by(Essay.created_at.desc()).all()

@router.get("/{essay_id}", response_model=EssayOut)
def get_essay(essay_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    essay = db.query(Essay).filter(Essay.id == essay_id, Essay.author_id == user.id).first()
    if not essay:
        raise HTTPException(status_code=404, detail="Not found")
    return essay

@router.put("/{essay_id}", response_model=EssayOut)
def update_essay(essay_id: int, payload: EssayUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    essay = db.query(Essay).filter(Essay.id == essay_id, Essay.author_id == user.id).first()
    if not essay:
        raise HTTPException(status_code=404, detail="Not found")
    if payload.title is not None:
        essay.title = payload.title
    if payload.content is not None:
        essay.content = payload.content
    if payload.is_draft is not None:
        essay.is_draft = payload.is_draft
    db.commit()
    db.refresh(essay)
    return essay

@router.post("/{essay_id}/ai-feedback")
def trigger_ai_feedback(essay_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    essay = db.query(Essay).filter(Essay.id == essay_id, Essay.author_id == user.id).first()
    if not essay:
        raise HTTPException(status_code=404, detail="Not found")
    run_ai_feedback.delay(essay.id)
    return {"status": "queued"}