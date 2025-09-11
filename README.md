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

Tailwind color tokens are defined in `tailwind.config.js`:

- `brand` – `#1C7C54`
- `accent` – `#FFB703`
- `cream` – `#FFF8EF`
- `ink` – `#0F172A`

### Deployment

Deploy to [Vercel](https://vercel.com) with the default Next.js settings. Ensure `NEXT_PUBLIC_BASE_URL` is set. PWA manifest and service worker reside in `public/` and are generated on `pnpm build`.

### Debug clicks

Set `NEXT_PUBLIC_DEBUG_CLICKS=1` to visualize which element receives clicks. When enabled, the clicked element briefly outlines and logs its tag and class to the console. Disable this flag in production.

