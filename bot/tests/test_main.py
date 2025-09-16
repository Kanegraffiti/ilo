import importlib.util
import sys
from pathlib import Path

import pytest


MODULE_PATH = Path(__file__).resolve().parents[1] / "main.py"


def load_module(monkeypatch):
    monkeypatch.setenv("META_WA_PHONE_NUMBER_ID", "phone")
    monkeypatch.setenv("META_GRAPH_API_TOKEN", "token")
    monkeypatch.setenv("SUPABASE_URL", "https://example.supabase.co")
    monkeypatch.setenv(
        "SUPABASE_SERVICE_ROLE", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.fake"
    )
    spec = importlib.util.spec_from_file_location(
        "whatsapp_bot_test", MODULE_PATH
    )
    module = importlib.util.module_from_spec(spec)
    loader = spec.loader
    assert loader is not None
    loader.exec_module(module)
    return module


@pytest.fixture
def bot_module(monkeypatch):
    module = load_module(monkeypatch)
    yield module
    sys.modules.pop(module.__name__, None)


def test_parse_objectives_strips_markers(bot_module):
    payload = " - First\n• Second; Third\n"
    assert bot_module.parse_objectives(payload) == ["First", "Second", "Third"]


def test_parse_vocab_entries_accepts_multiple_delimiters(bot_module):
    payload = "term = meaning\nfoo - bar\nbaz: qux\nignored"
    assert bot_module.parse_vocab_entries(payload) == [
        ("term", "meaning"),
        ("foo", "bar"),
        ("baz", "qux"),
    ]


def test_chunk_text_respects_limit(bot_module):
    chunks = list(bot_module.chunk_text("one two three four five", limit=10))
    assert chunks == ["one two", "three", "four five"]


def test_handle_command_unknown_replies_with_help(bot_module, monkeypatch):
    captured = []
    monkeypatch.setattr(
        bot_module,
        "reply_text",
        lambda to, text: captured.append((to, text)),
    )
    bot_module.handle_command("23480", "ping")
    assert any("Unknown command" in text for _, text in captured)


def test_handle_command_help_lists_commands(bot_module, monkeypatch):
    captured = []
    monkeypatch.setattr(
        bot_module,
        "reply_text",
        lambda to, text: captured.append(text),
    )
    bot_module.handle_command("23480", "help")
    assert captured and "WhatsApp lesson bot commands" in captured[0]
