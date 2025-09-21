"""Unit tests for the command parser."""
from __future__ import annotations

import pytest

from bot.core.commands import CHEAT_SHEET, CommandType, parse_command


@pytest.mark.parametrize(
    "text,title,level,topic",
    [
        ("NEW LESSON: Solar System | Level: Grade 6 | Topic: Science", "Solar System", "Grade 6", "Science"),
        (" new lesson: Fractions | level: Grade 4 | topic: Math ", "Fractions", "Grade 4", "Math"),
    ],
)
def test_parse_new_lesson(text: str, title: str, level: str, topic: str) -> None:
    command = parse_command(text)
    assert command.type is CommandType.NEW_LESSON
    assert command.payload == {"title": title, "level": level, "topic": topic}
    assert command.is_valid


def test_parse_add_body() -> None:
    command = parse_command("ADD BODY: # Heading\nContent")
    assert command.type is CommandType.ADD_BODY
    assert command.payload["body"].startswith("# Heading")
    assert command.is_valid


@pytest.mark.parametrize("answer", ["A", "b", "c"])
def test_parse_add_quiz(answer: str) -> None:
    text = (
        'ADD QUIZ: "What is 2+2?" | A) 4 | B) 5 | C) 6 | ANS: '
        + answer
    )
    command = parse_command(text)
    assert command.type is CommandType.ADD_QUIZ
    assert command.payload["prompt"] == "What is 2+2?"
    assert len(command.payload["options"]) == 3
    assert command.payload["answer_idx"] in {0, 1, 2}


def test_parse_add_media() -> None:
    command = parse_command("ADD MEDIA: image")
    assert command.type is CommandType.ADD_MEDIA
    assert command.payload == {"kind": "image"}


def test_parse_publish_cancel_help() -> None:
    publish = parse_command("publish")
    cancel = parse_command("CANCEL")
    help_command = parse_command("help")
    assert publish.type is CommandType.PUBLISH
    assert cancel.type is CommandType.CANCEL
    assert help_command.type is CommandType.HELP
    assert "Lesson Bot" in CHEAT_SHEET


def test_unknown_command() -> None:
    command = parse_command("something random")
    assert command.type is CommandType.UNKNOWN
    assert not command.is_valid
    assert "Unknown" in command.error
