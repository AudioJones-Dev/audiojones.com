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

### ROI Calculator — lead capture & report delivery
- Added `db/migrations/002_roi_calculator_leads.sql` — the table the
  storage layer has been inserting into never actually existed, so
  production submissions were 503-ing and no email could ever send.
- Replaced the thin client email with a branded **"Your Signal ROI
  Snapshot"** (Executive Snapshot · Revenue Leak · Bottleneck
  Diagnosis · Signal vs. Noise · M.A.P. Attribution Lens · Recommended
  Next Move · CTA).
- Added `/roi-calculator/report/[leadId]` server-rendered report page,
  protected by an HMAC signed-token query param (`?t=...`). Email links
  point here so prospects can revisit the report; ready for headless-
  chrome PDF export later.
- Added optional Slack/n8n internal team notification (env-gated on
  `ROI_CALCULATOR_NOTIFY_WEBHOOK_URL` with fallback to
  `N8N_LEAD_WEBHOOK_URL` / `CRM_WEBHOOK_URL`).
- Surfaced missing-env warnings instead of silently `"skipped"`-ing:
  `RESEND_API_KEY`, `FROM_EMAIL`, and `LEAD_NOTIFICATION_EMAIL` now log
  a single admin-safe console warning on first hit.
- New env vars (both optional): `ROI_REPORT_TOKEN_SECRET`,
  `ROI_CALCULATOR_NOTIFY_WEBHOOK_URL`. Documented in `.env.example`,
  `packages/config/env.schema.ts`, and `.env.schema.json`.
- Added `pnpm roi:smoke` (`scripts/roi-calculator-smoke.ts`) — posts a
  synthetic submission and reports persisted + email status against any
  base URL.

### Documentation
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
