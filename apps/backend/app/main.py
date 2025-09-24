from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os

# Import database-related modules
from .db import engine
from .models.base import Base
from .routers import auth as auth_router
from .routers import essays as essays_router
from .routers import reviews as reviews_router
from .routers import analytics as analytics_router
from .routers import lms as lms_router
from .demo_data import create_demo_data

app = FastAPI(title="WriteWise Backend", version="0.1.0")

@app.on_event("startup")
def on_startup() -> None:
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
        
        # Create demo data
        create_demo_data()
        print("Demo data initialized")
        
    except Exception as e:
        print(f"Database startup failed: {e}")

@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "database": "available", "mode": "demo"}

@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "WriteWise Backend API", 
        "version": "0.1.0",
        "status": "running",
        "database": "available",
        "mode": "demo",
        "demo_users": {
            "student1": "student1@demo.com",
            "student2": "student2@demo.com", 
            "teacher": "teacher@demo.com",
            "admin": "admin@demo.com"
        },
        "password": "password123"
    }

# Include all routers
app.include_router(auth_router.router)
app.include_router(essays_router.router)
app.include_router(reviews_router.router)
app.include_router(analytics_router.router)
app.include_router(lms_router.router)

# Serve static files for frontend
if not os.path.exists("static"):
    os.makedirs("static")

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/app", response_class=HTMLResponse)
def serve_app():
    """Serve the main application"""
    with open("static/index.html", "r") as f:
        return HTMLResponse(content=f.read(), status_code=200)