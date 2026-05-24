# AudioJones.com — Project Source

**Status:** living document
**Owner:** AJ Digital LLC
**Scope:** consolidated product, strategy, and execution source-of-truth for the
public marketing platform at `audiojones.com`.

This document is the GitHub-source-ready single file for project planning. It
inherits the agent contract in [`AGENTS.md`](../../AGENTS.md) and the canonical
docs at [`docs/PRD.md`](../PRD.md), [`docs/ROADMAP.md`](../ROADMAP.md),
[`docs/DESIGN.md`](../DESIGN.md), [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md),
[`docs/DECISIONS.md`](../DECISIONS.md), and [`docs/SECURITY.md`](../SECURITY.md).
It does **not** supersede those canonical documents — it composes them for
planning, milestone, and backlog use.

---

## 1. Executive Summary

AudioJones.com is the public platform for **AJ Digital LLC**. It is a
systems-led platform — not a generic services site — built to position
**Founder Intelligence Systems** as a category and to convert qualified
founders into structured leads through a diagnostic-first funnel.

The first product wedge into that category is **ResponseOS**: a productized
system for founder-led companies in the $250K–$5M range that operationalizes
intake, response, and qualification. ResponseOS is the entry point a visitor
buys, evaluates, or books against; the rest of the platform exists to make
that wedge legible and credible.

The site's reading experience must stay founder-readable. Strategic
complexity, architectural depth, and integration sprawl belong in the
implementation layers documented here — not in the public copy or the
diagnostic flow.

Primary conversion path: **diagnostic → qualified lead → booked call**. Every
public surface either feeds that path or earns trust for it.

---

## 2. Product Vision

### 2.1 Category frame

**Founder Intelligence Systems.** The category positions AJ Digital as the
operator that builds the *systems* a founder uses to think, respond,
qualify, and decide — not as a generic AI consulting brand. Public copy
should consistently reinforce this framing without resorting to AI-agency
clichés.

### 2.2 Product wedge

**ResponseOS** is the first system in the stack. It is concrete enough to be
sold, productized, and case-studied. It is the surface a visitor evaluates
when the diagnostic recommends a tier.

Future wedges (not yet committed) will extend the same systems frame to
other founder workflows; do not expand the public surface for them until a
decision entry exists.

### 2.3 Reading experience

Public copy is direct, founder-readable, and free of hype. Technical depth
is acceptable — performative complexity is not. The diagnostic must read
like a founder is being asked the right questions, not interrogated by a
form.

### 2.4 Strategic posture

- The platform is a marketing + diagnostic + booking system. It is **not**
  the admin/portal application, **not** a CMS-builder, **not** a multi-tenant
  SaaS, and **not** a Firebase project.
- Architecture choices favor durability of the lead and speed of iteration
  over completeness of features.

---

## 3. Product Requirement Document

This section composes the canonical [`docs/PRD.md`](../PRD.md). When in
conflict, the canonical PRD wins.

### 3.1 What this product is

The public marketing site for AJ Digital LLC — the front door to Founder
Intelligence Systems, with ResponseOS as the headline wedge. It is not the
admin/portal application. Legacy `/portal/*` and `/api/admin/*` routes are
being phased out and should not be deepened.

### 3.2 Why it exists

To convert the right-fit founder into a qualified lead through three
mechanisms:

1. **Authority content** — insights, frameworks, case studies, ROI clarity.
2. **Diagnostic** — the AI Readiness Diagnostic captures structured intent
   and routes leads to the appropriate tier.
3. **Direct booking** — the `Book a Call` CTA opens a scheduling flow for
   high-intent visitors.

Every surface should drive toward one of these three exits.

### 3.3 Audiences

| Persona                | Where they enter                   | What they need                                          |
| ---------------------- | ---------------------------------- | ------------------------------------------------------- |
| **Founders / SMB**     | Homepage, `/services`              | Proof the system fits, ROI clarity, low-risk next step  |
| **Creators**           | `/agents`, `/insights`             | A productized package they can self-evaluate            |
| **Operators / RevOps** | `/case-studies`, `/roi-calculator` | Numbers, integrations, evidence                         |
| **Returning leads**    | Diagnostic resume, email           | Frictionless re-entry to where they left off            |

### 3.4 Core flows

