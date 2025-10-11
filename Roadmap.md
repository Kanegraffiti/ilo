# Project roadmap & file responsibilities

## Application shells
- `app/layout.tsx` – Root layout, fonts, theme providers, and shared metadata for the Next.js App Router experience.
- `app/(public)/page.tsx` – Public landing page with kid-friendly hero, animated marketing sections, feature highlights, and FAQ content aimed at guardians.
- `app/(marketing)/*` – Long-form marketing sub-pages (features, pricing, FAQ, about) that share the marketing layout.
- `app/(authed)/*` – Authenticated learning surfaces such as the learner home, kids area, leaderboards, profile, and cohort dashboards.
- `app/(public)/landing/page.tsx` – Lightweight redirect-style landing surface for campaigns.

## Shared components & styling
- `components/placeholder-image.tsx` – Animated gradient illustration placeholder used wherever final art assets are pending. Provides reduce-motion safe floating effects and accessible labeling for concept art.
- `components/feature-card.tsx` – Icon-led marketing card used on the public landing experience.
- `components/ui/*` – Design system primitives (Buttons, Cards, Chips, etc.) that centralize styling tokens and motion behaviors.
- `app/globals.css` & `styles/*` – Tailwind layer configuration, CSS variables, and global design tokens.

## Animation & interaction utilities
- `lib/anim.ts` – Hooks for framer-motion powered transitions (page enter, card pop, pressable, etc.) that respect `prefers-reduced-motion`.
- `lib/utils.ts` – Shared helpers such as the `cn` class name combiner.

## Content & data
- `content/` – Markdown, YAML, and JSON assets powering marketing copy, lessons, vocab, fun facts, and supporting metadata.
- `supabase/` – SQL migrations, policies, and seed data for Supabase-managed storage and auth.
- `scripts/` – Node-based tooling for seeding, environment validation, and developer tasks.

## Testing & quality
- `tests/` – Playwright end-to-end scenarios and supporting test utilities.
- `lighthouserc.json` – Lighthouse CI configuration for performance and accessibility budgets.
- `eslint-rules/` & `eslint-plugin-local/` – Custom lint rules extending the default ESLint setup.

## Media & placeholders
- Marketing and UI concept art currently rely on the animated gradient placeholders defined in `components/placeholder-image.tsx`. Replace these with final assets by updating the gradient props or swapping in Next.js `<Image>` components.
- Static public assets (logos, favicons, icons) reside under `public/`. Add additional imagery there when production-ready art exports are available.

## Deployment
- `next.config.mjs` – Next.js configuration and image domain controls.
- `vercel.json` (if present) / Vercel dashboard – Deployment target with build commands (`pnpm install --frozen-lockfile`, `pnpm build`).
- Environment variables are validated through `scripts/check-env.mjs` before builds complete.
