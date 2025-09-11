import os
import hmac
import hashlib
import mimetypes
import time
from datetime import datetime, timezone
from typing import Optional, Tuple

import requests
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import PlainTextResponse
from supabase import create_client, Client

PORT = int(os.getenv("PORT", "8080"))
META_VERIFY_TOKEN = os.getenv("META_VERIFY_TOKEN", "")
META_APP_SECRET = os.getenv("META_APP_SECRET")
META_WA_PHONE_NUMBER_ID = os.getenv("META_WA_PHONE_NUMBER_ID")
META_GRAPH_API_TOKEN = os.getenv("META_GRAPH_API_TOKEN")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE = os.getenv("SUPABASE_SERVICE_ROLE")
BUCKET = os.getenv("SUPABASE_BUCKET", "lesson-media")
ALLOWED_SENDERS = {
    s.strip() for s in os.getenv("ALLOWED_SENDERS", "").split(",") if s.strip()
}

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


def reply_text(to: str, text: str) -> None:
    url = f"https://graph.facebook.com/v17.0/{META_WA_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {META_GRAPH_API_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "text": {"body": text},
    }
    try:
        requests.post(url, json=payload, headers=headers, timeout=10)
    except Exception as e:  # pragma: no cover - basic error log
        print(f"reply_text error: {e}")


def ensure_module(title: str) -> str:
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
        {"sender": sender, "current_lesson_id": lesson_id}
    ).execute()


def download_media(media_id: str) -> Tuple[bytes, str, str]:
    meta_url = f"https://graph.facebook.com/v17.0/{media_id}"
    meta = requests.get(
        meta_url, params={"access_token": META_GRAPH_API_TOKEN}, timeout=10
    ).json()
    url = meta.get("url")
    mime = meta.get("mime_type", "application/octet-stream")
    blob = requests.get(
        url, headers={"Authorization": f"Bearer {META_GRAPH_API_TOKEN}"}, timeout=10
    ).content
    ext = mimetypes.guess_extension(mime) or ""
    return blob, mime, ext.lstrip(".")


def attach_media(
    lesson_id: str, kind: str, blob: bytes, mime: str, ext: str, duration: Optional[int] = None
) -> None:
    ts = int(time.time())
    path = f"{lesson_id}/{ts}.{ext}"
    supabase.storage.from_(BUCKET).upload(path, blob, {"content-type": mime})
    supabase.table("lesson_media").insert(
        {
            "lesson_id": lesson_id,
            "kind": kind,
            "path": path,
            "mime": mime,
            "duration_seconds": duration,
        }
    ).execute()


# Command handlers ----------------------------------------------------------

def handle_command(sender: str, body: str) -> None:
    lower = body.lower()
    if lower.startswith("new-lesson"):
        payload = body[len("new-lesson") :].strip()
        if "|" not in payload:
            reply_text(sender, "Format: new-lesson Module | Lesson")
            return
        module_title, lesson_title = [s.strip() for s in payload.split("|", 1)]
        module_id = ensure_module(module_title)
        lesson_id = create_lesson(module_id, lesson_title, sender)
        set_current_draft(sender, lesson_id)
        reply_text(sender, f"Draft created: {lesson_title}")
    elif lower.startswith("add-notes"):
        lesson_id = get_current_draft(sender)
        if not lesson_id:
            reply_text(sender, "No draft lesson. Use new-lesson first.")
            return
        notes = body[len("add-notes") :].strip()
        res = (
            supabase.table("lessons").select("notes_md").eq("id", lesson_id).execute()
        )
        existing = res.data[0].get("notes_md") if res.data else ""
        new_notes = f"{existing}\n{notes}" if existing else notes
        supabase.table("lessons").update({"notes_md": new_notes}).eq("id", lesson_id).execute()
        reply_text(sender, "Notes updated.")
    elif lower.startswith("add-vocab"):
        lesson_id = get_current_draft(sender)
        if not lesson_id:
            reply_text(sender, "No draft lesson.")
            return
        payload = body[len("add-vocab") :].strip()
        count = 0
        for line in payload.splitlines():
            if "=" in line:
                term, meaning = [s.strip() for s in line.split("=", 1)]
                if term and meaning:
                    supabase.table("vocab").insert(
                        {"lesson_id": lesson_id, "term": term, "meaning": meaning}
                    ).execute()
                    count += 1
        reply_text(sender, f"Added {count} vocab item(s).")
    elif lower.startswith("publish"):
        lesson_id = get_current_draft(sender)
        if not lesson_id:
            reply_text(sender, "No draft to publish.")
            return
        supabase.table("lessons").update(
            {"status": "Published", "published_at": datetime.now(timezone.utc).isoformat()}
        ).eq("id", lesson_id).execute()
        set_current_draft(sender, None)
        reply_text(sender, "Lesson published.")
    elif lower.startswith("cancel"):
        lesson_id = get_current_draft(sender)
        if not lesson_id:
            reply_text(sender, "No draft to cancel.")
            return
        supabase.table("lessons").delete().eq("id", lesson_id).execute()
        set_current_draft(sender, None)
        reply_text(sender, "Draft deleted.")
    else:
        reply_text(sender, "Unknown command.")


def handle_media(sender: str, message: dict) -> None:
    lesson_id = get_current_draft(sender)
    if not lesson_id:
        reply_text(sender, "No draft lesson. Use new-lesson first.")
        return
    kind = message["type"]
    media_id = message[kind]["id"]
    duration = message[kind].get("duration")
    blob, mime, ext = download_media(media_id)
    attach_media(lesson_id, kind, blob, mime, ext, duration)
    reply_text(sender, f"Attached {kind}.")


# Webhook endpoints ---------------------------------------------------------

@app.get("/webhook")
def verify(mode: str = "", challenge: str = "", verify_token: str = ""):
    if mode == "subscribe" and verify_token == META_VERIFY_TOKEN:
        return PlainTextResponse(challenge)
    raise HTTPException(status_code=403, detail="Verification failed")


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
                if sender not in ALLOWED_SENDERS:
                    continue
                if message.get("type") == "text":
                    handle_command(sender, message["text"]["body"])
                elif message.get("type") in {"audio", "image", "video", "document"}:
                    handle_media(sender, message)
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=PORT)