#### 3.4.1 Lead capture (primary)

1. Visitor lands on a marketing page.
2. CTA opens a form (`/ai-readiness-diagnostic`, contact, or inline).
3. Submission posts to `src/app/api/applied-intelligence/leads/route.ts`
   (or `src/app/api/leads/route.ts` for generic intake).
4. Server validates with Zod, rate-limits per IP, scores the lead via
   `src/lib/leads/lead-scoring.ts`, persists to NeonDB via
   `src/db/leads.ts → insertAppliedIntelligenceLead`, sends an internal
   Resend email, and optionally fires `N8N_LEAD_WEBHOOK_URL`.
5. n8n failure must not block the response. The lead must be durable in
   Neon and the email queued before the webhook fires.

#### 3.4.2 Booking

`Book a Call` links to the scheduling provider (Calendly or Cal.com,
environment-configured). The site does not host the booking surface
itself.

#### 3.4.3 Content

Long-form content (insights, blog, topic clusters) is authored in
**Sanity CMS** and rendered through App Router pages. Schema:
[`docs/sanity-blog-content-model.md`](../sanity-blog-content-model.md).

#### 3.4.4 Commerce

- **Whop** — product licensing and customer management for productized
  offerings (`/api/whop/*`).
- **Stripe** — payment processing and customer portal (`/api/stripe/*`).

The site links into checkout but does not own post-purchase fulfillment.

### 3.5 Non-goals

- Not a CMS-builder.
- Not the admin portal.
- Not a Firebase project (see [`docs/DECISIONS.md`](../DECISIONS.md)).
- Not a multi-tenant SaaS.

### 3.6 Quality bar

| Dimension       | Target                                                              |
| --------------- | ------------------------------------------------------------------- |
| Performance     | LCP < 2.5s on 4G mobile; CLS < 0.1; INP < 200ms.                    |
| Accessibility   | WCAG 2.1 AA on all marketing pages.                                 |
| SEO/AEO         | Structured data on every page; canonical URLs; sitemap.             |
| Lead durability | Zero-loss: persistence to Neon must succeed before responding 200.  |
| Security        | No secrets in repo; CSP on production; admin endpoints gated.       |
| Brand           | Matches [`docs/DESIGN.md`](../DESIGN.md) tone and tokens.           |

### 3.7 Success signals

- Diagnostic completion rate.
- Qualified lead count per week (lead score ≥ threshold).
- `Book a Call` → meeting-held conversion.
- Organic traffic growth on cluster topics.
- Time-to-publish for new insight (Sanity → live).

---

## 4. Current Project State

### 4.1 Stack (canonical)

```
Cloudflare → Vercel + Next.js 16 (App Router, React 19)
             → Sanity CMS
             → NeonDB (Postgres) — leads + structured data
             → Resend — transactional email
             → n8n — optional automation
             → Supabase — only when auth/storage/realtime is required
             → Whop — product licensing/checkout
             → Stripe — payments
             → ImageKit — media CDN
```

Firebase is intentionally excluded. `pnpm check:no-firebase` enforces this
on every CI run.

### 4.2 What is shipped

- Canonical docs hierarchy under `docs/` (PRD, DESIGN, ROADMAP, SECURITY,
  DEPLOYMENT, DECISIONS, CHANGELOG).
- `AGENTS.md` + `CLAUDE.md` as the durable agent contract.
- Firebase removed from the marketing surface; `check:no-firebase`
  guardrail in CI.
- Lead persistence on NeonDB via `applied_intelligence_leads`.
- Resend wired for internal lead notifications; n8n optional and
  best-effort.
- App Router marketing surface live on Vercel.
- Sanity CMS schema for blog content modeled.

### 4.3 What is in flight

- Applied Intelligence surface polish — migrating legacy marketing pages
  onto the canonical surface.
- Lead-capture hardening — ensuring all forms route through
  `src/app/api/applied-intelligence/leads/route.ts` and persist to Neon
  before any optional integrations fire.
- Documentation readiness bootstrap (this document is part of it).

### 4.4 What is decommissioning

- Legacy `/portal/*` and `/api/admin/*` routes that depended on Firebase
  Admin. They remain as a phase-out queue, not as a development surface.
