# WhatsApp Autopublisher Bot

FastAPI service that allows teachers to create and publish lessons via WhatsApp.

## Setup

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080
```

Use `.env.example` as reference for required environment variables.

Expose the port via ngrok for local development:

```bash
ngrok http 8080
```
