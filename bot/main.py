import os
import hmac
import hashlib
import logging
import mimetypes
import time
from datetime import datetime, timezone
from typing import Callable, Dict, Iterable, List, Optional, Tuple

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import PlainTextResponse
from requests.exceptions import RequestException
from supabase import Client, create_client

load_dotenv()


logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO").upper())
logger = logging.getLogger("whatsapp_bot")

PORT = int(os.getenv("PORT", "8080"))
META_VERIFY_TOKEN = os.getenv("META_VERIFY_TOKEN", "")
META_APP_SECRET = os.getenv("META_APP_SECRET")


def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(
            f"Missing required environment variable '{name}' for WhatsApp bot"
        )
    return value


META_WA_PHONE_NUMBER_ID = require_env("META_WA_PHONE_NUMBER_ID")
META_GRAPH_API_TOKEN = require_env("META_GRAPH_API_TOKEN")
SUPABASE_URL = require_env("SUPABASE_URL")
SUPABASE_SERVICE_ROLE = require_env("SUPABASE_SERVICE_ROLE")
BUCKET = os.getenv("SUPABASE_BUCKET", "lesson-media")
ALLOWED_SENDERS = {
    s.strip() for s in os.getenv("ALLOWED_SENDERS", "").split(",") if s.strip()
}
ALLOW_ALL_SENDERS = not ALLOWED_SENDERS

MAX_REPLY_CHARS = 3900

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
app = FastAPI()


# Helpers ------------------------------------------------------------------

def verify_signature(raw_body: bytes, header: str) -> bool:
    """Verify X-Hub-Signature-256 using META_APP_SECRET."""
    if not META_APP_SECRET:
        return True
    if not header:
        return False
    signature = hmac.new(
        META_APP_SECRET.encode(), raw_body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={signature}", header)


def chunk_text(text: str, limit: int = MAX_REPLY_CHARS) -> Iterable[str]:
    """Split long messages into WhatsApp-friendly chunks."""
    text = text.strip()
    while len(text) > limit:
        split_at = text.rfind("\n", 0, limit)
        if split_at == -1:
            split_at = text.rfind(" ", 0, limit)
        if split_at == -1:
            split_at = limit
        chunk, text = text[:split_at], text[split_at:]
        yield chunk.strip()
        text = text.lstrip("\n ")
    if text:
        yield text


def reply_text(to: str, text: str) -> None:
    url = f"https://graph.facebook.com/v17.0/{META_WA_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {META_GRAPH_API_TOKEN}",
        "Content-Type": "application/json",
    }
    for chunk in chunk_text(text):
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "text": {"body": chunk},
        }
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            response.raise_for_status()
        except RequestException as exc:  # pragma: no cover - network errors
            logger.warning("Failed to send WhatsApp reply: %s", exc)
            break


def ensure_module(title: str) -> str:
    title = title.strip()
    if not title:
        raise ValueError("Module title cannot be empty")
    res = supabase.table("modules").select("id").eq("title", title).execute()
    if res.data:
        return res.data[0]["id"]
    res = (
        supabase.table("modules")
        .insert({"title": title})
        .select("id")
        .execute()
    )
    return res.data[0]["id"]


def create_lesson(module_id: str, title: str, sender: str) -> str:
    if not title.strip():
        raise ValueError("Lesson title cannot be empty")
    res = (
        supabase.table("lessons")
        .insert({"module_id": module_id, "title": title, "created_by": sender})
        .select("id")
        .execute()
    )
    return res.data[0]["id"]


def get_current_draft(sender: str) -> Optional[str]:
    res = (
        supabase.table("teacher_sessions")
        .select("current_lesson_id")
        .eq("sender", sender)
        .execute()
    )
    if res.data:
        return res.data[0]["current_lesson_id"]
    return None


