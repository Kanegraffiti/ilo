"""Supabase data access layer."""
from __future__ import annotations

import io
import logging
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from supabase import Client, create_client

from bot.core.state import ChatState
from bot.settings import Settings

logger = logging.getLogger(__name__)


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def _sanitize_markdown(content: str) -> str:
    """Perform a lightweight markdown sanitisation step."""

    text = content.strip()
    return re.sub(r"<\s*/?\s*script[^>]*>", "", text, flags=re.IGNORECASE)


def _slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "lesson"


class SupabaseService:
    """Wrapper around Supabase client with domain-specific helpers."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.client: Client = create_client(settings.supabase_url, settings.supabase_service_role_key)

    # ------------------------------------------------------------------
    # Chat state management
    # ------------------------------------------------------------------
    def get_chat_state(self, sender: str) -> ChatState:
        try:
            response = self.client.table("chat_state").select("sender_phone, active_lesson, last_cmd").eq("sender_phone", sender).execute()
        except Exception as exc:  # pragma: no cover - network errors
            logger.exception("Failed to fetch chat state", extra={"sender": sender, "error": str(exc)})
            return ChatState(sender_phone=sender)
        data = response.data or []
        if not data:
            return ChatState(sender_phone=sender)
        row = data[0]
        return ChatState(
            sender_phone=row.get("sender_phone", sender),
            active_lesson=row.get("active_lesson"),
            last_cmd=row.get("last_cmd"),
        )

    def upsert_chat_state(self, state: ChatState) -> None:
        payload = {
            "sender_phone": state.sender_phone,
            "active_lesson": state.active_lesson,
            "last_cmd": state.last_cmd,
            "updated_at": _utcnow(),
        }
        try:
            self.client.table("chat_state").upsert(payload).execute()
        except Exception as exc:  # pragma: no cover - network errors
            logger.exception("Failed to upsert chat state", extra={"sender": state.sender_phone, "error": str(exc)})

    # ------------------------------------------------------------------
    # Lessons
    # ------------------------------------------------------------------
    def create_lesson(self, title: str, level: str, topic: str, author_phone: str) -> Optional[Dict[str, Any]]:
        payload = {
            "title": title,
            "level": level,
            "topic": topic,
            "author_phone": author_phone,
            "status": "draft",
            "body_md": "",
        }
        try:
            response = self.client.table("lessons").insert(payload).select("id, title, level, topic, status").execute()
        except Exception as exc:  # pragma: no cover - network errors
            logger.exception("Failed to create lesson", extra={"payload": payload, "error": str(exc)})
            return None
        data = response.data or []
        return data[0] if data else None

    def get_lesson(self, lesson_id: str) -> Optional[Dict[str, Any]]:
        try:
            response = self.client.table("lessons").select("id, title, body_md, status, slug").eq("id", lesson_id).execute()
        except Exception as exc:  # pragma: no cover - network errors
            logger.exception("Failed to fetch lesson", extra={"lesson_id": lesson_id, "error": str(exc)})
            return None
        data = response.data or []
        return data[0] if data else None

    def update_lesson_body(self, lesson_id: str, markdown: str) -> bool:
        lesson = self.get_lesson(lesson_id)
        if lesson is None:
            return False
        existing = (lesson.get("body_md") or "").strip()
        cleaned = _sanitize_markdown(markdown)
        combined = f"{existing}\n\n{cleaned}".strip() if existing else cleaned
        payload = {"body_md": combined, "updated_at": _utcnow()}
        try:
            self.client.table("lessons").update(payload).eq("id", lesson_id).execute()
            return True
        except Exception as exc:  # pragma: no cover - network errors
            logger.exception("Failed to update lesson body", extra={"lesson_id": lesson_id, "error": str(exc)})
            return False

    def add_quiz(self, lesson_id: str, prompt: str, options: List[str], answer_idx: int) -> bool:
        payload = {
            "lesson_id": lesson_id,
            "prompt": prompt,
            "options": options,
            "answer_idx": answer_idx,
        }
        try:
            self.client.table("quizzes").insert(payload).execute()
            return True
        except Exception as exc:  # pragma: no cover - network errors
            logger.exception("Failed to add quiz", extra={"lesson_id": lesson_id, "error": str(exc)})
            return False

    def add_media_entry(self, lesson_id: str, kind: str, url: str, caption: Optional[str]) -> bool:
        payload = {
            "lesson_id": lesson_id,
            "kind": kind,
            "url": url,
            "caption": caption,
        }
        try:
            self.client.table("lesson_media").insert(payload).execute()
            return True
        except Exception as exc:  # pragma: no cover - network errors
            logger.exception("Failed to add media entry", extra={"lesson_id": lesson_id, "error": str(exc)})
            return False

    def publish_lesson(self, lesson_id: str, slug: str) -> bool:
        payload = {"status": "published", "slug": slug, "updated_at": _utcnow()}
        try:
            self.client.table("lessons").update(payload).eq("id", lesson_id).execute()
            return True
        except Exception as exc:  # pragma: no cover - network errors
            logger.exception("Failed to publish lesson", extra={"lesson_id": lesson_id, "error": str(exc)})
            return False

    def record_publish(self, lesson_id: str, channel: str, result: Dict[str, Any]) -> None:
        payload = {
            "lesson_id": lesson_id,
            "channel": channel,
            "result": result,
        }
        try:
            self.client.table("publishes").insert(payload).execute()
        except Exception as exc:  # pragma: no cover - network errors
            logger.exception("Failed to record publish", extra={"lesson_id": lesson_id, "error": str(exc)})

    def generate_unique_slug(self, title: str) -> str:
        base = _slugify(title)
        candidate = base
        suffix = 2
        while self.slug_exists(candidate):
            candidate = f"{base}-{suffix}"
            suffix += 1
        return candidate

    def slug_exists(self, slug: str) -> bool:
        try:
            response = self.client.table("lessons").select("slug").eq("slug", slug).execute()
        except Exception as exc:  # pragma: no cover - network errors
            logger.exception("Failed to check slug", extra={"slug": slug, "error": str(exc)})
            return True
        return bool(response.data)

    # ------------------------------------------------------------------
    # Storage
    # ------------------------------------------------------------------
    def upload_lesson_media(self, lesson_id: str, filename: str, blob: bytes, mime_type: Optional[str]) -> Optional[str]:
        path = f"{lesson_id}/{filename}"
        bucket = self.client.storage.from_(self.settings.bot_media_bucket)
        buffer = io.BytesIO(blob)
        buffer.seek(0)
        options = {"content-type": mime_type or "application/octet-stream", "upsert": "true"}
        try:
            bucket.upload(path, buffer, options)
        except Exception as exc:  # pragma: no cover - network errors
            logger.exception("Failed to upload media", extra={"lesson_id": lesson_id, "path": path, "error": str(exc)})
            return None
        try:
            public_url = bucket.get_public_url(path)
        except Exception as exc:  # pragma: no cover - network errors
            logger.exception("Failed to fetch public URL", extra={"path": path, "error": str(exc)})
            return None
        if isinstance(public_url, dict):
            data = public_url.get("data") or {}
            return data.get("publicUrl")
        return str(public_url)


__all__ = ["SupabaseService"]