- A typed shim (`src/lib/legacy-stubs.ts`) keeps unmigrated tooling
  type-checking until it is removed.

### 4.5 Known gaps

- No automated test suite yet (Vitest/Jest not adopted; `tests/`,
  `test/`, and `test-*.js` are integration scripts).
- No standardized analytics/BI/CRM layer (addressed in Phase 9).
- AEO/structured-data audit not complete across the canonical surface.
- Booking flow provider is not consolidated to a single source of truth.

---

## 5. Product Roadmap

The roadmap is organized into Phases 0–11. Phases are sequenced for
strategic dependency, not calendar weeks. A phase becomes "active" when it
has at least one tracked issue with an owner; otherwise it is directional.

| Phase | Title                                                |
| ----- | ---------------------------------------------------- |
| 0     | Foundations and Docs Readiness                       |
| 1     | Stack Hardening and Firebase Removal                 |
| 2     | Lead-Capture Hardening                               |
| 3     | Applied Intelligence Surface Polish                  |
| 4     | Diagnostic v1 — Linear Path                          |
| 5     | Booking Flow Consolidation                           |
| 6     | Sanity Content Cluster Expansion                     |
| 7     | AEO and Structured-Data Audit                        |
| 8     | Commerce Surface (Whop + Stripe) Hardening           |
| 9     | Founder Intelligence Stack Implementation            |
| 10    | Client Delivery and Backend Operations Alignment     |
| 11    | Launch Readiness and Governance                      |

---

## 6. Phase 0 — Foundations and Docs Readiness

**Goal:** establish a durable agent contract and a single source of truth
for product, design, deployment, and decisions.

**Status:** mostly complete (this document is the final consolidation step).

**Scope:**
- `AGENTS.md` + `CLAUDE.md` published at repo root.
- Canonical `docs/` hierarchy (PRD, DESIGN, ROADMAP, SECURITY, DEPLOYMENT,
  DECISIONS, CHANGELOG).
- Stub older root-level and duplicated docs to redirect lines pointing at
  canonical files.
- `docs/project/AUDIOJONES_PROJECT_SOURCE.md` as the consolidated planning
  source (this document).

**Done when:**
- Agents can ground themselves from `AGENTS.md` alone.
- No two docs claim ownership of the same concern.
- This source document is referenced from the README or AGENTS contract.

---

## 7. Phase 1 — Stack Hardening and Firebase Removal

**Goal:** lock the canonical stack and make Firebase reintroduction
mechanically impossible.

**Status:** complete; guardrail in CI.

**Scope:**
- `pnpm check:no-firebase` script blocks any Firebase import, package, or
  env key.
- Removal of `FIREBASE_*` and `NEXT_PUBLIC_FIREBASE_*` env keys.
- Legacy admin code paths isolated behind `src/lib/legacy-stubs.ts`.
- `docs/architecture/stack-decision.md` accepted as the canonical stack
  ADR.

**Done when:** any PR that touches the marketing surface passes
`check:no-firebase` without exception, and the decision is recorded in
`docs/DECISIONS.md`.

---

## 8. Phase 2 — Lead-Capture Hardening

**Goal:** zero-loss lead persistence on the primary diagnostic path.

**Status:** in flight.

**Scope:**
- All forms route through
  `src/app/api/applied-intelligence/leads/route.ts` (or
  `src/app/api/leads/route.ts` for generic intake).
- Zod validation, per-IP rate limiting, and lead scoring via
  `src/lib/leads/lead-scoring.ts` applied before persistence.
- Persistence to NeonDB precedes Resend email and any n8n webhook fire.
- n8n failures are logged but never short-circuit the 200 response.

**Done when:**
- A lead submitted against a degraded n8n is still durable in Neon and
  delivered to `LEAD_NOTIFICATION_EMAIL` via Resend.
- The route emits a structured log line per submission with score, tier,
  and outcome.

---

## 9. Phase 3 — Applied Intelligence Surface Polish

**Goal:** migrate the legacy marketing pages onto the canonical Applied
Intelligence surface and retire the orphaned copy paths.

**Status:** in flight.

**Scope:**
- Inventory of legacy marketing pages still serving traffic.
- One-by-one migration to the canonical surface, with redirects where
  routes change.
- Visual debt tracked in PR descriptions, not in the roadmap.

