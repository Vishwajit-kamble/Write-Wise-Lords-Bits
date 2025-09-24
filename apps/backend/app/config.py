from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    app_name: str = Field(default="WriteWise Backend")
    env: str = Field(default="development")
    debug: bool = Field(default=True)

    host: str = Field(default="0.0.0.0")
    port: int = Field(default=8000)

    jwt_secret: str = Field(default="change-this-in-production")
    jwt_algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=60)

    database_url: str = Field(default="sqlite:///./writewise_demo.db")

    redis_url: str = Field(default="redis://redis:6379/0")
    celery_broker_url: str = Field(default="redis://redis:6379/1")
    celery_result_backend: str = Field(default="redis://redis:6379/2")

    gemini_api_key: str | None = None
    gemini_model: str = Field(default="gemini-1.5-flash")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

settings = Settings()
