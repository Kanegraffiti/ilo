"""Routing logic that coordinates command handling and integrations."""
from __future__ import annotations

import logging
from typing import Dict

from bot.core.commands import CHEAT_SHEET, Command, CommandParser, CommandType
from bot.core.ratelimit import RateLimiter
from bot.core.state import ChatState, media_expectation
from bot.integrations.revalidate import NextRevalidator
from bot.integrations.supabase_client import SupabaseService
from bot.integrations.whatsapp import InboundMessage, WhatsAppAPI
from bot.settings import Settings

logger = logging.getLogger(__name__)


class MessageRouter:
    """Coordinate inbound WhatsApp messages with bot behaviour."""

    def __init__(
        self,
        settings: Settings,
        supabase: SupabaseService,
        whatsapp: WhatsAppAPI,
        revalidator: NextRevalidator,
        rate_limiter: RateLimiter,
    ) -> None:
        self.settings = settings
        self.supabase = supabase
        self.whatsapp = whatsapp
        self.revalidator = revalidator
        self.rate_limiter = rate_limiter
        self.parser = CommandParser()

    # ------------------------------------------------------------------
    def handle_payload(self, payload: Dict) -> None:
        messages = self.whatsapp.extract_messages(payload)
        for message in messages:
            self.handle_message(message)

    def handle_message(self, message: InboundMessage) -> None:
        sender = message.sender
        if not (self.settings.allow_all_senders or sender in self.settings.bot_allowed_senders):
            logger.info("Ignoring message from unauthorised sender", extra={"sender": sender})
            return

        if not self.rate_limiter.allow(sender):
            self.whatsapp.send_text_message(sender, "Please slow down. Let's continue in a minute.")
            return

        state = self.supabase.get_chat_state(sender)
        if message.type == "text":
            command = self.parser.parse(message.text or "")
            self._handle_command(command, state)
        else:
            self._handle_media(message, state)

    # ------------------------------------------------------------------
    def _handle_command(self, command: Command, state: ChatState) -> None:
        sender = state.sender_phone
        if not command.is_valid:
            self.whatsapp.send_text_message(sender, command.error or "Unable to understand that command.")
            state.last_cmd = command.type.value
            self.supabase.upsert_chat_state(state)
            return

        if command.type == CommandType.HELP:
            self.whatsapp.send_text_message(sender, CHEAT_SHEET)
            state.last_cmd = command.type.value
            self.supabase.upsert_chat_state(state)
            return

        if command.type == CommandType.NEW_LESSON:
            payload = command.payload
            lesson = self.supabase.create_lesson(
                title=payload["title"],
                level=payload["level"],
                topic=payload["topic"],
                author_phone=sender,
            )
            if not lesson:
                self.whatsapp.send_text_message(sender, "Could not create a lesson right now. Please try again.")
                return
            state.active_lesson = lesson["id"]
            state.last_cmd = command.type.value
            self.supabase.upsert_chat_state(state)
            self.whatsapp.send_text_message(
                sender,
                f"Draft lesson created: {lesson['title']}\nLesson ID: {lesson['id']}",
            )
            return

        if command.type == CommandType.ADD_BODY:
            if not state.active_lesson:
                self.whatsapp.send_text_message(sender, "No active lesson. Use NEW LESSON first.")
                return
            success = self.supabase.update_lesson_body(state.active_lesson, command.payload["body"])
            if success:
                state.last_cmd = command.type.value
                self.supabase.upsert_chat_state(state)
                self.whatsapp.send_text_message(sender, "Updated the lesson body.")
            else:
                self.whatsapp.send_text_message(sender, "Could not update the lesson body. Please retry.")
            return

        if command.type == CommandType.ADD_QUIZ:
            if not state.active_lesson:
                self.whatsapp.send_text_message(sender, "No active lesson. Use NEW LESSON first.")
                return
            payload = command.payload
            success = self.supabase.add_quiz(
                lesson_id=state.active_lesson,
                prompt=payload["prompt"],
                options=payload["options"],
                answer_idx=payload["answer_idx"],
            )
            if success:
                state.last_cmd = command.type.value
                self.supabase.upsert_chat_state(state)
                self.whatsapp.send_text_message(sender, "Quiz added to the lesson.")
            else:
                self.whatsapp.send_text_message(sender, "Could not add the quiz. Please retry.")
            return

        if command.type == CommandType.ADD_MEDIA:
            if not state.active_lesson:
                self.whatsapp.send_text_message(sender, "No active lesson. Use NEW LESSON first.")
                return
            kind = command.payload["kind"]
            state.last_cmd = media_expectation(kind)
            self.supabase.upsert_chat_state(state)
            self.whatsapp.send_text_message(sender, f"Okay! Send the {kind} you want to attach.")
            return

        if command.type == CommandType.PUBLISH:
            if not state.active_lesson:
                self.whatsapp.send_text_message(sender, "No active lesson to publish.")
                return
            lesson = self.supabase.get_lesson(state.active_lesson)
            if not lesson:
                self.whatsapp.send_text_message(sender, "Could not load the lesson. Please try again.")
                return
            slug = lesson.get("slug") or self.supabase.generate_unique_slug(lesson.get("title", "lesson"))
            if not self.supabase.publish_lesson(state.active_lesson, slug):
                self.whatsapp.send_text_message(sender, "Failed to publish. Please try again.")
                return
            revalidation = self.revalidator.trigger([f"/lessons/{slug}"])
            self.supabase.record_publish(state.active_lesson, "whatsapp", {"revalidation": revalidation})
            state.active_lesson = None
            state.last_cmd = command.type.value
            self.supabase.upsert_chat_state(state)
            self.whatsapp.send_text_message(
                sender,
                f"Published! /lessons/{slug}\n(Site will refresh shortly.)",
            )
            return

        if command.type == CommandType.CANCEL:
            state.active_lesson = None
            state.last_cmd = command.type.value
            self.supabase.upsert_chat_state(state)
            self.whatsapp.send_text_message(sender, "Draft cleared. Ready for the next lesson.")
            return

        self.whatsapp.send_text_message(sender, "Command recognised but not implemented.")

    # ------------------------------------------------------------------
    def _handle_media(self, message: InboundMessage, state: ChatState) -> None:
        sender = state.sender_phone
        expected_kind = state.expecting_media()
        if not expected_kind:
            self.whatsapp.send_text_message(sender, "No media expected. Use ADD MEDIA first.")
            return
        if expected_kind != message.type:
            self.whatsapp.send_text_message(
                sender,
                f"Expected a {expected_kind} but received {message.type}. Send ADD MEDIA again if needed.",
            )
            return
        if not state.active_lesson:
            self.whatsapp.send_text_message(sender, "No active lesson. Use NEW LESSON first.")
            return
        if not message.media_id:
            self.whatsapp.send_text_message(sender, "Media payload missing reference. Please resend.")
            return
        media = self.whatsapp.download_media(message.media_id)
        if not media:
            self.whatsapp.send_text_message(sender, "Could not download that media. Please try again.")
            return
        url = self.supabase.upload_lesson_media(
            lesson_id=state.active_lesson,
            filename=message.media_filename or media["filename"],
            blob=media["bytes"],
            mime_type=media["mime_type"],
        )
        if not url:
            self.whatsapp.send_text_message(sender, "Could not store the media. Please try again.")
            return
        stored = self.supabase.add_media_entry(
            lesson_id=state.active_lesson,
            kind=message.type,
            url=url,
            caption=message.caption,
        )
        if not stored:
            self.whatsapp.send_text_message(sender, "Media uploaded but could not record it. Please retry later.")
            return
        state.last_cmd = "media_attached"
        self.supabase.upsert_chat_state(state)
        self.whatsapp.send_text_message(sender, f"Attached {message.type} to the lesson.")


__all__ = ["MessageRouter"]
