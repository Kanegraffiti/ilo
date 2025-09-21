"""WhatsApp Business Cloud API integration helpers."""

from __future__ import annotations

import hashlib
import hmac
import json
import logging
import mimetypes
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

import httpx

from bot.settings import Settings

logger = logging.getLogger(__name__)


@dataclass
class InboundMessage:
    """Representation of an incoming WhatsApp message."""

    sender: str
    message_id: str
    type: str
    text: Optional[str] = None
    media_id: Optional[str] = None
    media_filename: Optional[str] = None
    caption: Optional[str] = None


class WhatsAppAPI:
    """Minimal client for WhatsApp Business Cloud operations."""

    GRAPH_BASE = "https://graph.facebook.com/v20.0"

    def __init__(self, settings: Settings, client: Optional[httpx.Client] = None) -> None:
        self.settings = settings
        self._client = client or httpx.Client(timeout=15.0)

    # ------------------------------------------------------------------
    # Webhook helpers
    # ------------------------------------------------------------------
    def verify_signature(self, signature_header: Optional[str], payload: bytes) -> bool:
        """Validate X-Hub-Signature-256 if present."""

        if not signature_header:
            return True
        secret = self.settings.whatsapp_app_secret or self.settings.whatsapp_token
        if not secret:
            logger.warning("No secret configured for signature validation; accepting payload.")
            return True
        expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
        prefixed = f"sha256={expected}"
        valid = hmac.compare_digest(prefixed, signature_header)
        if not valid:
            logger.warning("Signature mismatch", extra={"signature_header": signature_header})
        return valid

    def extract_messages(self, payload: Dict[str, Any]) -> List[InboundMessage]:
        """Extract inbound messages from the webhook payload."""

        messages: List[InboundMessage] = []
        for entry in payload.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})
                for message in value.get("messages", []):
                    message_type = message.get("type")
                    if message_type not in {"text", "image", "audio", "video"}:
                        continue
                    sender = message.get("from") or value.get("contacts", [{}])[0].get("wa_id")
                    if not sender:
                        continue
                    inbound = InboundMessage(
                        sender=sender,
                        message_id=message.get("id", ""),
                        type=message_type,
                    )
                    if message_type == "text":
                        inbound.text = message.get("text", {}).get("body", "")
                    else:
                        media_block = message.get(message_type, {})
                        inbound.media_id = media_block.get("id")
                        inbound.media_filename = media_block.get("filename")
                        inbound.caption = media_block.get("caption")
                    messages.append(inbound)
        return messages

    # ------------------------------------------------------------------
    # Outbound messaging
    # ------------------------------------------------------------------
    def send_text_message(self, recipient: str, text: str) -> None:
        """Send a plain text WhatsApp message."""

        url = f"{self.GRAPH_BASE}/{self.settings.whatsapp_phone_number_id}/messages"
        payload = {
            "messaging_product": "whatsapp",
            "to": recipient,
            "text": {"preview_url": False, "body": text[:4096]},
        }
        response = self._client.post(url, json=payload, headers=self._headers)
        try:
            response.raise_for_status()
        except httpx.HTTPError:
            logger.warning(
                "Failed to send WhatsApp message",
                extra={"status": response.status_code, "body": safe_json(response)},
            )

    # ------------------------------------------------------------------
    # Media handling
    # ------------------------------------------------------------------
    def download_media(self, media_id: str) -> Optional[Dict[str, Any]]:
        """Download media bytes and metadata for the given WhatsApp media id."""

        meta_url = f"{self.GRAPH_BASE}/{media_id}"
        meta_response = self._client.get(meta_url, headers=self._headers, timeout=15.0)
        try:
            meta_response.raise_for_status()
        except httpx.HTTPError:
            logger.warning(
                "Failed to fetch media metadata",
                extra={"status": meta_response.status_code, "media_id": media_id},
            )
            return None
        metadata = meta_response.json()
        download_url = metadata.get("url")
        if not download_url:
            logger.warning("Media metadata missing download URL", extra={"media_id": media_id})
            return None
        download_response = self._client.get(download_url, headers=self._headers, timeout=30.0)
        try:
            download_response.raise_for_status()
        except httpx.HTTPError:
            logger.warning(
                "Failed to download media",
                extra={"status": download_response.status_code, "media_id": media_id},
            )
            return None
        mime_type = metadata.get("mime_type") or download_response.headers.get("Content-Type")
        filename = metadata.get("file_name")
        if not filename:
            extension = mimetypes.guess_extension(mime_type or "") or ""
            filename = f"{media_id}{extension}"
        return {
            "bytes": download_response.content,
            "mime_type": mime_type,
            "filename": filename,
        }

    def close(self) -> None:
        """Close the underlying HTTP client."""

        self._client.close()

    # ------------------------------------------------------------------
    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.settings.whatsapp_token}",
        }


def safe_json(response: httpx.Response) -> Any:
    """Best-effort JSON decoding for logging."""

    try:
        return response.json()
    except json.JSONDecodeError:
        return response.text


__all__ = ["InboundMessage", "WhatsAppAPI"]