**Done when:** the only `/portal/*` and `/api/admin/*` routes remaining
are explicit phase-out candidates with sunset dates in `docs/DECISIONS.md`.

---

## 10. Phase 4 — Diagnostic v1 (Linear Path)

**Goal:** ship the production diagnostic at `/ai-readiness-diagnostic`
with a linear question path, durable persistence, and a clean lead-tier
recommendation.

**Status:** queued.

**Scope:**
- Linear question flow (no adaptive branching in v1).
- Resume-by-link for returning leads.
- Scoring routes the lead to a tier surface for follow-up.
- Internal Resend notification includes the score and tier.

**Done when:**
- A founder can complete the diagnostic, see their tier recommendation,
  and the internal email arrives with the score breakdown.
- The completion rate is measurable from the lead record (without
  needing the Phase 9 stack).

---

## 11. Phase 5 — Booking Flow Consolidation

**Goal:** a single source of truth for the `Book a Call` provider and
URL.

**Status:** queued.

**Scope:**
- One env-configured booking URL referenced by every CTA.
- Removal of ad-hoc booking links sprinkled across pages.
- Decision entry recording the provider choice (Calendly or Cal.com).

**Done when:** there is exactly one place in the codebase that resolves
the booking URL and every CTA reads from it.

---

## 12. Phase 6 — Sanity Content Cluster Expansion

**Goal:** topic clusters per persona, authored in Sanity, with
structured-data coverage.

**Status:** queued.

**Scope:**
- Cluster taxonomy for founder, creator, and operator personas.
- Schema additions tracked in
  [`docs/sanity-blog-content-model.md`](../sanity-blog-content-model.md).
- Editor workflow that surfaces missing JSON-LD before publish.

**Done when:** a new insight published in Sanity reaches production with
JSON-LD, OpenGraph, and canonical metadata intact.

---

## 13. Phase 7 — AEO and Structured-Data Audit

**Goal:** verify JSON-LD, OpenGraph, and sitemap completeness across the
canonical surface.

**Status:** queued.

**Scope:**
- Audit script for structured-data presence and shape.
- Sitemap generation pinned to the canonical surface only.
- Canonical URL discipline (one canonical per page; no surprises).

**Done when:** an automated check fails CI when a marketing page ships
without the expected JSON-LD blocks.

---

## 14. Phase 8 — Commerce Surface (Whop + Stripe) Hardening

**Goal:** keep the site's link-into-checkout role tight; do not own
fulfillment.

**Status:** queued.

**Scope:**
- Audit of `/api/whop/*` and `/api/stripe/*` routes.
- Verify the site never persists payment data beyond IDs.
- Confirm webhooks are idempotent and signature-verified.

**Done when:** payment and licensing handlers pass a security review
referencing [`docs/SECURITY.md`](../SECURITY.md).

---

## 15. Phase 9 — Founder Intelligence Stack Implementation

**Goal:** stand up the measurement, automation, and intelligence layers
that make Founder Intelligence Systems legible to the team operating
audiojones.com. This phase is the systems backbone for every prior
phase's success signals.

**Status:** queued. Baseline launch does not depend on live, secret-bound
integrations — see constraints in §22.

### 15.1 Layers

| Layer                          | Tool                       | Purpose                                                              |
| ------------------------------ | -------------------------- | -------------------------------------------------------------------- |
| UX behavior intelligence       | **Hotjar**                 | Heatmaps, session recordings, rage-click and scroll-depth signals.   |
| Product analytics              | **PostHog**                | Funnel, retention, and event-level product analytics.                |
| Search analytics               | **Google Search Console**  | Query-level organic performance and index health.                    |
| Standard analytics / ads       | **GA4**                    | Cross-channel and ad ecosystem reporting.                            |
| CRM / system of record         | **HubSpot**                | Single source of truth for leads, contacts, deals, and activity.     |
| Automation / orchestration     | **n8n**                    | Event routing, webhook glue, and ops automations.                    |
| BI dashboards                  | **Metabase**               | Founder-readable dashboards over Neon and the warehouse.             |
| Technical monitoring           | **Sentry + Better Stack**  | Errors, uptime, log aggregation, on-call alerting.                   |
| SEO / AEO intelligence         | **DataForSEO**             | Programmatic SEO/AEO signals; cluster opportunity discovery.         |
| AI conversational intake       | **Vapi or Retell AI**      | Voice/conversational intake for high-intent or off-hours leads.      |

