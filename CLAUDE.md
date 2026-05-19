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
pnpm dev                  # Start development server
pnpm dev:prod             # Full production build then start (clears .next first)
pnpm build                # Production build (runs sitemap generation after)
pnpm start                # Run production server
pnpm lint                 # ESLint check
pnpm lint:fix             # Auto-fix linting issues
pnpm test                 # Run all tests (integration + e2e)
pnpm test:int             # Integration tests (Vitest)
pnpm test:e2e             # E2E tests (Playwright)
pnpm generate:types       # Regenerate Payload TypeScript types
pnpm generate:importmap   # Regenerate Payload import map (needed after adding custom components to admin)
pnpm payload migrate      # Run database migrations
pnpm backup               # Run DB backup script with Telegram notification (scripts/backup.ps1)
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
    - `products/[...path]/` — Catchall that resolves to either a **product detail page** or a **category listing page** by checking if the last path segment matches a product slug first, then a category slug. Category pages include a sidebar tree, attribute filters, and sort controls.
    - `projects/` — Completed projects gallery.
    - `search/` — Site search.
  - `(sitemaps)/` — XML sitemaps for pages, posts, products, and product-categories.
- `src/app/(payload)/` — Payload admin panel and REST/GraphQL API routes.

### Payload CMS Core

- `src/payload.config.ts` — Central config: database, collections, globals, plugins, live preview breakpoints.
- `src/collections/` — Schema definitions:
  - **Pages**, **Posts** — CMS content with layout builder and drafts.
  - **Products** — E-commerce products with specs, gallery, documents, pricing (`price`/`currency`/`priceOnRequest`), and `filterValues` (auto-computed from filterable specs via `flattenSpecifications` hook).
  - **ProductCategories** — Nested categories (uses Nested Docs plugin); each category has breadcrumbs auto-generated.
  - **AttributeGroups**, **Attributes** — Define product specification attributes; `filterable: true` on an attribute enables faceted filtering in the category listing.
  - **Reviews** — Public can submit (`create: anyone`); only `approved: true` reviews are publicly visible.
  - **Projects** — Completed project gallery with photo uploads.
  - **Media**, **Categories**, **Users**.
- Globals are **feature-collocated**, not in a shared directory:
  - `src/Header/` — Header global: config.ts, Component.tsx (server), Component.client.tsx, Nav/index.tsx, hooks/
  - `src/Footer/` — Footer global: config.ts, Component.tsx, hooks/
  - `src/ContactInfo/` — ContactInfo global (email, phones, addresses used in top bar): config.ts, Component.tsx, hooks/
  - `src/ProductsNotice/` — Site-wide product notice banner: config.ts, Component.tsx, hooks/
- `src/blocks/` — Layout builder blocks registered in the Pages collection. Current blocks: ArchiveBlock, Banner, Code, Content, Form, MediaBlock, Features, Statistics, Solutions, AboutCompany, Clients, PopularProducts, Timeline, Team, LatestPosts, CallToAction, Contacts, CompletedProjects, Downloads, Documentation, Careers, ReadySolutions, WarrantyIntro, MarketingAnalysis, CompanyGrowth, WarrantyFeatures, LeanIntro, LeanPrinciples, LeanTools, LeanResults. RelatedPosts is used on individual post pages (not in the layout builder).
- `src/fields/` — Reusable custom field definitions (defaultLexical rich text, link, linkGroup).
- `src/hooks/` — Payload lifecycle hooks: cache revalidation on save/delete, author auto-population.
- `src/access/` — Access control functions (anyone, authenticated, authenticatedOrPublished).
- `src/plugins/index.ts` — Plugin setup: SEO, Search, Redirects, Form Builder, Nested Docs.
- `src/endpoints/` — Custom API endpoints (e.g., seed).
- `src/search/` — Search plugin field synchronization customization.
- `src/services/notifications/` — External notification integrations triggered on form submission: `telegram.ts` (posts to a Telegram bot) and `crm.ts` (pushes leads to an external CRM).

### Frontend

- `src/components/` — React UI: Admin Bar, Media, Forms, RichText renderer, shadcn/ui wrappers, ProductCard, ProductGallery, ProductTabs, Breadcrumbs, etc.
- `src/providers/` — React context providers (theme, etc.).
- `src/utilities/` — URL generation (`generatePreviewPath`), metadata helpers, formatting.
- `src/heros/` — Hero variations used by the layout builder.

### Product Attribute/Filter System

Products link to `Attributes` via a `specifications` array. Each attribute can be marked `filterable: true`. The `flattenSpecifications` hook (runs `beforeChange`) writes `filterValues` as `"attrSlug:value"` tokens used for faceted filtering on category pages. When adding filterable attributes, the `filterValues` field is read-only in admin (auto-computed).

### Database

PostgreSQL via `@payloadcms/db-postgres`. Migrations managed with `pnpm payload migrate:create` then `pnpm payload migrate`.

### Testing

- Integration tests: `tests/int/**/*.int.spec.ts` (Vitest, jsdom). Helpers in `tests/helpers/` (`login.ts`, `seedUser.ts`).
- E2E tests: `tests/e2e/` (Playwright, Chromium, dev server at `http://localhost:3000`).

## Environment Variables

Required in `.env`:

```
DATABASE_URL             # postgres://user:pass@127.0.0.1:5432/marja-website
PAYLOAD_SECRET           # JWT/encryption secret
NEXT_PUBLIC_SERVER_URL   # Base URL, no trailing slash (e.g. http://localhost:3000)
CRON_SECRET              # Authenticates cron job requests
PREVIEW_SECRET           # Validates draft preview tokens
TELEGRAM_BOT_TOKEN       # Telegram bot token for form submission notifications
TELEGRAM_CHAT_ID         # Telegram chat ID to receive notifications
CRM_WEBHOOK_URL          # Make.com webhook URL — forwards form submissions to amoCRM
```

## Key Patterns

- **Type aliases**: `@/*` → `src/*`, `@payload-config` → `src/payload.config.ts`.
- **Generated types**: After changing collections/fields, run `pnpm generate:types` to update `src/payload-types.ts`.
- **Revalidation**: Frontend pages are revalidated via Next.js cache tags in hooks under `src/hooks/revalidate*` and per-collection `hooks/revalidate*.ts` files.
- **Draft preview**: Posts, Pages, and Products support draft versioning; preview URL uses `PREVIEW_SECRET`.
- **Standalone output**: `next.config.js` uses `output: 'standalone'` — the production build is self-contained for containerized deployment.
- **Payload CMS reference docs**: Detailed docs are in `.claude/skills/payload/reference/` — FIELDS.md, HOOKS.md, QUERIES.md, ACCESS-CONTROL.md, ACCESS-CONTROL-ADVANCED.md, COLLECTIONS.md, ENDPOINTS.md, ADAPTERS.md, ADVANCED.md, PLUGIN-DEVELOPMENT.md. Consult these for Payload-specific patterns.

## Single Test Commands

```bash
# Run one integration test file
pnpm test:int tests/int/my-test.int.spec.ts

# Run one e2e test file
pnpm test:e2e tests/e2e/my-test.spec.ts
```

## Critical Security Rules

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
