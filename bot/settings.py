"""Configuration loader for the WhatsApp bot service."""
from __future__ import annotations

import logging
from functools import lru_cache
from typing import List, Optional

from dotenv import load_dotenv
from pydantic import Field, HttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    """Application settings sourced from environment variables."""

    model_config = SettingsConfigDict(env_prefix="", case_sensitive=False, populate_by_name=True)

    whatsapp_token: str = Field(..., alias="WHATSAPP_TOKEN")
    whatsapp_phone_number_id: str = Field(..., alias="WHATSAPP_PHONE_NUMBER_ID")
    whatsapp_verify_token: str = Field(..., alias="WHATSAPP_VERIFY_TOKEN")
    supabase_url: HttpUrl = Field(..., alias="SUPABASE_URL")
    supabase_service_role_key: str = Field(..., alias="SUPABASE_SERVICE_ROLE_KEY")
    next_revalidate_url: HttpUrl = Field(..., alias="NEXT_REVALIDATE_URL")
    next_revalidate_secret: str = Field(..., alias="NEXT_REVALIDATE_SECRET")

    bot_allowed_senders: List[str] = Field(default_factory=list, alias="BOT_ALLOWED_SENDERS")
    bot_rate_limit_window_sec: int = Field(60, alias="BOT_RATE_LIMIT_WINDOW_SEC")
    bot_rate_limit_max: int = Field(20, alias="BOT_RATE_LIMIT_MAX")
    bot_media_bucket: str = Field("lesson-media", alias="BOT_MEDIA_BUCKET")
    whatsapp_app_secret: Optional[str] = Field(default=None, alias="WHATSAPP_APP_SECRET")

    @field_validator("bot_allowed_senders", mode="before")
    @classmethod
    def _split_senders(cls, value: object) -> List[str]:
        if value in (None, ""):
            return []
        if isinstance(value, list):
            return [sender.strip() for sender in value if sender and sender.strip()]
        text = str(value)
        return [sender.strip() for sender in text.split(",") if sender.strip()]

    @field_validator("bot_rate_limit_window_sec", "bot_rate_limit_max", mode="before")
    @classmethod
    def _ensure_positive(cls, value: object) -> int:
        try:
            parsed = int(value)
        except (TypeError, ValueError) as exc:
            raise ValueError("Rate limit values must be integers") from exc
        return max(1, parsed)

    @property
    def allow_all_senders(self) -> bool:
        return len(self.bot_allowed_senders) == 0


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached Settings instance and configure logging once."""
    settings = Settings()
    logging.basicConfig(level=logging.INFO)
    return settings


__all__ = ["Settings", "get_settings"]
