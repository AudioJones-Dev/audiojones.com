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

## 2026-06-08 — Marketing-only collapse + Founder Intelligence rebrand

### Removed
- **Whop.** `@aj/whop` workspace package, `/api/whop/*` routes,
  `WHOP_*` env keys, the Whop SDK dependency, and the
  `/api/webhooks/whop` surface. Stripe remains the sole payments
  provider.
- **Firebase shims and the entire admin/portal/engine surface.**
  `/portal/*`, `/api/admin/*`, `/api/governance/*`, `/api/incidents/*`,
  all `src/lib/{ai,analytics,automation,backup,featureflags,firestore,
  multitenant,observability,performance,secrets,security,slo,streaming,
  mcp,server,shared}/` "engines", `firebaseAdmin.ts`,
  `legacy-stubs.ts`, the auth surface (`useAuth`, `AuthWidget`,
  `requireAdmin`, `requireClient`), the incidents pipeline, the
  status page, the capacity banner, the blog admin components, and
  the infrastructure scripts (`seedRunbooks`, `testBackupDR`,
  `testSecretsRotation`, `infrastructure/*`) are all deleted.
- Supabase, OpenAI, Discord, and Google Cloud references stripped
  from documentation and env shape — none of those were live.

### Changed
- **Rebrand: Applied Intelligence → Founder Intelligence System.**
  The `/api/applied-intelligence/leads` route is renamed to
  `/api/founder-intelligence/leads`. Internal symbols renamed:
  `AppliedIntelligenceLeadInput` → `FounderIntelligenceLeadInput`,
  `insertAppliedIntelligenceLead` → `insertFounderIntelligenceLead`,
  `persistAppliedIntelligenceLead` → `persistFounderIntelligenceLead`,
  `scoreAppliedIntelligenceLead` → `scoreFounderIntelligenceLead`,
  `notifyAppliedIntelligenceLead` → `notifyFounderIntelligenceLead`,
  `appliedIntelligenceLeadSchema` → `founderIntelligenceLeadSchema`.
  The Neon `applied_intelligence_leads` table is intentionally **not**
  renamed; the legacy table name is stable and is read/written by
  the new symbols.
- The **AI Readiness Diagnostic** (`/ai-readiness-diagnostic`) is
  unchanged — it is a distinct top-of-funnel lead qualifier, not the
  same surface as the FIS discovery flow at
  `/founder-intelligence-system/diagnostic`.

### Notes
- No `/applied-intelligence` page-level redirects ship — the rename
  is hard. Inbound links from old URLs will 404; acceptable given
  the low traffic on that surface.
- Full context: [`docs/DECISIONS.md`](./DECISIONS.md) (three new
  entries dated 2026-06-08).

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
