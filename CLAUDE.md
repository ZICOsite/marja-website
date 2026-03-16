# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Localization

5 locales: **uz** (default), **ru**, **en**, **tg**, **kk**. All URLs include the locale prefix: `/uz/about`, `/ru/about`.

- Payload CMS: localized fields (`title`, `layout`, `content`, `navItems`, link `label`). Always pass `locale` to `payload.find()` and `payload.findGlobal()`.
- next-intl v4: routing config in `src/i18n/routing.ts`, request config in `src/i18n/request.ts`, UI messages in `src/i18n/messages/{locale}.json`.
- Locale-aware navigation helpers: `src/navigation.ts` (exports `Link`, `redirect`, `useRouter`, `usePathname`).
- Middleware: `src/middleware.ts` — redirects non-prefixed URLs to `/uz/...`.
- Add a new locale: (1) add to `src/i18n/routing.ts` locales array, (2) add to `payload.config.ts` localization.locales, (3) create `src/i18n/messages/{locale}.json`, (4) run `pnpm payload migrate:create` + `pnpm payload migrate`.

## Commands

```bash
pnpm dev              # Start development server
pnpm build            # Production build (runs sitemap generation after)
pnpm start            # Run production server
pnpm lint             # ESLint check
pnpm lint:fix         # Auto-fix linting issues
pnpm test             # Run all tests (integration + e2e)
pnpm test:int         # Integration tests (Vitest)
pnpm test:e2e         # E2E tests (Playwright)
pnpm generate:types   # Regenerate Payload TypeScript types
pnpm payload migrate  # Run database migrations
```

Node >=18.20.2 or >=20.9.0. Package manager: pnpm ^9 or ^10.

## Architecture

This is a **Payload CMS v3 + Next.js 15** full-stack application using the App Router.

### Route Groups

- `src/app/(frontend)/` — Public website. Root `page.tsx` redirects to `/uz`.
  - `[slug]/` — The `slug` param holds the **locale** (uz, ru, en, tg, kk). Acts as the locale layout root (next-intl provider, Header, Footer).
    - `[contentSlug]/` — Dynamic CMS pages (e.g. `/uz/about`). `page.tsx` queries Payload by slug and locale.
    - `posts/` — Blog list and paginated routes (`posts/page/[pageNumber]/`).
    - `posts/[postSlug]/` — Individual blog post.
    - `search/` — Site search.
- `src/app/(payload)/` — Payload admin panel and REST/GraphQL API routes.

### Payload CMS Core

- `src/payload.config.ts` — Central config: database, collections, globals, plugins, live preview breakpoints.
- `src/collections/` — Schema definitions for Pages, Posts, Media, Categories, Users.
- `src/globals/` (Header, Footer) — Site-wide singleton data via `src/Header/` and `src/Footer/`.
- `src/blocks/` — Layout builder blocks (Hero, Content, Archive, CTA, Form, Banner, Code, MediaBlock, RelatedPosts) used in the Pages collection.
- `src/fields/` — Reusable custom field definitions (defaultLexical rich text, link, linkGroup).
- `src/hooks/` — Payload lifecycle hooks: cache revalidation on save/delete, author auto-population.
- `src/access/` — Access control functions (authenticated, published content checks, etc.).
- `src/plugins/index.ts` — Plugin setup: SEO, Search, Redirects, Form Builder, Nested Docs.
- `src/endpoints/` — Custom API endpoints (e.g., seed).
- `src/search/` — Search plugin field synchronization customization.

### Frontend

- `src/components/` — React UI: Admin Bar, Media, Forms, RichText renderer, shadcn/ui wrappers.
- `src/providers/` — React context providers (theme, etc.).
- `src/utilities/` — URL generation (`generatePreviewPath`), metadata helpers, formatting.
- `src/heros/` — Hero variations used by the layout builder.

### Database

PostgreSQL via `@payloadcms/db-postgres`. Migrations managed with `pnpm payload migrate:create` then `pnpm payload migrate`.

### Testing

- Integration tests: `tests/int/**/*.int.spec.ts` (Vitest, jsdom)
- E2E tests: `tests/e2e/` (Playwright, Chromium, dev server at `http://localhost:3000`)

## Environment Variables

Required in `.env`:

```
DATABASE_URL             # postgres://user:pass@127.0.0.1:5432/marja-website
PAYLOAD_SECRET           # JWT/encryption secret
NEXT_PUBLIC_SERVER_URL   # Base URL, no trailing slash (e.g. http://localhost:3000)
CRON_SECRET              # Authenticates cron job requests
PREVIEW_SECRET           # Validates draft preview tokens
```

## Key Patterns

- **Type aliases**: `@/*` → `src/*`, `@payload-config` → `src/payload.config.ts`.
- **Generated types**: After changing collections/fields, run `pnpm generate:types` to update `src/payload-types.ts`.
- **Revalidation**: Frontend pages are revalidated via Next.js cache tags in hooks under `src/hooks/revalidate*`.
- **Draft preview**: Posts and Pages support draft versioning; preview URL uses `PREVIEW_SECRET`.
- **Cursor rules**: Detailed Payload CMS reference docs are in `.cursor/rules/` (access control, hooks, fields, security, etc.) — consult these for Payload-specific patterns.

## Critical Security Rules (from `.cursor/rules/security-critical.mdc`)

### 1. Local API access control is bypassed by default

When passing a `user` to Local API, **always** set `overrideAccess: false`:

```typescript
// ❌ Access control is bypassed even though user is passed
await payload.find({ collection: 'posts', user: someUser })

// ✅ Correct — enforces the user's permissions
await payload.find({ collection: 'posts', user: someUser, overrideAccess: false })
```

### 2. Pass `req` to nested operations in hooks (transaction safety)

```typescript
// ✅ Maintains atomicity within the same DB transaction
async ({ doc, req }) => {
  await req.payload.create({ collection: 'audit-log', data: { docId: doc.id }, req })
}
```

### 3. Prevent infinite hook loops with `req.context`

```typescript
async ({ doc, req, context }) => {
  if (context.skipHooks) return
  await req.payload.update({ ..., context: { skipHooks: true }, req })
}
```

## Single Test Commands

```bash
# Run one integration test file
pnpm test:int tests/int/my-test.int.spec.ts

# Run one e2e test file
pnpm test:e2e tests/e2e/my-test.spec.ts
```
