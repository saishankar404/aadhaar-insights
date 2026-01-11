import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AARI Backend"
    API_V1_STR: str = "/api"
    # Use SQLite for local development
    DATABASE_URL: str = "sqlite:///./aari.db"

    class Config:
        case_sensitive = True

settings = Settings()
