"""FastAPI entrypoint for the WhatsApp lesson bot."""
from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List

from fastapi import Body, FastAPI, HTTPException, Query, Request, status
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse, PlainTextResponse
from pydantic import BaseModel, Field, validator

from bot.core.ratelimit import RateLimiter
from bot.core.router import MessageRouter
from bot.integrations.revalidate import NextRevalidator
from bot.integrations.supabase_client import SupabaseService
from bot.integrations.whatsapp import WhatsAppAPI
from bot.settings import Settings, get_settings


class JsonFormatter(logging.Formatter):
    """Emit structured logs as JSON lines."""

    DEFAULT_FIELDS = {
        "name",
        "msg",
        "args",
        "levelname",
        "levelno",
        "pathname",
        "filename",
        "module",
        "exc_info",
        "exc_text",
        "stack_info",
        "lineno",
        "funcName",
        "created",
        "msecs",
        "relativeCreated",
        "thread",
        "threadName",
        "processName",
        "process",
    }

    def format(self, record: logging.LogRecord) -> str:
        base: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        extras = {
            key: value
            for key, value in record.__dict__.items()
            if key not in self.DEFAULT_FIELDS
        }
        if extras:
            base.update(extras)
        if record.exc_info:
            base["exc_info"] = self.formatException(record.exc_info)
        return json.dumps(base)


def setup_logging() -> None:
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(logging.INFO)


setup_logging()
settings: Settings = get_settings()

supabase_service = SupabaseService(settings)
whatsapp_api = WhatsAppAPI(settings)
revalidator = NextRevalidator(settings)
rate_limiter = RateLimiter(settings.bot_rate_limit_max, settings.bot_rate_limit_window_sec)
message_router = MessageRouter(settings, supabase_service, whatsapp_api, revalidator, rate_limiter)

api = FastAPI(title="Lesson WhatsApp Bot", version="1.0.0")


class RevalidateRequest(BaseModel):
    paths: List[str] = Field(..., example=["/lessons/example-lesson"])

    @validator("paths")
    def _ensure_paths(cls, value: List[str]) -> List[str]:
        if not value:
            raise ValueError("At least one path is required")
        return value


@api.on_event("shutdown")
def shutdown_event() -> None:
    whatsapp_api.close()
    revalidator.close()


@api.get("/healthz", response_model=Dict[str, str])
def healthz() -> Dict[str, str]:
    return {"status": "ok"}


@api.get("/webhook/whatsapp")
def whatsapp_verify(
    hub_mode: str = Query("", alias="hub.mode"),
    hub_challenge: str = Query("", alias="hub.challenge"),
    hub_verify_token: str = Query("", alias="hub.verify_token"),
):
    if hub_mode == "subscribe" and hub_verify_token == settings.whatsapp_verify_token:
        return PlainTextResponse(hub_challenge)
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Verification failed")


@api.post("/webhook/whatsapp")
async def whatsapp_webhook(request: Request) -> JSONResponse:
    raw_body = await request.body()
    signature = request.headers.get("x-hub-signature-256")
    if not whatsapp_api.verify_signature(signature, raw_body):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid signature")
    try:
        payload = json.loads(raw_body.decode("utf-8"))
    except json.JSONDecodeError as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON") from exc
    await run_in_threadpool(message_router.handle_payload, payload)
    return JSONResponse({"status": "accepted"})


@api.post("/publish/revalidate")
async def publish_revalidate(body: RevalidateRequest = Body(...)) -> JSONResponse:
    results = await run_in_threadpool(revalidator.trigger, body.paths)
    return JSONResponse({"results": results})


__all__ = ["api"]
