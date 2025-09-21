"""In-memory rate limiting utilities."""
from __future__ import annotations

import threading
import time
from collections import defaultdict, deque
from typing import Deque, DefaultDict


class RateLimiter:
    """Simple fixed-window rate limiter per sender."""

    def __init__(self, max_events: int, window_seconds: int) -> None:
        self.max_events = max_events
        self.window_seconds = window_seconds
        self._events: DefaultDict[str, Deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def allow(self, sender: str) -> bool:
        """Return ``True`` if the sender is within the configured limits."""

        now = time.monotonic()
        with self._lock:
            bucket = self._events[sender]
            while bucket and now - bucket[0] > self.window_seconds:
                bucket.popleft()
            if len(bucket) >= self.max_events:
                return False
            bucket.append(now)
            return True

    def update_limits(self, max_events: int, window_seconds: int) -> None:
        """Update rate limiting thresholds at runtime."""

        with self._lock:
            self.max_events = max(1, max_events)
            self.window_seconds = max(1, window_seconds)


__all__ = ["RateLimiter"]
