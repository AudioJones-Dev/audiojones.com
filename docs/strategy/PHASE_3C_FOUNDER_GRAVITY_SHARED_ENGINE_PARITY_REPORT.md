---
title: "Phase 3C — Founder Gravity Shared Engine Parity Report"
status: report (read-only analysis)
version: v1.0
date: 2026-06-18
owner: AJ Digital LLC
scope: documentation only — no code changed
inputs: src/lib/founder-gravity-audit/*, src/lib/roi-calculator/*, src/lib/leads/*, src/db/*, the three diagnostic UIs + API routes
feeds: Phase 4 — Shared Diagnostic Runtime Expansion
---

# Phase 3C — Founder Gravity Shared Engine Parity Report

> **Goal.** Establish whether the three diagnostics — **Founder Gravity**,
> **AI Readiness**, **Revenue Leak** — can become three entry points into
> **one** engine, using the Founder Gravity Audit as the reference spine,
> and define exactly what parity gaps Phase 4 must close. **Read-only: no
> code changed.**

---

## 1. Executive Summary

**There is no shared engine today. There are three.** Founder Gravity, the
Founder Intelligence Diagnostic (which `/ai-readiness-diagnostic` forwards
into), and the ROI Calculator (Revenue Leak) are **parallel silos** — each
with its own types, Zod schema, scoring, persistence table, and
notification path. They share *patterns* (Zod-validated POST routes,
honeypot + rate-limit, Neon persistence, Resend + optional n8n) but **zero
shared code**.

**Founder Gravity is the only one that is actually an "engine."** It has a
real content model (typed questions with roles/stages/layers/weights), a
multi-input scoring pipeline, confidence + contradiction + **suppression**
gating, segment classification, session/draft resume, a structured event
funnel, and a generated report. It is the correct spine for the shared
runtime.

**The other two are each missing different halves of parity:**
- **Revenue Leak (ROI)** is a strong *deterministic calculator* with a
  customer-facing result and a client email — but no content model, no
  session/draft, no segment/classification, no CRM webhook, and **no DB
  migration** for its table.
- **AI Readiness / Founder Intelligence Diagnostic** computes a 4-part
  lead score server-side but **shows the user nothing** (same thank-you for
  every lead), has no content model (hardcoded steps), and no session/draft.
  Its marketed "Signal Score" and "tiered outputs" do not exist as a
  user-visible result.

**Verdict:** parity is achievable and the report *is* quick — because the
spine already exists. Phase 4 is mostly **promotion + adaptation**, not
greenfield: lift Founder Gravity's engine into a parameterized
`DiagnosticDefinition` runtime, then re-seat the other two as configs behind
it, unifying three lead tables and three notification paths into one.

**Parity readiness score: the shared engine is ~60% pre-built inside
Founder Gravity** (flow, scoring architecture, persistence shape,
notification dispatch). The remaining ~40% is the abstraction surface
(config type, generic runtime, unified table) plus two capabilities only
the *other* engines have (ROI's server-side recompute verification + client
result email).

---

## 2. The three diagnostics at a glance

| | **Founder Gravity** | **AI Readiness → Founder Intelligence Diagnostic** | **Revenue Leak (ROI Calculator)** |
|---|---|---|---|
| Entry route | `/founder-gravity-audit` | `/ai-readiness-diagnostic` → `/founder-intelligence/diagnostic` | `/roi-calculator` |
| What it is | Layered behavioral diagnostic | Multi-step qualification form | Deterministic financial calculator |
| Content model | **Typed questions** (23) in `content.ts` | Hardcoded 6 steps + schema constants | Flat 34-field input type |
| Customer-facing result | **Full report** (segment + layers + CTA) | **None** (static thank-you) | **In-page result** + client email |
| Internal score | gravityLoad + segment + confidence | icpFit/signal/aiReadiness/attribution → priority | 5 levers + readiness + priority + recommendation |
| Session/draft resume | **Yes** (localStorage) | No | No |
| Persistence table | `founder_gravity_audit_leads` (migration 002) | `applied_intelligence_leads` (migration 001) | `roi_calculator_leads` (**no migration**) |
| Notifications | Resend + **n8n (suppression-gated)** | Resend + n8n (fire-and-forget) | **Dual Resend** (agency + client) + status cols |
| API route | `/api/founder-gravity-audit/leads` | `/api/founder-intelligence/leads` | `/api/roi-calculator/lead` |

---

## 3. Reference engine — why Founder Gravity is the spine

Founder Gravity is the only diagnostic with all of the parts a shared engine
needs, already separated into composable modules:

- **Content model** (`lib/founder-gravity-audit/content.ts`, `types.ts`):
  `FounderGravityQuestion[]` with `role` (firmographic / self_perception /
  layer_item / scenario), `stage`, `layer`, `weight`, and options carrying
  `score`, `layerScores`, and `fragilityZone`. Questions are **data**, not
  JSX.
- **Scoring pipeline** (`scoring.ts`): `scoreFounderGravityAudit(answers,
  opts)` fuses three computed inputs —
  `gravityLoad = clamp(layerAverage·0.68 + scenarioAverage·0.22 +
  claimedDependency·0.10)` — then derives `contradictionScore`,
  `confidenceScore`, `segment` (Orbit / High Pull / Drift / Stabilizing /
  Distributed), `topLayers`, `topFragilityZone`, and a segment-routed `cta`.
- **Suppression** (unique): consent-withdrawn / low-confidence (<65) /
  speedrun (<90s) / self-perception-noise (contradiction ≥42). No other
  diagnostic has lead-quality gating.
- **Flow** (`FounderGravityAuditFlow.tsx`): session id, localStorage draft
  resume, skip handling, a 7-event funnel (`diagnostic_started` →
  `report_viewed`) pushed to `dataLayer` + CustomEvent.
- **Persistence** (`db/founder-gravity-audit-leads.ts`): relational derived
  columns **plus** JSONB `answers`/`result`/`attribution`/`events`; IP
  hashing.
- **Notifications** (`notifications.ts`): `Promise.allSettled([email,
  webhook])`, webhook **gated on `suppression.suppressed === false`**, rich
  CRM payload (asset / record_type / gtm_motion / routing / suppression).
- **Report** (`FounderGravityReport.tsx`): rehydrates from sessionStorage,
  renders layer concentration, operational exposure, and a
  resonance-zone-justified CTA.

Everything below measures the other two against this spine.

---

## 4. Parity matrix

Legend: ✅ present & strong · 🟡 present but bespoke/partial · ❌ absent

| Dimension | Founder Gravity | FI Diagnostic (AI Readiness) | ROI (Revenue Leak) | Shared-engine target |
|---|:--:|:--:|:--:|---|
| Typed content/question model | ✅ | ❌ (hardcoded steps) | ❌ (flat field type) | **Promote FG model** |
| Config-driven flow | 🟡 (FG-specific) | ❌ | ❌ | Build `useDiagnosticFlow(def)` |
| Session id + draft resume | ✅ | ❌ | ❌ | **Promote FG flow** |
| Structured event funnel | ✅ (7 events) | 🟡 (UTM only) | 🟡 (UTM only) | **Promote FG events** |
| Scoring pipeline | ✅ (multi-input + classify) | 🟡 (4-component weighted) | ✅ (deterministic levers) | Parameterize all three |
| Confidence / suppression gating | ✅ | ❌ | 🟡 (confidence tier only) | **Promote FG suppression** |
| Server-side recompute verification | ❌ | ❌ | ✅ | **Promote ROI verification** |
| Customer-facing result/report | ✅ (report) | ❌ (none) | ✅ (in-page + email) | Generic report renderer |
| Client result email | ❌ | ❌ | ✅ | **Promote ROI client email** |
| Relational score columns (analytics) | 🟡 (some) | ✅ (full + enums) | ❌ | Adopt FI's status/priority enums |
| Persistence table | ✅ (migrated) | ✅ (migrated) | ❌ (**no migration**) | Unify to one table/API |
| Zod schema + honeypot + rate limit | ✅ | ✅ | ✅ | Generic route factory |
| Notifications (email + webhook) | ✅ (gated) | 🟡 (fire-and-forget) | 🟡 (no webhook) | Unified dispatcher + templates |

**Reading the matrix:** no single engine is a superset. Founder Gravity owns
8 of 13 rows; ROI uniquely owns **recompute verification** and **client
email**; FI uniquely owns **full relational score columns + status/priority
enums**. The shared engine is "Founder Gravity's spine + ROI's two verified
output behaviours + FI's analytics columns."

---

## 5. Parity gaps — what each engine is missing

### 5.1 AI Readiness / Founder Intelligence Diagnostic
- ❌ **No content model** — 6 steps and ~30 fields are hardcoded JSX in a
  ~635-line component; choices live as loose constants in `lead-schema.ts`.
- ❌ **No customer-facing output** — API returns `priority`/`totalScore`,
  but the thank-you page shows the same copy to everyone. The marketed
  **"Signal Score"** and **"tiered outputs (nurture / audit / build /
  consult)"** are narrative only; nothing computes or displays them.
- ❌ **No session/draft** — closing the browser mid-flow loses everything.
- ❌ **No suppression/confidence** — every submission scores and notifies.

### 5.2 Revenue Leak (ROI Calculator)
- ❌ **No DB migration** — code targets `roi_calculator_leads`, but only
  migrations `001`/`002` exist. This is live infra debt (the table is
  assumed to exist out-of-band).
- ❌ **No segment/classification** — produces a recommendation
  (Automate Now / Pilot First / Diagnose) but not a persona segment the way
  FG produces Orbit/Drift/etc.
- ❌ **No CRM webhook** — agency + client emails only; nothing reaches n8n.
- ❌ **No session/draft**; no structured event funnel beyond UTM.

### 5.3 Founder Gravity (the spine still has two gaps)
- ❌ **No server-side recompute verification** — trusts client-submitted
  context; ROI re-runs the calculator server-side and rejects mismatches.
- ❌ **No client result email** — the report is sessionStorage-only; a
  cleared session loses it. ROI emails the result to the lead.

---

## 6. Duplicated patterns = consolidation targets

These are implemented **three times** with cosmetic differences; the shared
runtime collapses each into one:

1. **POST lead route**: validate (Zod) → honeypot → rate-limit → score →
   persist → notify. Three near-identical handlers → one **route factory**
   `createDiagnosticLeadRoute(definition)`.
2. **Persistence**: three `*_leads` tables + three `insert*`/`persist*`
   pairs + three IP-hash helpers → one `diagnostic_leads` table (or one
   `insertDiagnosticLead(type, …)`).
3. **Notifications**: three `notify*` modules each doing
   `Promise.allSettled([resendEmail, n8nWebhook])` with a hand-rolled HTML
   table → one dispatcher + per-type templates.
4. **Honeypot**: `website_url` (FG/FI) vs `hp` (ROI) — two field names for
   one concept → standardize.
5. **Attribution/UTM capture**: re-implemented in all three flows.

---

## 7. The shared-engine abstraction surface (Phase 4 seed)

The minimum API to unify all three, derived directly from Founder Gravity:

```ts
type DiagnosticDefinition = {
  id: "founder-gravity" | "ai-readiness" | "revenue-leak";
  questions: DiagnosticQuestion[];          // promote FG content model
  scoring: {
    inputs: { name: string; compute(answers): number }[];
    fusion: { weights: Record<string, number> };   // e.g. FG 0.68/0.22/0.10
    classify(score, derived): Segment;        // FG segment / ROI recommendation
    suppression?: SuppressionRule[];          // promote FG suppression
    verify?: "recompute";                     // promote ROI server recompute
  };
  persistence: { table: "diagnostic_leads"; type: string };
  notifications: { emailTemplate; webhook?: boolean; clientEmail?: boolean };
  output: { report?: ReportSpec; clientEmail?: boolean };
  ctaMap: Record<Segment, DiagnosticCta>;
};
```

Generic building blocks to build once and reuse:
- `useDiagnosticFlow(definition)` — promote FG's session/draft/event funnel.
- `runScoring(definition, answers)` — parameterized FG pipeline (+ ROI
  recompute, + FI weighted components as another `inputs` shape).
- `createDiagnosticLeadRoute(definition)` — the route factory.
- `<DiagnosticReport definition result />` — generic renderer (FG report as
  the default layout).
- One `diagnostic_leads` table with a `diagnostic_type` discriminator,
  JSONB `answers`/`result`, common derived columns, and FI's
  `status`/`priority` enums for analytics.

---

## 8. Data-model unification

Three tables, three shapes today:
- `applied_intelligence_leads` — fully **relational** columns + score
  columns + `lead_status`/`lead_priority` enums (best analytics shape).
- `founder_gravity_audit_leads` — relational derived columns **+ JSONB**
  `answers`/`result`/`attribution`/`events` (best flexibility shape).
- `roi_calculator_leads` — JSON `input`/`result` + email-status columns
  (**unmigrated**).

**Target:** one `diagnostic_leads` table = FG's JSONB flexibility + FI's
enum/analytics columns + ROI's email-status columns + a `diagnostic_type`
discriminator. Migrate the three behind one insert API (strangler pattern:
new table written in parallel first, old tables read-compatible until
backfilled).

---

## 9. Risks

1. **Execution drift** (the stated #1 risk): three live, diverging code
   paths make it tempting to "just add a fourth." Freeze new diagnostics
   until the engine carries **two** live (the roadmap's correct guardrail).
2. **`roi_calculator_leads` has no migration** — resolve before unification
   or data is at risk.
3. **Output-expectation gap** — FI markets a "Signal Score"/tiers it never
   shows. The shared engine should make customer-facing output a
   first-class, non-optional capability so marketing and product agree.
4. **Suppression divergence** — only FG gates lead quality; unifying
   notifications must not accidentally start emitting suppressed/low-quality
   leads from the other two.
5. **Scoring-shape mismatch** — FG (input-fusion + classifier) vs FI
   (weighted components) vs ROI (deterministic formulas) are three scoring
   *shapes*. The `inputs[]` + `fusion` + `classify` abstraction must be
   general enough to express all three without forcing FG's layer model onto
   ROI's financials.

---

## 10. Recommended sequence (maps to the approved roadmap)

1. **Phase 3C parity report** — *this document.* ✅
2. **Define + stage Phase 3A/3B together** — none exist in the repo yet, so
   3A/3B = author the `DiagnosticDefinition` type + the generic runtime
   (`useDiagnosticFlow`, `runScoring`, route factory) + the unified
   `diagnostic_leads` migration, extracted from Founder Gravity. Land them
   as one reviewable unit so the adapter and its schema move together.
3. **Merge the diagnostic adapter** — wrap Founder Gravity itself behind the
   new runtime first (it already matches), proving the abstraction against
   the engine it came from with zero behavior change.
4. **AI Readiness as the first shared-engine entry point** — lowest risk: it
   has *no* engine of its own today (just forwards to the FI form), so
   rebuilding it as a `DiagnosticDefinition` config adds the missing
   content model, session/draft, and a real customer-facing Signal Score
   without breaking an existing engine.
5. **Revenue Leak as the ResponseOS-aligned shared-engine entry** — re-seat
   the ROI calculator as a diagnostic instance whose output routes into
   **AI Receptionist Systems / ResponseOS** (revenue-recovery), promoting
   its server-side recompute verification and client-result email into the
   shared runtime as it lands.
6. **Defer Tool Sprawl** until the engine carries two live diagnostics.

---

## Keep / Promote / Refactor / Build

**✅ Keep (the spine, unchanged behavior)**
- Founder Gravity's content model, scoring pipeline, suppression rules,
  segment routing, session/draft flow, event funnel, and report.

**⬆️ Promote to shared (lift FG/ROI strengths into the runtime)**
- FG flow (session/draft/events) → generic `useDiagnosticFlow`.
- FG scoring architecture + suppression → parameterized `runScoring`.
- FG report → generic `<DiagnosticReport>`.
- **ROI's server-side recompute verification** and **client result email**.
- **FI's `status`/`priority` enums** for lead analytics.

**🔧 Refactor (re-seat behind the runtime)**
- AI Readiness / FI Diagnostic → `DiagnosticDefinition` config (gain content
  model, draft, visible output).
- ROI Calculator → `DiagnosticDefinition` config routed to ResponseOS.
- Three `*_leads` tables → one `diagnostic_leads` (+ add the missing ROI
  migration en route).
- Three notify modules + three POST routes → one dispatcher + one route
  factory.

**🏗️ Build (the ~40% that doesn't exist yet)**
- `DiagnosticDefinition` type + registry.
- Generic runtime: `useDiagnosticFlow`, `runScoring`,
  `createDiagnosticLeadRoute`, `<DiagnosticReport>`.
- `diagnostic_leads` unified table + insert API.

---

*Phase 3C is analysis only. Phase 4 — Shared Diagnostic Runtime Expansion —
implements steps 2–6 above as separate scoped PRs, starting with the
`DiagnosticDefinition` + runtime extracted from Founder Gravity.*