### 15.2 Implementation order

The order is dependency-driven, not preference-driven. Earlier layers
unblock later ones; do not skip ahead.

1. **Baseline measurement.** Confirm what is already captured (server
   logs, lead records, Vercel analytics). Lock the baseline so later
   layers can be evaluated against it.
2. **UX behavior layer.** Install Hotjar with consent gating. Capture
   founder behavior on the diagnostic and the homepage hero.
3. **Product analytics layer.** Install PostHog. Define the canonical
   funnel: visit → CTA → diagnostic start → diagnostic complete → tier
   recommended → booked call.
4. **CRM system of record.** Stand up HubSpot as the single record for
   leads, contacts, and deals. Wire diagnostic submissions through it
   (via Neon → HubSpot sync, not direct).
5. **Automation layer.** Use n8n to orchestrate Neon → HubSpot,
   HubSpot → Resend digest, and routing rules. n8n stays optional and
   best-effort on the primary intake path.
6. **BI dashboard layer.** Stand up Metabase against Neon (and any
   downstream warehouse). Publish a founder-readable weekly view.
7. **Monitoring layer.** Wire Sentry for the app and Better Stack for
   uptime + log aggregation. Define the on-call alert thresholds.
8. **SEO / AEO intelligence layer.** Integrate DataForSEO for query-
   level SEO/AEO signals and cluster opportunity discovery.
9. **AI intake layer.** Pilot Vapi or Retell AI for conversational
   intake — evaluate against the same diagnostic completion and tier
   recommendation outputs.

### 15.3 Cross-cutting constraints for the stack

- No live secret-dependent integrations are required for baseline
  launch. Until secrets land in Vercel/Doppler/1Password, each layer
  ships behind a typed config flag and a mock service adapter.
- Each tool's keys live only in `.env.example` (placeholder), not in
  source.
- Each integration is implemented as a service adapter, not a direct
  call from a route handler.

### 15.4 Done when

- Each layer has either a live integration or a documented mock with a
  decision entry referencing the rollout owner.
- The founder-readable weekly Metabase view exists and answers four
  questions: diagnostic completion, qualified-lead volume, booking
  conversion, and cluster organic growth.

---

## 16. Phase 10 — Client Delivery and Backend Operations Alignment

**Goal:** align the platform with how delivery and back-office
operations actually run, so the public-facing wedge (ResponseOS) and the
private fulfillment flow stay in sync.

**Status:** queued.

**Scope:**
- Map every public surface (diagnostic, ResponseOS, booking, content)
  to the downstream delivery system it feeds.
- Confirm HubSpot deal stages match the public tier language.
- Document handoffs between site, CRM, and fulfillment in
  [`docs/architecture/`](../architecture/).
- Identify and retire any back-office processes still dependent on the
  legacy `/portal/*` surface.

**Done when:** a new diagnostic lead flows through Neon → HubSpot →
delivery without any manual reconciliation step.

---

## 17. Phase 11 — Launch Readiness and Governance

**Goal:** harden the platform for an intentional public launch and
establish the governance cadence that keeps it durable.

**Status:** queued.

**Scope:**
- Production-grade CSP and security headers verified against
  [`docs/SECURITY.md`](../SECURITY.md).
- Performance pass against the Phase 3.6 quality bar.
- Accessibility pass to WCAG 2.1 AA.
- Decision-log governance: every architectural change has a
  `docs/DECISIONS.md` entry.
- Changelog governance: every release promotes the `Unreleased` section.
- On-call rotation defined for the monitoring layer.

**Done when:** a launch checklist runs green end-to-end and the
governance cadence has owners by name.

---

## 18. Completed Work Summary

- Canonical docs hierarchy under `docs/` established.
- `AGENTS.md` and `CLAUDE.md` published as the durable agent contract.
- Firebase removed from the marketing surface; `pnpm check:no-firebase`
  enforced in CI.
- Lead persistence on NeonDB via `applied_intelligence_leads`.
- Resend wired for internal lead notifications.
- n8n positioned as optional, best-effort orchestration only.
- App Router marketing surface live on Vercel.
- Sanity CMS schema for blog content modeled.
- Older root-level and duplicate docs stubbed to redirect lines without
  deletion.