def set_current_draft(sender: str, lesson_id: Optional[str]) -> None:
    supabase.table("teacher_sessions").upsert(
        {
            "sender": sender,
            "current_lesson_id": lesson_id,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
    ).execute()


def download_media(media_id: str) -> Tuple[bytes, str, str]:
    meta_url = f"https://graph.facebook.com/v17.0/{media_id}"
    try:
        meta_resp = requests.get(
            meta_url, params={"access_token": META_GRAPH_API_TOKEN}, timeout=10
        )
        meta_resp.raise_for_status()
    except RequestException as exc:  # pragma: no cover - network errors
        raise RuntimeError(f"Failed to fetch media metadata: {exc}") from exc
    meta = meta_resp.json()
    url = meta.get("url")
    if not url:
        raise RuntimeError("Media URL missing from WhatsApp response")
    mime = meta.get("mime_type", "application/octet-stream")
    try:
        blob_resp = requests.get(
            url,
            headers={"Authorization": f"Bearer {META_GRAPH_API_TOKEN}"},
            timeout=10,
        )
        blob_resp.raise_for_status()
    except RequestException as exc:  # pragma: no cover - network errors
        raise RuntimeError(f"Failed to download media: {exc}") from exc
    blob = blob_resp.content
    ext = mimetypes.guess_extension(mime) or ""
    return blob, mime, ext.lstrip(".")


def attach_media(
    lesson_id: str, kind: str, blob: bytes, mime: str, ext: str, duration: Optional[int] = None
) -> None:
    ts = int(time.time())
    filename = f"{ts}{('.' + ext) if ext else ''}"
    path = f"{lesson_id}/{filename}"
    supabase.storage.from_(BUCKET).upload(
        path, blob, {"content-type": mime, "upsert": True}
    )
    supabase.table("lesson_media").insert(
        {
            "lesson_id": lesson_id,
            "kind": kind,
            "path": path,
            "mime": mime,
            "duration_seconds": duration,
        }
    ).execute()


def parse_objectives(payload: str) -> List[str]:
    objectives: List[str] = []
    for raw in payload.replace(";", "\n").splitlines():
        item = raw.strip().lstrip("-• ").strip()
        if item:
            objectives.append(item)
    return objectives


def parse_vocab_entries(payload: str) -> List[Tuple[str, str]]:
    entries: List[Tuple[str, str]] = []
    for raw in payload.splitlines():
        line = raw.strip()
        if not line:
            continue
        for sep in ("=", "-", ":"):
            if sep in line:
                term, meaning = [s.strip() for s in line.split(sep, 1)]
                if term and meaning:
                    entries.append((term, meaning))
                break
    return entries


def get_lesson_summary(lesson_id: str) -> Optional[str]:
    lesson_res = (
        supabase.table("lessons")
        .select("id, title, status, notes_md, objectives, module_id, published_at")
        .eq("id", lesson_id)
        .execute()
    )
    if not lesson_res.data:
        return None
    lesson = lesson_res.data[0]
    module_title = "Unassigned"
    if lesson.get("module_id"):
        module_res = (
            supabase.table("modules")
            .select("title")
            .eq("id", lesson["module_id"])
            .execute()
        )
        if module_res.data:
            module_title = module_res.data[0]["title"]
    vocab_res = (
        supabase.table("vocab")
        .select("id", count="exact")
        .eq("lesson_id", lesson_id)
        .execute()
    )
    media_res = (
        supabase.table("lesson_media")
        .select("id", count="exact")
        .eq("lesson_id", lesson_id)
        .execute()
    )
    summary: List[str] = [
        f"Lesson: {lesson['title']}",
        f"Module: {module_title}",
        f"Status: {lesson.get('status', 'Draft')}",
        f"Notes: {'✅' if lesson.get('notes_md') else '❌'}",
        f"Objectives: {len(lesson.get('objectives') or [])}",
        f"Vocabulary items: {vocab_res.count or 0}",
        f"Media attachments: {media_res.count or 0}",
    ]
    if lesson.get("objectives"):
        summary.append("")
        summary.append("Objectives:")
        for idx, objective in enumerate(lesson["objectives"], 1):
            summary.append(f"{idx}. {objective}")
    if lesson.get("published_at"):
        summary.append("")
        published = lesson["published_at"]
        summary.append(f"Published at: {published}")
    return "\n".join(summary)


def command_new_lesson(sender: str, payload: str) -> None:
    if "|" not in payload:
        reply_text(sender, "Format: new-lesson Module | Lesson")
        return
    module_title, lesson_title = [s.strip() for s in payload.split("|", 1)]
    if not module_title or not lesson_title:
        reply_text(sender, "Module and lesson titles are required.")
        return
    try:
        module_id = ensure_module(module_title)
        lesson_id = create_lesson(module_id, lesson_title, sender)
        set_current_draft(sender, lesson_id)
    except Exception as exc:  # pragma: no cover - supabase/network errors
        logger.exception("Failed to create lesson: %s", exc)
        reply_text(sender, "Failed to create draft. Please try again.")
        return
    reply_text(sender, f"Draft created: {lesson_title}")


def command_add_notes(sender: str, payload: str) -> None:
    if not payload:
        reply_text(sender, "Send notes after the add-notes command.")
        return
    lesson_id = get_current_draft(sender)
    if not lesson_id:
        reply_text(sender, "No draft lesson. Use new-lesson first.")
        return
    res = (
        supabase.table("lessons").select("notes_md").eq("id", lesson_id).execute()
    )
    existing = res.data[0].get("notes_md") if res.data else ""
    notes = f"{existing}\n\n{payload}".strip() if existing else payload
    supabase.table("lessons").update({"notes_md": notes}).eq("id", lesson_id).execute()
    reply_text(sender, "Notes updated.")


def command_clear_notes(sender: str, _: str) -> None:
    lesson_id = get_current_draft(sender)
    if not lesson_id:
        reply_text(sender, "No draft lesson to clear notes from.")
        return
    supabase.table("lessons").update({"notes_md": None}).eq("id", lesson_id).execute()
    reply_text(sender, "Notes cleared.")


def command_set_objectives(sender: str, payload: str) -> None:
    objectives = parse_objectives(payload)
    if not objectives:
        reply_text(sender, "Send objectives separated by new lines, dashes, or semicolons.")
        return
    lesson_id = get_current_draft(sender)
    if not lesson_id:
        reply_text(sender, "No draft lesson. Use new-lesson first.")
        return
    supabase.table("lessons").update({"objectives": objectives}).eq("id", lesson_id).execute()
    reply_text(sender, f"Saved {len(objectives)} objective(s).")


def command_add_vocab(sender: str, payload: str) -> None:
    entries = parse_vocab_entries(payload)
    if not entries:
        reply_text(sender, "Send vocab lines like: word = meaning")
        return
    lesson_id = get_current_draft(sender)
    if not lesson_id:
        reply_text(sender, "No draft lesson.")
        return
    rows = [
        {"lesson_id": lesson_id, "term": term, "meaning": meaning}
        for term, meaning in entries
    ]
    supabase.table("vocab").insert(rows).execute()
    reply_text(sender, f"Added {len(rows)} vocab item(s).")


def command_publish(sender: str, _: str) -> None:
    lesson_id = get_current_draft(sender)
    if not lesson_id:
        reply_text(sender, "No draft to publish.")
        return
    res = (
        supabase.table("lessons").select("status").eq("id", lesson_id).execute()
    )
    status = res.data[0].get("status") if res.data else "Draft"
    if status == "Published":
        reply_text(sender, "Lesson already published.")
        return
    supabase.table("lessons").update(
        {"status": "Published", "published_at": datetime.now(timezone.utc).isoformat()}
    ).eq("id", lesson_id).execute()
    set_current_draft(sender, None)
    reply_text(sender, "Lesson published.")


def command_cancel(sender: str, _: str) -> None:
    lesson_id = get_current_draft(sender)
    if not lesson_id:
        reply_text(sender, "No draft to cancel.")
        return
    supabase.table("lessons").delete().eq("id", lesson_id).execute()
    set_current_draft(sender, None)
    reply_text(sender, "Draft deleted.")


def command_status(sender: str, _: str) -> None:
    lesson_id = get_current_draft(sender)
    if not lesson_id:
        reply_text(sender, "No active draft. Use new-lesson to start one.")
        return
    summary = get_lesson_summary(lesson_id)
    if not summary:
        reply_text(sender, "Draft could not be found. Start a new lesson.")
        set_current_draft(sender, None)
        return
    reply_text(sender, summary)


HELP_TEXT = "\n".join(
    [
        "WhatsApp lesson bot commands:",
        "• new-lesson Module | Lesson title",
        "• add-notes Your markdown notes",
        "• clear-notes",
        "• set-objectives Objective A; Objective B",
        "• add-vocab word = meaning",
        "• status",
        "• publish",
        "• cancel",
    ]
)


def command_help(sender: str, _: str) -> None:
    reply_text(sender, HELP_TEXT)


CommandHandler = Callable[[str, str], None]
COMMAND_HANDLERS: Dict[str, CommandHandler] = {
    "new-lesson": command_new_lesson,
    "add-notes": command_add_notes,
    "clear-notes": command_clear_notes,
    "set-objectives": command_set_objectives,
    "add-vocab": command_add_vocab,
    "publish": command_publish,
    "cancel": command_cancel,
    "status": command_status,
    "help": command_help,
    "commands": command_help,
}


def handle_command(sender: str, body: str) -> None:
    text = (body or "").strip()
    if not text:
        reply_text(sender, "Send a command. Try 'help' for options.")
        return
    parts = text.split(None, 1)
    command = parts[0].lower()
    payload = parts[1] if len(parts) > 1 else ""
    handler = COMMAND_HANDLERS.get(command)
    if not handler:
        reply_text(sender, "Unknown command. Send 'help' for instructions.")
        return
    handler(sender, payload)


def handle_media(sender: str, message: dict) -> None:
    lesson_id = get_current_draft(sender)
    if not lesson_id:
        reply_text(sender, "No draft lesson. Use new-lesson first.")
        return
    kind = message["type"]
    media_block = message.get(kind, {})
    media_id = media_block.get("id")
    if not media_id:
        reply_text(sender, "Media ID missing from message.")
        return
    duration_val = media_block.get("duration")
    duration = None
    if duration_val is not None:
        try:
            duration = int(float(duration_val))
        except (TypeError, ValueError):  # pragma: no cover - defensive
            duration = None
    try:
        blob, mime, ext = download_media(media_id)
        attach_media(lesson_id, kind, blob, mime, ext, duration)
    except Exception as exc:  # pragma: no cover - network/storage errors
        logger.exception("Failed to attach media: %s", exc)
        reply_text(sender, "Could not attach media. Please try again.")
        return
    reply_text(sender, f"Attached {kind}.")


# Webhook endpoints ---------------------------------------------------------

@app.get("/webhook")
def verify(mode: str = "", challenge: str = "", verify_token: str = ""):
    if mode == "subscribe" and verify_token == META_VERIFY_TOKEN:
        return PlainTextResponse(challenge)
    raise HTTPException(status_code=403, detail="Verification failed")


@app.get("/health")
def healthcheck() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/webhook")
async def webhook(request: Request):
    raw = await request.body()
    header = request.headers.get("X-Hub-Signature-256", "")
    if not verify_signature(raw, header):
        raise HTTPException(status_code=403, detail="Invalid signature")
    data = await request.json()
    for entry in data.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {})
            for message in value.get("messages", []):
                sender = message.get("from")
                if not sender:
                    continue
                if not (ALLOW_ALL_SENDERS or sender in ALLOWED_SENDERS):
                    logger.info("Ignoring message from unauthorised sender %s", sender)
                    continue
                if message.get("type") == "text":
                    handle_command(sender, message["text"]["body"])
                elif message.get("type") in {"audio", "image", "video", "document"}:
                    handle_media(sender, message)
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=PORT)
