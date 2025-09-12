# Ìlọ̀ Yoruba Learning PWA

A progressive web app for learning Yoruba built with Next.js, Supabase, and Workbox.

## Quick start

```bash
pnpm install
pnpm dev
```

The site uses Next.js App Router with Tailwind CSS. Fonts load via `next/font` and analytics events fire through a simple `useAnalytics` hook.

### Editing content

Marketing copy lives in `/content`. Update markdown, YAML, or JSON files and redeploy.

### Brand tokens

Tailwind color tokens are defined in `tailwind.config.js` and backed by CSS variables:

- `primary` – `#9C5C2E`
- `secondary` – `#4A5B3F`
- `accent` – `#D37E2C`
- `ink` – `#2C221B`
- `paper` – `#F4E7CD`

### Deployment

Deploy to [Vercel](https://vercel.com) with the default Next.js settings. Ensure `NEXT_PUBLIC_BASE_URL` is set. PWA manifest and service worker reside in `public/` and are generated on `pnpm build`.

### Debug clicks

Set `NEXT_PUBLIC_DEBUG_CLICKS=1` to visualize which element receives clicks. When enabled, the clicked element briefly outlines and logs its tag and class to the console. Disable this flag in production.

## Accounts & Leaderboards

Environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LEADERBOARD_ADMIN_TOKEN`

Run migrations:

```
psql $DATABASE_URL -f supabase/010_accounts_profiles_leaderboards.sql
```

This creates profiles, child profiles, progress tracking, quiz results, and leaderboard tables with row level security policies.

To seed a demo user:

```
pnpm seed
```

API routes use Vercel's Edge runtime where possible; write operations fall back to Node.js runtimes. Rate limiting is provided via a lightweight in-memory helper in development.