---

## 19. Remaining Work Summary

- Complete migration of legacy marketing pages onto the canonical
  Applied Intelligence surface.
- Ship Diagnostic v1 (linear path) at `/ai-readiness-diagnostic`.
- Consolidate the `Book a Call` provider to a single source.
- Expand Sanity content clusters per persona.
- Complete AEO and structured-data audit across the canonical surface.
- Harden the commerce surface (Whop + Stripe) per security review.
- Stand up the Founder Intelligence Stack (Phase 9).
- Align client delivery and backend operations (Phase 10).
- Run launch readiness and establish governance cadence (Phase 11).

---

## 20. Recommended GitHub Milestones

| Milestone                                       | Maps to       |
| ----------------------------------------------- | ------------- |
| `M0 — Docs readiness`                           | Phase 0       |
| `M1 — Stack hardening`                          | Phase 1       |
| `M2 — Lead-capture hardening`                   | Phase 2       |
| `M3 — Applied Intelligence surface`             | Phase 3       |
| `M4 — Diagnostic v1`                            | Phase 4       |
| `M5 — Booking consolidation`                    | Phase 5       |
| `M6 — Sanity content clusters`                  | Phase 6       |
| `M7 — AEO and structured-data audit`            | Phase 7       |
| `M8 — Commerce surface hardening`               | Phase 8       |
| `M9 — Founder Intelligence Stack`               | Phase 9       |
| `M10 — Delivery and backend ops alignment`      | Phase 10      |
| `M11 — Launch readiness and governance`         | Phase 11      |

Each milestone should carry at least one tracked issue per phase scope
bullet before it is considered "active".

---

## 21. Task Backlog

Backlog items are grouped by phase. Items become tracked issues when an
owner is assigned. Items without an owner are directional.

### Phase 0 — Foundations and Docs Readiness
- Confirm `docs/project/AUDIOJONES_PROJECT_SOURCE.md` is referenced from
  `AGENTS.md` or `README.md`.
- Audit redirect stubs for completeness.

### Phase 1 — Stack Hardening and Firebase Removal
- Periodic review of `pnpm check:no-firebase` coverage as new packages
  land.

### Phase 2 — Lead-Capture Hardening
- Verify Zod schema parity between the diagnostic form and the route
  handler.
- Add structured logging line emitting `{score, tier, outcome}` per
  submission.
- Confirm rate-limit headers and `Retry-After` semantics on 429s.

### Phase 3 — Applied Intelligence Surface Polish
- Inventory legacy marketing pages still serving traffic.
- Migrate page-by-page with redirects.
- Track visual debt per PR, not in this backlog.

### Phase 4 — Diagnostic v1 (Linear Path)
- Finalize question set and scoring rubric.
- Implement resume-by-link.
- Wire tier recommendation copy.

### Phase 5 — Booking Flow Consolidation
- Choose Calendly or Cal.com and record in `docs/DECISIONS.md`.
- Refactor every CTA to read the booking URL from one helper.

### Phase 6 — Sanity Content Cluster Expansion
- Cluster taxonomy per persona.
- Author the first three insights per cluster.

### Phase 7 — AEO and Structured-Data Audit
- Build the audit script.
- Add a CI check that fails on missing JSON-LD blocks.

### Phase 8 — Commerce Surface Hardening
- Audit `/api/whop/*` and `/api/stripe/*` for signature verification and
  idempotency.

### Phase 9 — Founder Intelligence Stack
- Baseline measurement snapshot (server logs, lead records, Vercel
  analytics).
- Hotjar install with consent gating.
- PostHog install and canonical funnel definition.
- HubSpot system-of-record setup; Neon → HubSpot sync (via n8n).
- n8n orchestration playbooks for routing and digests.
- Metabase install pointed at Neon.
- Sentry + Better Stack wiring and on-call thresholds.
- DataForSEO integration for SEO/AEO signals.
- Vapi or Retell AI pilot for conversational intake.

### Phase 10 — Client Delivery and Backend Ops Alignment
- Map public surfaces to delivery systems.
- Align HubSpot deal stages with public tier language.
- Retire back-office processes still tied to `/portal/*`.

