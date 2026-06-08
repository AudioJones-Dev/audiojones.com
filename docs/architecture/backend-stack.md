# Backend stack — AudioJones.com

This document describes how the runtime pieces fit together. The architectural
decision is in [stack-decision.md](./stack-decision.md). Firebase is
intentionally absent.

## Runtime topology

```
                       ┌────────────────────┐
   Visitor ──────────▶ │   Cloudflare       │  DNS, WAF, CDN, edge cache
                       └─────────┬──────────┘
                                 │
                       ┌─────────▼──────────┐
                       │ Vercel + Next.js   │  SSR, ISR, API routes,
                       │ (App Router)       │  middleware, edge functions
                       └─────────┬──────────┘
                                 │
        ┌────────────────────────┼─────────────────────────┐
        │                        │                         │
   ┌────▼─────┐           ┌──────▼──────┐           ┌──────▼──────┐
   │  Sanity  │           │   NeonDB    │           │   Resend    │
   │  (CMS)   │           │ (Postgres)  │           │   (email)   │
   └──────────┘           └──────┬──────┘           └──────┬──────┘
                                 │                         │
                          ┌──────▼──────┐                  │
                          │    n8n      │◀─────────────────┘
                          │ (workflows) │  optional webhook
                          └─────────────┘
```

Stripe (payments), MailerLite (waitlist + newsletter), and ImageKit (media
CDN) sit alongside the core pipeline. None of them sit on the critical lead
capture path.

## Lead capture flow

1. Visitor submits a form on the marketing site.
2. Next.js API route (`src/app/api/leads/route.ts` or
   `src/app/api/founder-intelligence/leads/route.ts`) validates the payload
   with Zod and rate-limits per IP.
3. The handler scores the lead (`src/lib/leads/lead-scoring.ts`).
4. The lead is persisted to NeonDB via
   `src/db/leads.ts → insertFounderIntelligenceLead` against the
   `applied_intelligence_leads` table (schema:
   `db/migrations/001_applied_intelligence_leads.sql`).
5. The handler sends an internal notification via Resend
   (`RESEND_API_KEY` + `LEAD_NOTIFICATION_EMAIL`) and, if configured, fires
   the optional `N8N_LEAD_WEBHOOK_URL` for downstream automation.
6. n8n failure does **not** block the user response. The lead is durable in
   NeonDB and the email has already been queued via Resend before the webhook
   call.

## Components

### Cloudflare
- DNS, edge cache, WAF, image transformations.
- Cloudflare R2 is the preferred binary storage when needed.
- Cloudflare Workers may be used for edge logic outside the Next.js request
  lifecycle.

### Vercel + Next.js
- Single hosting target. Production = Vercel.
- All HTTP serverless logic lives in `src/app/api/**/route.ts` or middleware.
- Next.js handles ISR for content pages backed by Sanity.

### Sanity (CMS)
- Source of truth for: pages, blog posts, service pages, case studies, FAQs,
  schema content, AEO/SEO metadata.
- Read tokens are server-only (`SANITY_API_READ_TOKEN`).

### NeonDB (Postgres)
- Source of truth for structured data: leads today, anything transactional
  later.
- Connect via `@neondatabase/serverless` (`DATABASE_URL`). The HTTP driver
  works inside both Node and Edge runtimes.
- Schema migrations live in `db/migrations/`.

### Resend
- Transactional email — lead notifications, contact forms, future receipts.
- Required envs: `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`.
  Optional: `RESEND_FROM_EMAIL` / `FROM_EMAIL`.

### n8n
- Optional automation layer. Reachable via webhook (`N8N_LEAD_WEBHOOK_URL` or
  `CRM_WEBHOOK_URL`).
- Must remain optional — lead capture continues if n8n is unreachable.

### Stripe
- Payments for productized offerings via `/api/stripe/*`.
- Webhook signature verification via `STRIPE_WEBHOOK_SECRET`.

### MailerLite
- Waitlist + newsletter via `/api/newsletter` and the MailerLite
  integration route (`/api/integrations/mailerlite`).
- Token-based; falls back to a mock adapter on 4xx/5xx so the UI
  surfaces a "pending" state rather than failing the request.

### ImageKit
- Media CDN. Routes through `IKImage` in `src/components/` with a
  fallback to local `/public` assets in dev.

## Environments and secrets

- All env keys live in [`.env.example`](../../.env.example), `.env.schema.json`,
  and `packages/config/env.schema.ts`.
- Production secrets are managed in Vercel project settings; do not commit
  them. See [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md) for the env workflow and
  [`docs/SECURITY.md`](../SECURITY.md) for handling and rotation.

## Observability

- Application logs flow to Vercel.
- Optional: `SENTRY_DSN` for error reporting, `LOG_LEVEL` for verbosity.
- No Firebase Crashlytics / Performance is wired in.

## What is not in this stack

- Firebase (Firestore, Auth, Storage, Hosting, Functions, Studio).
- Whop. Removed on 2026-06-08; Stripe is the sole payments provider.
- Supabase. The auth/storage/realtime surface this site would have used
  it for no longer exists in this codebase.
- OpenAI / direct LLM SDKs. The marketing site does not call LLMs at
  request time.
- Any admin, client portal, or authenticated surface. See
  [`docs/DECISIONS.md`](../DECISIONS.md) (2026-06-08 entries).
