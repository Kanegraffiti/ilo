"""Integration with the Next.js revalidation endpoint."""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

import httpx

from bot.settings import Settings

logger = logging.getLogger(__name__)


class NextRevalidator:
    """Client for triggering ISR revalidation in Next.js."""

    def __init__(self, settings: Settings, client: Optional[httpx.Client] = None) -> None:
        self.settings = settings
        self._client = client or httpx.Client(timeout=10.0)

    def trigger(self, paths: List[str]) -> List[Dict[str, Any]]:
        """Trigger revalidation for each path and return response summaries."""

        results: List[Dict[str, Any]] = []
        base_url = httpx.URL(str(self.settings.next_revalidate_url))
        for path in paths:
            url = base_url.copy_add_param("secret", self.settings.next_revalidate_secret)
            url = url.copy_add_param("path", path)
            try:
                response = self._client.post(url)
                body = safe_json(response)
                results.append({
                    "path": path,
                    "status": response.status_code,
                    "body": body,
                })
            except httpx.HTTPError as exc:  # pragma: no cover - network errors
                logger.warning("Revalidation request failed", extra={"path": path, "error": str(exc)})
                results.append({"path": path, "status": 500, "body": {"error": str(exc)}})
        return results

    def close(self) -> None:
        self._client.close()


def safe_json(response: httpx.Response) -> Any:
    try:
        return response.json()
    except Exception:
        return response.text


__all__ = ["NextRevalidator"]
