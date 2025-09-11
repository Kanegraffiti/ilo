# Ìlọ̀ Yoruba Learning PWA

A progressive web app for learning Yoruba built with Next.js, Supabase, and Workbox.

## Setup

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_NAME=Ìlọ̀
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Install dependencies and run:

```
pnpm install
pnpm dev
```

For termux users, run on localhost and optionally expose via ngrok.

## Scripts

- `pnpm dev` – development server
- `pnpm build` – build and generate service worker
- `pnpm start` – start production server
- `pnpm seed` – seed database (requires Supabase keys)
- `pnpm test` – run Playwright tests

## PWA

App supports offline caching of lessons and background sync for submissions. Icons and manifest are located in `public/`.

Upload lesson media via Supabase dashboard to the `lesson-media` bucket.

## WhatsApp Autopublisher

A separate FastAPI bot allows teachers to create and publish lessons via WhatsApp.

### Local Dev

```bash
cd bot
uvicorn main:app --host 0.0.0.0 --port 8080
```

Expose the port if needed (e.g. Termux):

```bash
ngrok http 8080
```

Configure Meta's webhook using the verify token and subscribe to message events. Add tester numbers before sending commands.

Ensure a private Supabase bucket named `lesson-media` exists. Never expose `SUPABASE_SERVICE_ROLE` to the frontend.