### Phase 11 — Launch Readiness and Governance
- Run the launch checklist.
- Define on-call rotation.
- Confirm decision-log and changelog governance cadence has owners.

---

## 22. Risk Register

| Risk                                                                                  | Severity | Mitigation                                                                                          |
| ------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| Firebase reintroduction via transitive dependency.                                    | High     | `pnpm check:no-firebase` in CI; decision log entry; agent contract enforcement.                     |
| Lead loss due to downstream integration failure.                                      | High     | Persist to Neon before any optional integration fires; n8n stays best-effort.                       |
| Public copy drifts into AI-agency clichés.                                            | Medium   | `docs/DESIGN.md` tone contract; AGENTS.md tone rule; review guard during PR.                        |
| Secret leakage in repo or `.env.example`.                                             | High     | Secrets only in Vercel/Doppler/1Password; `.env.example` carries placeholders; security checklist.  |
| Phase 9 stack rushed before baseline measurement.                                     | Medium   | Phase 9 implementation order locks baseline as step 1; mocks acceptable until secrets land.         |
| Scope creep into admin/portal CRUD.                                                   | Medium   | Non-goals in PRD; legacy `/portal/*` flagged for sunset.                                            |
| AEO regressions when content clusters expand.                                         | Medium   | Phase 7 CI check; Sanity editor workflow surfaces missing JSON-LD.                                  |
| Booking-flow drift across CTAs.                                                       | Low      | Phase 5 single-source helper; decision-log entry.                                                   |
| Vendor lock-in on a Phase 9 tool.                                                     | Low      | All Phase 9 integrations are service adapters; swap surface is one file per layer.                  |

---

## 23. Open Questions

- Which booking provider becomes the single source: Calendly or Cal.com?
- Does ResponseOS need a dedicated public page in the first launch, or
  does it remain a tier recommendation surfaced by the diagnostic?
- For Phase 9, do we pilot Vapi or Retell AI first, and under what
  qualifying criteria?
- What is the threshold lead score for `qualified` in the public
  success-signal dashboard?
- When (and on what trigger) is the legacy `/portal/*` sunset committed?
- Does Metabase point directly at Neon, or do we introduce a warehouse
  step before Phase 11?

Open questions should become decision-log entries the moment they are
answered, not before.

---

## 24. Recommended Immediate Next Actions

1. Reference this document from `AGENTS.md` or `README.md` so future
   agents discover it.
2. Land the Diagnostic v1 (Phase 4) scope as tracked issues against
   `M4 — Diagnostic v1`.
3. Open the booking-provider decision (Phase 5) in `docs/DECISIONS.md`
   so Phase 5 can start.
4. Snapshot the Phase 9 baseline measurement now — before any analytics
   tool is installed — so later evaluation has a reference.
5. Confirm `.env.example` carries placeholder keys for every Phase 9
   tool and that none of them are required for `pnpm build` to pass.

---

## 25. Definition of Done

A phase is **done** when all of the following are true:

1. Every scope bullet is either delivered or recorded as a decision
   (deferred / dropped) in `docs/DECISIONS.md`.
2. The validation contract from
   [`CLAUDE.md`](../../CLAUDE.md#validation-contract) passes:
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm check:no-firebase
   pnpm build
   ```
3. The PR descriptions for the phase explicitly state what was
   intentionally **not** changed.
4. The relevant section of `docs/CHANGELOG.md` is updated under
   `Unreleased` (or promoted, on a release).
5. For phases that introduce integrations: a service adapter exists,
   `.env.example` is updated, and no secret values appear in the repo.
6. For phases that change routes: a redirect plan is in place and
   recorded in `docs/DECISIONS.md`.

---

## 26. Strategic Decision

The strategic frame for audiojones.com is settled and load-bearing:

- **Category:** Founder Intelligence Systems.
- **Wedge:** ResponseOS.
- **Primary conversion path:** diagnostic → qualified lead → booked
  call.
- **Reading experience:** founder-readable; complexity stays in
  architecture, not in copy.
- **Stack guardrails:** no Firebase; no hardcoded secrets; no live
  secret-dependent integrations on the baseline launch path; mocks and
  typed config until secrets land.

Any future work that conflicts with this strategic frame should be
escalated to a decision-log entry before code is written, not after.
