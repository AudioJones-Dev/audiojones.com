# DECISIONS.md — AudioJones.com decision log

A lightweight architecture decision record (ADR) log. Each entry is
short, dated, and immutable once accepted. Supersede with a new entry
rather than rewriting an old one.

Format:

```
## YYYY-MM-DD — short title
Status: proposed | accepted | superseded | rejected
Decision: …
Rationale: …
Consequences: …
```

---

## 2026-04-29 — Drop Firebase from AudioJones.com

**Status:** accepted
**Decision:** AudioJones.com runs on Cloudflare → Vercel/Next.js →
Sanity → NeonDB → Resend → n8n, with Stripe, MailerLite, and ImageKit
as ancillary services. Firebase (and any `FIREBASE_*` /
`NEXT_PUBLIC_FIREBASE_*` env keys) is intentionally excluded.

**Rationale:** the site's responsibilities — marketing pages, SEO/AEO,
lead capture, transactional email, lightweight automation — are fully
covered by the stack above without overlap. Firebase added duplicate
hosting, duplicate functions, duplicate storage, and duplicate
Postgres-class storage without adding capability for this specific
site. Firebase Studio is also being sunset on 2027-03-22, which made
the dependency strictly worse over time.

**Consequences:**
- A `pnpm check:no-firebase` guardrail fails CI if Firebase imports,
  packages, or env keys are reintroduced.
- The legacy `/portal/*` and `/api/admin/*` routes that depended on
  Firebase Admin were removed entirely on 2026-06-08 (see the
  2026-06-08 decision below). The typed `legacy-stubs.ts` shim was
  deleted in the same change.

Full context: [`docs/architecture/stack-decision.md`](./architecture/stack-decision.md).

---

## 2026-04-29 — NeonDB as the lead store

**Status:** accepted
**Decision:** Founder Intelligence System diagnostic leads and other
structured marketing data persist to NeonDB (Postgres). Sanity remains
the CMS for unstructured/long-form content.

**Rationale:** Neon gives us a real Postgres with branching for
preview environments, low operational overhead, and clean separation
from the CMS surface.

**Consequences:**
- Schema lives in `db/migrations/` (canonical:
  `db/migrations/001_applied_intelligence_leads.sql`).
- Lead capture handlers must persist to Neon **before** firing
  optional integrations (Resend, n8n) so we never lose a lead to a
  downstream outage.

---

## 2026-04-29 — Resend for transactional email; n8n is optional

**Status:** accepted
**Decision:** Internal lead notifications go through Resend
(`RESEND_API_KEY` + `LEAD_NOTIFICATION_EMAIL`). The n8n webhook is
optional and best-effort.

**Rationale:** keeps the critical path short and observable. Email
delivery is a Resend dashboard problem; workflow orchestration is an
n8n problem. They don't block each other.

**Consequences:** lead capture handlers must not let n8n failures
short-circuit the response.

---

## 2026-06-08 — Remove Whop from AudioJones.com

**Status:** accepted
**Decision:** Whop is removed from the marketing site. The
`@aj/whop` workspace package, `/api/whop/*` routes, `WHOP_*` env keys,
and Whop SDK dependency are all deleted. Stripe remains the sole
payments provider for productized offerings.

**Rationale:** the productized fulfillment surface that Whop served
has moved off this codebase. Keeping the integration dormant added
attack surface, env complexity, and reviewer confusion without
serving any live flow.

**Consequences:**
- Pricing posture on `/services` is conversation-driven; checkout
  routes through Stripe where applicable.
- `docs/specs/services-rebrand-spec-2026-05-08.md` §6 (Whop integration)
  is historical context only — the 2026-05-11 amendment had already
  deprecated it for v1.
- Webhook surface for Whop (`/api/webhooks/whop`) is gone.

---

## 2026-06-08 — Remove the admin/client portal and engines surface

**Status:** accepted
**Decision:** AudioJones.com is now a marketing site only. The
`/portal/*` tree, `/api/admin/*`, `/api/governance/*`,
`/api/incidents/*`, all "engines" (`src/lib/{ai,analytics,automation,
backup,featureflags,firestore,multitenant,observability,performance,
secrets,security,slo,streaming,mcp,server,shared}/`), all Firebase
shims (`firebaseAdmin.ts`, `legacy-stubs.ts`), the auth surface
(`useAuth`, `AuthWidget`, `requireAdmin`, `requireClient`), the
incidents pipeline, the status page, the capacity banner, the blog
admin components, and the supporting infrastructure scripts
(`seedRunbooks`, `testBackupDR`, `testSecretsRotation`, `infrastructure/*`)
are deleted.

