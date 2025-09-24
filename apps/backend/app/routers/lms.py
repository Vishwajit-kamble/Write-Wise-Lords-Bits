from fastapi import APIRouter, Depends
from ..deps import require_roles
from ..models.user import UserRole

router = APIRouter(prefix="/lms", tags=["lms"])

@router.post("/sync", dependencies=[Depends(require_roles("teacher", "admin"))])
def sync_placeholder():
    # Placeholder for LMS sync (Moodle/Canvas/Google Classroom)
    return {"status": "queued"}

@router.post("/webhook")
def webhook_placeholder():
    # Placeholder endpoint to receive grade sync callbacks
    return {"ok": True}