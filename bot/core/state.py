"""Chat state helpers."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


_MEDIA_EXPECT_PREFIX = "EXPECT_MEDIA:"


@dataclass
class ChatState:
    """State persisted per sender."""

    sender_phone: str
    active_lesson: Optional[str] = None
    last_cmd: Optional[str] = None

    def expecting_media(self) -> Optional[str]:
        """Return the expected media kind if any."""

        if not self.last_cmd:
            return None
        if self.last_cmd.startswith(_MEDIA_EXPECT_PREFIX):
            return self.last_cmd.split(":", 1)[1]
        return None


def media_expectation(kind: str) -> str:
    """Return the marker stored when waiting for media uploads."""

    return f"{_MEDIA_EXPECT_PREFIX}{kind.lower()}"


__all__ = ["ChatState", "media_expectation"]
