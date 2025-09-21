"""Command parsing utilities for the WhatsApp lesson bot."""
from __future__ import annotations

import enum
import re
from dataclasses import dataclass
from typing import Any, Dict, Optional


class CommandType(str, enum.Enum):
    """Enumeration of supported teacher commands."""

    HELP = "help"
    NEW_LESSON = "new_lesson"
    ADD_BODY = "add_body"
    ADD_QUIZ = "add_quiz"
    ADD_MEDIA = "add_media"
    PUBLISH = "publish"
    CANCEL = "cancel"
    UNKNOWN = "unknown"


@dataclass
class Command:
    """Parsed representation of an incoming instruction."""

    type: CommandType
    payload: Dict[str, Any]
    raw_text: str
    error: Optional[str] = None

    @property
    def is_valid(self) -> bool:
        return self.error is None and self.type is not CommandType.UNKNOWN


CHEAT_SHEET = (
    "Lesson Bot commands:\n"
    "HELP — show this list.\n"
    "NEW LESSON: <title> | Level: <level> | Topic: <topic>\n"
    "ADD BODY: <markdown body>\n"
    "ADD QUIZ: \"<prompt>\" | A) option | B) option | C) option | ANS: <A|B|C>\n"
    "ADD MEDIA: image|audio|video\n"
    "PUBLISH — publish the draft lesson.\n"
    "CANCEL — forget the active lesson."
)


_HELP_PATTERN = re.compile(r"^\s*help\s*$", re.IGNORECASE)
_NEW_LESSON_PATTERN = re.compile(
    r"^\s*new\s*lesson\s*:?\s*(?P<title>[^|]+?)\s*\|\s*level\s*:?\s*(?P<level>[^|]+?)\s*\|\s*topic\s*:?\s*(?P<topic>.+)$",
    re.IGNORECASE,
)
_ADD_BODY_PATTERN = re.compile(r"^\s*add\s*body\s*:?(?P<body>.+)$", re.IGNORECASE | re.DOTALL)
_ADD_MEDIA_PATTERN = re.compile(
    r"^\s*add\s*media\s*:?\s*(?P<kind>image|audio|video)\s*$",
    re.IGNORECASE,
)
_ADD_QUIZ_PATTERN = re.compile(
    r"""
        ^\s*add\s*quiz\s*:?[\s\u00A0]*
        \"(?P<prompt>.+?)\"\s*
        \|\s*A\)\s*(?P<option_a>[^|]+?)\s*
        \|\s*B\)\s*(?P<option_b>[^|]+?)\s*
        \|\s*C\)\s*(?P<option_c>[^|]+?)\s*
        \|\s*ANS\s*:?[\s\u00A0]*(?P<answer>[ABCabc])\s*$
    """,
    re.IGNORECASE | re.VERBOSE | re.DOTALL,
)
_PUBLISH_PATTERN = re.compile(r"^\s*publish\s*$", re.IGNORECASE)
_CANCEL_PATTERN = re.compile(r"^\s*cancel\s*$", re.IGNORECASE)


class CommandParser:
    """Robust parser that tolerates teacher-friendly formatting."""

    def parse(self, text: str) -> Command:
        clean_text = (text or "").strip()
        if not clean_text:
            return Command(CommandType.UNKNOWN, {}, text, error="Empty message.")

        if _HELP_PATTERN.match(clean_text):
            return Command(CommandType.HELP, {}, text)

        new_lesson_match = _NEW_LESSON_PATTERN.match(clean_text)
        if new_lesson_match:
            title = new_lesson_match.group("title").strip()
            level = new_lesson_match.group("level").strip()
            topic = new_lesson_match.group("topic").strip()
            if not title or not level or not topic:
                return Command(
                    CommandType.UNKNOWN,
                    {},
                    text,
                    error="NEW LESSON requires title, level, and topic.",
                )
            return Command(
                CommandType.NEW_LESSON,
                {"title": title, "level": level, "topic": topic},
                text,
            )

        add_body_match = _ADD_BODY_PATTERN.match(clean_text)
        if add_body_match:
            body = add_body_match.group("body").strip()
            if not body:
                return Command(
                    CommandType.UNKNOWN,
                    {},
                    text,
                    error="ADD BODY requires markdown content.",
                )
            return Command(CommandType.ADD_BODY, {"body": body}, text)

        add_quiz_match = _ADD_QUIZ_PATTERN.match(clean_text)
        if add_quiz_match:
            prompt = add_quiz_match.group("prompt").strip()
            options = [
                add_quiz_match.group("option_a").strip(),
                add_quiz_match.group("option_b").strip(),
                add_quiz_match.group("option_c").strip(),
            ]
            answer_letter = add_quiz_match.group("answer").strip().upper()
            answer_idx = ord(answer_letter) - ord("A")
            if any(not option for option in options):
                return Command(
                    CommandType.UNKNOWN,
                    {},
                    text,
                    error="ADD QUIZ requires three answer options.",
                )
            return Command(
                CommandType.ADD_QUIZ,
                {"prompt": prompt, "options": options, "answer_idx": answer_idx},
                text,
            )

        add_media_match = _ADD_MEDIA_PATTERN.match(clean_text)
        if add_media_match:
            kind = add_media_match.group("kind").lower()
            return Command(CommandType.ADD_MEDIA, {"kind": kind}, text)

        if _PUBLISH_PATTERN.match(clean_text):
            return Command(CommandType.PUBLISH, {}, text)

        if _CANCEL_PATTERN.match(clean_text):
            return Command(CommandType.CANCEL, {}, text)

        return Command(
            CommandType.UNKNOWN,
            {},
            text,
            error="Unknown command. Send HELP for a cheat-sheet.",
        )


def parse_command(text: str) -> Command:
    """Convenience wrapper to parse a command string."""

    return CommandParser().parse(text)


__all__ = ["Command", "CommandParser", "CommandType", "CHEAT_SHEET", "parse_command"]
