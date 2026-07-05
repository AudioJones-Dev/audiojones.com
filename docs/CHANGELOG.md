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

### Decommissions
- Engine long-tail triage (branch `chore/engine-triage`): deleted the
  speculative Firestore-era AI/analytics engines that had zero inbound
  imports from surviving app code and no portal UI referencing their
  routes (directly or via `/api/_proxy/admin/*`):
  - `src/lib/ai/AutoScalingEngine.ts`, `src/lib/ai/SelfHealingEngine.ts`
    (no importers at all)
  - `src/lib/ai/FeedbackDriftEngine.ts` + `src/app/api/admin/models/feedback/`
  - `src/lib/ai/ModelLifecycleEngine.ts` + `src/app/api/admin/models/` +
    `src/lib/ai/models/manifest.json`
  - `src/lib/analytics/AdvancedAnalyticsEngine.ts` +
    `src/app/api/admin/analytics/{route.ts,insights,stream}`
    (`analytics/summary` kept — used by the portal stats page via proxy)
  - `src/lib/analytics/StreamAnalyticsCorrelationEngine.ts` +
    `src/app/api/admin/analytics/correlation/`
  - `src/lib/performance/CDNOptimizationService.ts` (no importers)
- Parked (still stub-coupled, but their admin routes are referenced by
  portal UI pages — need a human decision before removal):
  `BackupDREngine` + `server/backup/backupEngine` (backup page),
  `FeatureFlagsEngine` (feature-flags page + `useFeatureFlag` hook),
  `MultiTenantEngine` + `apiKeyAuth` (multitenant page),
  `PerformanceEngine` (performance page), `SecurityEngine` (security
  page), `SloEngine`/`SLOCreditEngine`/`server/slo/sloEngine` (slo,
  slo-credits, slo-new pages), `SecretsRotationEngine` +
  `server/secrets/secretsEngine` (secrets page; also under active work),
  `AIOperationsEngine` (ai-operations page), `OpenTelemetryManager`
  (observability page), `api/admin/{auto-alerts,infrastructure}`
  (non-engine, left as-is). Their `scripts/*.ts` and `package.json`
  script entries (`backup:*`, `secrets:*`, `multitenant:*`, `slo:*`,
  `seed:capacity`) were kept because the engines they exercise remain.
- Kept (live or explicitly protected): `streaming/EventStreamingEngine`,
  `streaming/EventIntegrations`, `server/incidents*`, all auth files,
  Stripe/billing routes, `observability/TracingMiddleware` (imported by
  the live `api/whop` route).
- Effect: 14 files removed; stub-coupled file count
  (`legacy-stubs`/`firebaseAdmin` importers) 124 → 118.

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
