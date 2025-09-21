"""Tests for the message routing layer."""
from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Dict, List

from bot.core.ratelimit import RateLimiter
from bot.core.router import MessageRouter
from bot.core.state import ChatState
from bot.integrations.whatsapp import InboundMessage


@dataclass
class DummySettings:
    bot_allowed_senders: List[str]

    @property
    def allow_all_senders(self) -> bool:
        return len(self.bot_allowed_senders) == 0


class FakeSupabase:
    def __init__(self) -> None:
        self.states: Dict[str, ChatState] = {}
        self.lessons: Dict[str, Dict] = {}
        self.publishes: List[Dict] = []

    def get_chat_state(self, sender: str) -> ChatState:
        return self.states.get(sender, ChatState(sender))

    def upsert_chat_state(self, state: ChatState) -> None:
        self.states[state.sender_phone] = ChatState(
            sender_phone=state.sender_phone,
            active_lesson=state.active_lesson,
            last_cmd=state.last_cmd,
        )

    def create_lesson(self, title: str, level: str, topic: str, author_phone: str) -> Dict:
        lesson_id = f"lesson-{len(self.lessons) + 1}"
        record = {"id": lesson_id, "title": title, "level": level, "topic": topic, "status": "draft"}
        self.lessons[lesson_id] = record
        return record

    def get_lesson(self, lesson_id: str) -> Dict:
        return self.lessons.get(lesson_id)

    def update_lesson_body(self, lesson_id: str, body: str) -> bool:
        lesson = self.lessons.get(lesson_id)
        if not lesson:
            return False
        lesson["body_md"] = body
        return True

    def add_quiz(self, lesson_id: str, prompt: str, options: List[str], answer_idx: int) -> bool:
        lesson = self.lessons.get(lesson_id)
        if not lesson:
            return False
        lesson.setdefault("quizzes", []).append({"prompt": prompt, "options": options, "answer_idx": answer_idx})
        return True

    def publish_lesson(self, lesson_id: str, slug: str) -> bool:
        lesson = self.lessons.get(lesson_id)
        if not lesson:
            return False
        lesson["slug"] = slug
        lesson["status"] = "published"
        return True

    def generate_unique_slug(self, title: str) -> str:
        base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-") or "lesson"
        candidate = base
        suffix = 2
        while any(l.get("slug") == candidate for l in self.lessons.values()):
            candidate = f"{base}-{suffix}"
            suffix += 1
        return candidate

    def record_publish(self, lesson_id: str, channel: str, result: Dict) -> None:
        self.publishes.append({"lesson_id": lesson_id, "channel": channel, "result": result})

    # Methods not exercised in these tests
    def upload_lesson_media(self, *args, **kwargs):  # pragma: no cover - tests do not hit media flow
        raise NotImplementedError

    def add_media_entry(self, *args, **kwargs):  # pragma: no cover - tests do not hit media flow
        raise NotImplementedError


class FakeWhatsApp:
    def __init__(self) -> None:
        self.sent_messages: List[Dict] = []

    def extract_messages(self, payload: Dict) -> List[InboundMessage]:  # pragma: no cover - not used here
        return []

    def send_text_message(self, recipient: str, text: str) -> None:
        self.sent_messages.append({"recipient": recipient, "text": text})

    def download_media(self, media_id: str):  # pragma: no cover - not used here
        return None


class FakeRevalidator:
    def __init__(self) -> None:
        self.triggered_paths: List[str] = []

    def trigger(self, paths: List[str]) -> List[Dict]:
        self.triggered_paths.extend(paths)
        return [{"path": path, "status": 200} for path in paths]


def build_router() -> MessageRouter:
    settings = DummySettings(bot_allowed_senders=["+15551234567"])
    supabase = FakeSupabase()
    whatsapp = FakeWhatsApp()
    revalidator = FakeRevalidator()
    limiter = RateLimiter(10, 60)
    router = MessageRouter(settings, supabase, whatsapp, revalidator, limiter)
    return router


def test_help_command_sends_cheatsheet() -> None:
    router = build_router()
    message = InboundMessage(sender="+15551234567", message_id="1", type="text", text="help")
    router.handle_message(message)
    assert router.whatsapp.sent_messages[-1]["text"].startswith("Lesson Bot commands")
    state = router.supabase.get_chat_state("+15551234567")
    assert state.last_cmd == "help"


def test_new_lesson_creates_state() -> None:
    router = build_router()
    message = InboundMessage(
        sender="+15551234567",
        message_id="2",
        type="text",
        text="NEW LESSON: Rain Cycle | Level: Grade 5 | Topic: Science",
    )
    router.handle_message(message)
    state = router.supabase.get_chat_state("+15551234567")
    assert state.active_lesson is not None
    assert router.whatsapp.sent_messages[-1]["text"].startswith("Draft lesson created")


def test_add_body_requires_active_lesson() -> None:
    router = build_router()
    message = InboundMessage(sender="+15551234567", message_id="3", type="text", text="ADD BODY: Content")
    router.handle_message(message)
    assert router.whatsapp.sent_messages[-1]["text"].startswith("No active lesson")


def test_publish_clears_state_and_revalidates() -> None:
    router = build_router()
    sender = "+15551234567"
    lesson_id = "lesson-42"
    router.supabase.lessons[lesson_id] = {"id": lesson_id, "title": "Gravity", "status": "draft"}
    router.supabase.states[sender] = ChatState(sender_phone=sender, active_lesson=lesson_id)
    message = InboundMessage(sender=sender, message_id="4", type="text", text="publish")
    router.handle_message(message)
    state = router.supabase.get_chat_state(sender)
    assert state.active_lesson is None
    assert router.revalidator.triggered_paths == ["/lessons/gravity"]
    assert "Published" in router.whatsapp.sent_messages[-1]["text"]
