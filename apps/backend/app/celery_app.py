from celery import Celery
from sqlalchemy.orm import Session
from .config import settings
from .db import SessionLocal
from .models.review import Review
from .models.essay import Essay
from .services.ai import analyze_essay_async
import asyncio

celery_app = Celery(
    "writewise",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
)

@celery_app.task(name="ai.feedback")
def run_ai_feedback(essay_id: int) -> dict:
    db: Session = SessionLocal()
    try:
        essay = db.query(Essay).filter(Essay.id == essay_id).first()
        if not essay:
            return {"status": "not_found"}
        result = asyncio.run(analyze_essay_async(essay.content))
        review = Review(
            essay_id=essay.id,
            reviewer_id=None,
            comments=None,
            grammar_score=result.get("grammar_score"),
            clarity_score=result.get("clarity_score"),
            argument_score=result.get("argument_score"),
            ai_summary=result.get("ai_summary"),
            status="ai_completed",
        )
        db.add(review)
        db.commit()
        db.refresh(review)
        return {"status": "ok", "review_id": review.id}
    finally:
        db.close()