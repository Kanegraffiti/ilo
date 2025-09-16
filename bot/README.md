# WhatsApp Autopublisher Bot

FastAPI service that allows teachers to create and publish lessons via WhatsApp.
The bot mirrors the Supabase schema in `supabase/002_whatsapp_autopublisher.sql`
and lets vetted teachers build lessons end-to-end from their phone.

## Setup

```bash
cp .env.example .env  # fill in required secrets
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080
```

Expose the port via ngrok (or similar) for local development and point Meta's
Webhook configuration to the public URL:

```bash
ngrok http 8080
```

### Environment variables

| Name | Description |
| ---- | ----------- |
| `PORT` | HTTP port (defaults to `8080`). |
| `META_VERIFY_TOKEN` | Token supplied to Meta when setting up the webhook. |
| `META_APP_SECRET` | Optional. Used to validate the `X-Hub-Signature-256` header. |
| `META_WA_PHONE_NUMBER_ID` | WhatsApp Business phone number ID. |
| `META_GRAPH_API_TOKEN` | Graph API token for the WhatsApp Business account. |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE` | Supabase service role key. |
| `SUPABASE_BUCKET` | Storage bucket for lesson media. Defaults to `lesson-media`. |
| `ALLOWED_SENDERS` | Comma separated list of WhatsApp numbers allowed to use the bot. Leave empty to allow any sender. |

### Available commands

Send the following commands to the WhatsApp number linked to the bot:

```
new-lesson Module Title | Lesson Title
add-notes Your markdown notes
clear-notes
set-objectives Objective one; Objective two
add-vocab term = meaning
status
publish
cancel
help
```

- Notes and objectives accept multi-line input.
- `add-vocab` accepts one term per line (`=`, `-`, or `:` separates term and meaning).
- Attach images, audio, videos, or documents directly to add them to the current draft.
- `status` replies with a summary of the draft, including counts for notes, media, objectives, and vocabulary.

The bot exposes a health endpoint at `/health` for uptime monitors.