**Rationale:** none of those surfaces served live traffic. They
existed as a phase-out queue from earlier architecture explorations.
Keeping them in-tree forced every reviewer to mentally separate
"marketing site" from "platform skeleton" and slowed every change.

**Consequences:**
- No auth, no roles, no admin endpoints in this codebase. New
  customer-servicing surfaces go to a separate application.
- `pnpm check:no-firebase` continues to enforce the bright line.
- The `applied_intelligence_leads` Neon table is kept as-is for
  safety (migration 001); only its access path changed.

---

## 2026-06-08 — Rebrand "Applied Intelligence" → "Founder Intelligence System"

**Status:** accepted
**Decision:** The offer Audio Jones sells is named **Founder
Intelligence System** (full name on first reference; "Founder
Intelligence" or "FIS" acceptable after). The legacy "Applied
Intelligence" name is retired. The `/api/applied-intelligence/leads`
route is renamed to `/api/founder-intelligence/leads`. Internal
symbols renamed: `AppliedIntelligenceLeadInput` →
`FounderIntelligenceLeadInput`, `insertAppliedIntelligenceLead` →
`insertFounderIntelligenceLead`, `persistAppliedIntelligenceLead` →
`persistFounderIntelligenceLead`, `scoreAppliedIntelligenceLead` →
`scoreFounderIntelligenceLead`, `notifyAppliedIntelligenceLead` →
`notifyFounderIntelligenceLead`, `appliedIntelligenceLeadSchema` →
`founderIntelligenceLeadSchema`.

The **AI Readiness Diagnostic** (`/ai-readiness-diagnostic`) is a
distinct surface — the top-of-funnel lead qualifier — and is **not**
renamed. The FIS has its own discovery flow at
`/founder-intelligence-system/diagnostic`.

**Rationale:** "Applied Intelligence" overlapped with too many
unrelated category claims and didn't communicate the founder-led
positioning. "Founder Intelligence System" anchors the offer in the
buyer the site is built for.

**Consequences:**
- The Neon table `applied_intelligence_leads` is **not** renamed in
  this change — the legacy table name is stable and the code reads
  and writes it under the new symbols. A future migration can rename
  the table once an outage window is acceptable.
- All marketing surfaces, JSON-LD, OpenGraph, and copy refer to
  "Founder Intelligence System" going forward.
- No `/applied-intelligence` page-level redirects are shipped — the
  rename is hard. Inbound links from old URLs will 404; this is
  acceptable given low traffic on that surface.

---

## 2026-05-15 — Documentation readiness bootstrap

**Status:** accepted
**Decision:** Establish `AGENTS.md`, `CLAUDE.md`, and a canonical
`docs/` hierarchy (`PRD.md`, `DESIGN.md`, `ROADMAP.md`,
`SECURITY.md`, `DEPLOYMENT.md`, `DECISIONS.md`, `CHANGELOG.md`).
Older root-level and duplicated docs become one-line redirect stubs
pointing at the canonical files.

**Rationale:** the repo accumulated parallel documents
(`AUDIOJONES_DESIGN.md` + `docs/design.md`, root `DEPLOYMENT.md` +
`VERCEL_ENV_SETUP.md` + `docs/VERCEL_ENV_SOP.md`, `docs/env.example` +
`docs/env/env-template.md`). Without one source of truth, AI agents
and humans both end up reading stale material.

**Consequences:**
- New work updates the canonical docs only.
- Stub files remain so existing inbound links don't 404 in editors,
  but they carry no content beyond a redirect line.
- Future docs follow the same pattern: one canonical home, stubs
  elsewhere if needed.

---

## How to add an entry

1. Append to the bottom of this file with today's date.
2. Use the four-field format above.
3. If the new decision supersedes an older one, mark the older entry
   `superseded by YYYY-MM-DD — short title` instead of deleting it.
4. Keep entries to a screen or less. Link out for detail.
