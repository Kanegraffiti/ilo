# WhatsApp Lesson Bot Service

A FastAPI microservice that lets trusted teachers author Supabase-backed lessons over WhatsApp. Messages flow from WhatsApp Business Cloud API → Supabase → Next.js incremental static regeneration.

## Quickstart

```bash
cd bot
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.sample .env  # fill in secrets before running
uvicorn app:api --host 0.0.0.0 --port 8000
```

The service logs to stdout as JSON lines and requires Python 3.10+.

### Expose a webhook locally

Use any tunnelling tool to expose port `8000` so Meta can reach your webhook:

```bash
# Option A: npx localtunnel (no account required)
npx localtunnel --port 8000 --subdomain lesson-bot

# Option B: ngrok
ngrok http 8000
```

Configure the public URL in the WhatsApp Business Cloud console with the `/webhook/whatsapp` path.

## Environment variables

All configuration lives in `.env` (see `.env.sample` for placeholders):

| Variable | Description |
| --- | --- |
| `WHATSAPP_TOKEN` | WhatsApp Graph API bearer token (server-to-server). |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID used when sending replies. |
| `WHATSAPP_VERIFY_TOKEN` | Token WhatsApp expects when validating the webhook. |
| `WHATSAPP_APP_SECRET` | Optional app secret for validating `X-Hub-Signature-256`. |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for server-side operations. |
| `BOT_MEDIA_BUCKET` | Supabase Storage bucket for lesson media (default `lesson-media`). |
| `NEXT_REVALIDATE_URL` | Next.js `/api/revalidate` endpoint. |
| `NEXT_REVALIDATE_SECRET` | Shared secret for revalidation requests. |
| `BOT_ALLOWED_SENDERS` | Comma-separated E.164 phone numbers allowed to use the bot. Leave empty to allow all senders. |
| `BOT_RATE_LIMIT_WINDOW_SEC` | Rate limiter window in seconds (default `60`). |
| `BOT_RATE_LIMIT_MAX` | Max messages per sender within the window (default `20`). |

## Running & monitoring

- Local development: `uvicorn app:api --host 0.0.0.0 --port 8000`
- Health check: `GET /healthz`
- Webhook verification: `GET /webhook/whatsapp?hub.mode=subscribe&hub.verify_token=<token>&hub.challenge=<value>`

Logs are structured JSON suitable for `jq` or log shippers.

## Testing

```bash
pytest -q
```

The lightweight suite covers the command parser and the message router’s happy/error paths.

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/healthz` | Liveness check. |
| `GET` | `/webhook/whatsapp` | Webhook verification handshake. |
| `POST` | `/webhook/whatsapp` | Receives WhatsApp messages and routes them to Supabase. |
| `POST` | `/publish/revalidate` | Manually trigger Next.js revalidation for one or more paths. |

### Sample payloads

Webhook text message (simplified):

```json
{
  "entry": [
    {
      "changes": [
        {
          "value": {
            "messages": [
              {
                "from": "+15551234567",
                "id": "wamid.ABC123",
                "type": "text",
                "text": {"body": "NEW LESSON: Space | Level: Grade 5 | Topic: Science"}
              }
            ]
          }
        }
      ]
    }
  ]
}
```

Revalidation helper request:

```bash
curl -X POST http://localhost:8000/publish/revalidate \
  -H "Content-Type: application/json" \
  -d '{"paths": ["/lessons/example-lesson"]}'
```

## Command cheat-sheet

Teachers can send `HELP` to receive:

```
Lesson Bot commands:
HELP — show this list.
NEW LESSON: <title> | Level: <level> | Topic: <topic>
ADD BODY: <markdown body>
ADD QUIZ: "<prompt>" | A) option | B) option | C) option | ANS: <A|B|C>
ADD MEDIA: image|audio|video
PUBLISH — publish the draft lesson.
CANCEL — forget the active lesson.
```

## Troubleshooting

- **Signature mismatch**: confirm `WHATSAPP_APP_SECRET` matches Meta’s app secret. Remove it to skip validation while testing locally.
- **403 on webhook POST**: verify the `BOT_ALLOWED_SENDERS` list contains your WhatsApp number.
- **Rate limit messages**: adjust `BOT_RATE_LIMIT_WINDOW_SEC` / `BOT_RATE_LIMIT_MAX` for high-volume sessions.
- **Revalidation failures**: inspect `/publish/revalidate` responses; ensure the Next.js API route and `NEXT_REVALIDATE_SECRET` match.

## Database schema

`db/schema.sql` contains idempotent SQL for lessons, media, quizzes, publishes, and chat state tables (plus sample upsert statements). Apply it manually via the Supabase SQL editor.
