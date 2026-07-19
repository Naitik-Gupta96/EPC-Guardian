from pydantic_settings import BaseSettings
from typing import Literal


class Settings(BaseSettings):
    ENV: Literal["local", "demo", "prod"] = "local"
    APP_MODE: Literal["seeded", "live", "demo", "offline"] = "seeded"
    LOG_LEVEL: str = "INFO"
    API_BASE_URL: str = "http://localhost:8000"
    WEB_BASE_URL: str = "http://localhost:5173"

    DATABASE_URL: str = "postgresql+psycopg://epc:epc@localhost:5432/epcguardian"
    REDIS_URL: str = "redis://localhost:6379/0"
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "epcguardian"

    LLM_PROVIDER: str = "anthropic"
    LLM_MODEL_EXTRACT: str = ""
    LLM_MODEL_DRAFT: str = ""
    LLM_MODEL_CLASSIFY: str = ""
    ANTHROPIC_API_KEY: str = ""
    LLM_CACHE_ENABLED: bool = True
    LLM_ALLOW_NETWORK: bool = True

    DOCUMENT_STORAGE_PATH: str = "./var/documents"
    MAX_UPLOAD_MB: int = 50
    CONFIDENCE_REVIEW_THRESHOLD: float = 0.75
    EQUALITY_ABS_TOLERANCE: float = 0.000001

    DEMO_PROJECT_ID: str = "DC-TIER3-DEMO-001"
    DEMO_CLOCK: str = "2026-07-17T09:00:00Z"

    def validate_live_mode(self):
        if self.APP_MODE == "live":
            if not self.ANTHROPIC_API_KEY:
                raise ValueError("ANTHROPIC_API_KEY is required in live mode")
        return self

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
settings.validate_live_mode()
