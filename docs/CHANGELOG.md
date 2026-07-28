# CHANGELOG.md — AudioJones.com

Notable repository-level changes. Routine code changes belong in PRs
and commit history, not here. Use this file for:

- Architecture changes (stack, deploy targets).
- Documentation reorganizations.
- Security incidents and rotations (no secret values).
- Decommissions and route removals.

Entries are reverse chronological. Format follows
[Keep a Changelog](https://keepachangelog.com/) loosely.

---

## Unreleased

### Payments
- Enabled direct Stripe checkout: `/api/stripe/checkout` now takes a
  product slug against a server-side catalog (price IDs from
  `STRIPE_PRICE_*` env vars, redirect URLs derived from the site
  origin) instead of arbitrary client-supplied `priceId`/URLs. Both
  Stripe routes read the validated `STRIPE_SECRET_KEY` (was the
  unvalidated `stripe_secret`) and return 503 when unconfigured.
- Pricing page: Revenue Leak Diagnostic and the three ResponseOS tiers
  gained buy CTAs (`CheckoutButton`) that fall back to `/book-a-call`
  when Stripe isn't configured; booking CTAs kept alongside.
- `/api/webhooks/stripe-enhanced` now persists to NeonDB
  (`db/migrations/004_stripe_payments.sql`: `stripe_webhook_events` +
  `stripe_payments` + `stripe_subscriptions`, idempotent on
  `stripe_event_id`) via `src/db/stripe.ts`, replacing the throwing
  Firebase-stub `getDb()` and Firestore-backed event streaming that
  500'd on every event.
- Removed dead `src/components/home/PackagesSection.tsx` (unreferenced,
  stale pricing, dead `/book` links).
- Webhook idempotency is now a claim/mark pair rather than a bare insert:
  `stripe_webhook_events.processed_at` is set only after the state
  projection commits, so a retry following a failed projection redoes the
  work instead of being acked away as a duplicate.
- Webhook state projections are ordered by `Stripe.Event.created`
  (`last_event_at` on both state tables). Stripe does not guarantee
  delivery order; without this a delayed `subscription.updated` could
  overwrite a later `subscription.deleted` and resurrect a cancelled
  subscription as active.
- Checkout attaches the catalog slug to the PaymentIntent/Subscription
  via `payment_intent_data`/`subscription_data` metadata (session
  metadata does not propagate to them), and the webhook persists it to
  `stripe_payments.product` / `stripe_subscriptions.product` — one-time
  payments were previously recorded with no record of what was bought.
- Checkout session creation is wrapped: a bad, archived, or wrong-mode
  price ID now returns 502 and logs, distinct from the 503 "not
  configured" degradation it was previously indistinguishable from.
- `/pricing` acknowledges the `?checkout=` redirect (`CheckoutNotice`,
  plus the buy CTA settling once purchased) so a paying customer is not
  returned to an unchanged page that reads as a failed payment. Both read
  the params client-side under Suspense, so `/pricing` stays static.

### Tooling
- Added `.github/workflows/validation-summary.yml` (Phase 1 of
  `docs/ops/AUTOMATED_VALIDATION_REVIEW_LOOP.md`): aggregates `CI`,
  `Build & Lint`, and `Smoke Test (Preview)` check results into a
  single sticky PR comment + `validation-summary.json` artifact, and
  classifies the next actor (`codex-fix` / `claude-review` /
  `human-approval` / `none`). Local mirror via `pnpm validate` and
  `pnpm validate:summary`. No new secrets; Phase 2 webhook deferred.

### Documentation
- Promoted `docs/design/DESIGN.md` as the canonical design-system file,
  kept `docs/DESIGN.md` as a redirect stub, and removed the tracked
  lowercase `docs/design.md` duplicate that cannot coexist cleanly on
  Windows.
- Established the canonical `docs/` hierarchy: `PRD.md`, `DESIGN.md`,
  `ROADMAP.md`, `SECURITY.md`, `DEPLOYMENT.md`, `DECISIONS.md`,
  `CHANGELOG.md`.
- Added `AGENTS.md` (root) as the durable contract for any AI coding
  agent operating in this repository, and `CLAUDE.md` (root) as the
  Claude-specific addendum.
- Stubbed superseded docs to single-line redirects without deleting:
  `AUDIOJONES_DESIGN.md`, `docs/design.md`, root `DEPLOYMENT.md`,
  `VERCEL_ENV_SETUP.md`, `docs/VERCEL_ENV_SOP.md`, root `secrets.md`,
  `docs/env.example`, `docs/env/env-template.md`.
- Rewrote `README.md` and `.github/copilot-instructions.md` to reflect
  the actual stack (Cloudflare → Vercel/Next.js → Sanity → NeonDB →
  Resend → n8n; Firebase intentionally excluded).
- Updated `package.json` `description` field to a one-line product
  summary.

---

## 2026-04-29 — Firebase removed from AudioJones.com

### Changed
- Migrated lead persistence to NeonDB
  (`applied_intelligence_leads`).
- Sanity confirmed as the only CMS.
- Resend wired for internal lead notifications; n8n moved to
  optional/best-effort.

### Removed
- Firebase Admin / Firestore / Storage code paths from the marketing
  surface.
- `FIREBASE_*` and `NEXT_PUBLIC_FIREBASE_*` env keys.

### Security
- Added `pnpm check:no-firebase` guardrail to fail CI on
  reintroduction of any Firebase import, package, or env key.

### Notes
Full context: [`docs/DECISIONS.md`](./DECISIONS.md) and
[`docs/architecture/stack-decision.md`](./architecture/stack-decision.md).

---

## How to add an entry

1. Add a section under **Unreleased** while the change is in flight.
2. When a release is cut (or at a logical milestone), promote the
   `Unreleased` section to a dated heading and start a fresh
   `Unreleased`.
3. Keep entries concise — one or two lines per bullet. Link to PRs or
   decision entries for detail.
4. **Never paste secret values** into a security entry, even as
   context. Reference only the rotation steps and affected systems.
