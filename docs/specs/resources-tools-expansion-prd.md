# PRD — Resources & Tools Expansion

**Status:** RATIFIED IN PART — Waves 0 and 1 authorized 2026-09-09. Waves 2–3
remain gated on Q-2 and Q-3.
**Date:** 2026-09-09
**Branch:** `claude/site-resources-tools-expansion-3e85d2`
**Copy status:** the Wave 0 hub copy and the tool naming are ratified (see §4.3
and §11). Wave 2–3 copy remains DRAFT and requires Tyrone's approval before it
ships — brand voice is RECOMMEND_ONLY.

---

## 1. Findings from inspecting the current implementation

These change the proposed plan and must be settled before build order is fixed.

| # | Finding | Evidence | Consequence |
|---|---------|----------|-------------|
| F1 | **The AI ROI Calculator already exists** as `/roi-calculator`. It models workflow bottleneck, task frequency, speed-to-lead lift, error cost, owner-hour recovery, and headcount avoidance; returns monthly/annual savings, payback months, readiness score, priority score, confidence tier, and a recommendation. | `src/lib/roi-calculator/{types,calculations}.ts` | Build item #3 is a **rename + workflow presets + assumption disclosure**, not a new build. Re-sequence. |
| F2 | **A complete calculator reference pattern exists.** zod schema → pure calc fn → API route that re-runs the calc server-side and rejects client/server mismatch → Neon persistence with SHA-256 hashed email+IP → dual email (agency + client) via `after()` → in-memory rate limit + honeypot. | `src/app/api/roi-calculator/lead/route.ts` | New calculators clone this spine — it is the most complete of the three. |
| F2b | **Three parallel lead-capture stacks already exist**, none shared: generic `api/leads` (with `lead-scoring.ts`, `lead-storage.ts`), `roi-calculator` (own Neon storage), and `founder-gravity-audit` (own schema, scoring, storage, notifications). FGA uses neither the generic store nor the Neon path. | `src/app/api/{leads,roi-calculator/lead,founder-gravity-audit/leads}/route.ts` | The codebase **precedent is per-tool, not shared**. Q-4's "shared table" is therefore a consolidation proposal, not the status quo — priced accordingly. |
| F3 | **Assumptions are currently hidden.** `automationCapture = 0.42 × frequencyMultiplier[taskFrequency]` is a hardcoded constant that drives the headline savings number, invisible to the user. | `src/lib/roi-calculator/calculations.ts:16` | The "expose assumptions / label as estimate" rule must apply **retroactively** to the shipped tool, not only to the new SEO calculator. |
| F4 | **`/ai-readiness-diagnostic` is a marketing landing page, not an instrument.** Its CTA routes to `/founder-intelligence/diagnostic`, which exists as a real route. It is also the header's secondary CTA. | `src/app/ai-readiness-diagnostic/page.tsx`, `src/app/founder-intelligence/diagnostic/`, `src/config/nav.ts` | Under "Diagnostics", decide whether the hub links the landing page or the instrument. |
| F5 | **Founder Gravity Audit is a real 3-step diagnostic** (landing → diagnostic → report) and is **absent from the proposed architecture** and from the `/resources` hub. | `src/app/founder-gravity-audit/{,diagnostic,report}/` | Either add it under Diagnostics or record an explicit decision to retire/hide it. Open question. |
| F6 | **There is no client-side analytics at all.** Verified: no analytics package in `package.json` (no `@vercel/analytics`, PostHog, Plausible, GA4), nothing instrumented in `layout.tsx`. `src/lib/analytics/` is server-side engines only. | `package.json`, `src/app/layout.tsx`, `src/lib/analytics/` | "Analytics events" is a **net-new capability**, not wiring. A provider must be installed first (§7). |
| F9 | **Nav has a single source of truth**: `src/config/nav.ts` exports `mainNav` (consumed by both Header and Footer) and `headerCtas`. Resources is already in `mainNav`; its description still reads "…and the ROI calculator". | `src/config/nav.ts`, `src/components/{Header,Footer}.tsx` | Wave 0 edits **one file** for both header and footer. The Resources nav description needs updating to match the new IA. |
| F7 | **A canonical offer registry exists** — 10 offers, each `evidenceStatus: 'unratified'`, with a public projection allowlist. | `src/content/offers.ts`, `src/lib/offers/public-view.ts` | Offer-routing must reference registry **IDs**, not free-text offer names. |
| F8 | **The `/resources` hub omits both diagnostics.** `RESOURCES` lists 6 items; AI Readiness appears only as a theme link, Founder Gravity Audit not at all. Sitemap already covers all three tools; Footer links none of them. | `src/app/resources/page.tsx`, `src/app/sitemap.ts`, `src/components/Footer.tsx` | Discoverability gap is real and cheap to close. |

---

## 2. Scope

**In scope:** the `/resources` hub restructure (Diagnostics vs Calculators),
one new calculator (SEO ROI), one new estimator (Website Project), the rename
and assumption-disclosure pass on the existing ROI calculator, lead capture and
result storage for each, and offer-routing rules.

**Out of scope:** rebuilding the AI Readiness Diagnostic instrument; changing
commercial pricing (DECISIONS.md is the register of record); any Firebase
reintroduction (`pnpm check:no-firebase` is the bright line).

---

## 3. Information architecture

```text
/resources                     Tools for better business decisions
├── Diagnostics                identify problems
│   ├── AI Readiness Diagnostic          /ai-readiness-diagnostic
│   └── Founder Gravity Audit  [OPEN Q]  /founder-gravity-audit
└── Calculators                estimate cost or economic value
    ├── Website Project Estimator                 (NEW — route per D-1)
    ├── SEO ROI Calculator                        (NEW — route per D-1)
    └── Operational Waste Recovery Calculator     /roi-calculator   (EXISTS)
```

**Route decision — D-1 (DECIDED, execution layer).** New tools sit at root:
`/seo-roi-calculator` and `/website-project-estimator`. Rejected `/tools/*`
because it would either strand `/roi-calculator` in a different namespace or
force a 301 on the site's highest-priority tool URL (sitemap priority 0.9) for
cosmetic tidiness. Flat matches every existing tool route. Reversible later
behind redirects if the tool count grows.

The hub renders from a single `TOOLS` registry array rather than a third
hardcoded list, so hub, footer, and sitemap read one source.

---

## 4. Calculator formulas

### 4.1 SEO ROI Calculator — scenario model

Conversion chain, every stage user-visible and user-editable:

```
monthly searches × target-position CTR × conversion rate × close rate
  = new customers/mo
new customers/mo × average customer value  = incremental monthly revenue
incremental monthly revenue − monthly retainer = net monthly gain
break-even months = cumulative investment ÷ net monthly gain
```

- CTR defaults keyed to target position; **shown and overridable**, sourced and
  dated in the UI. Source to be ratified.
- Ramp curve: organic gains are not immediate. Model a ramp (e.g. months 1–3 at
  0%, 4–6 at 40%, 7–12 at 100%) rather than day-one full effect.
  **OPEN Q-2:** ratify the ramp shape.
- Output: traffic, leads, revenue, break-even month, 12-month cumulative.

### 4.2 Website Project Estimator — configuration, not ROI

Additive scope model. No return is projected or implied.

```
base tier (by page count + template vs custom)
  + strategy/discovery
  + copywriting (per page)
  + integrations (each)
  + SEO/analytics foundation
  + e-commerce / booking / portal modules
  = investment RANGE (low–high band, never a point estimate)
timeline = f(scope points, module count)
```

Output: project tier, timeline band, investment range. **Never** a savings or
ROI figure.

**OPEN Q-3:** price bands must reconcile with `docs/DECISIONS.md`, the register
of record for commercial pricing. Bands cannot be invented here.

### 4.3 Operational Waste Recovery Calculator — retrofit existing

*(Referred to as "AI ROI Calculator" in the original brief; renamed to match
the live page — see the naming resolution below.)*

**Status: items 1, 3 and 4 shipped. Item 2 deferred — presets need per-workflow
capture rates that would have to be invented, which is the exact false-precision
failure this PRD exists to prevent.**

> **Naming — RESOLVED 2026-09-09.** The live page is titled "Operational Waste
> Recovery Calculator" and its H1 is *"We don't calculate AI hype. We calculate
> operational waste recovery."* — a positioning line aimed deliberately
> **against** AI-ROI framing. Rather than rename the page and retire that line,
> **the hub card was renamed to match the page.** The tool is
> "Operational Waste Recovery Calculator" everywhere; "AI ROI Calculator" from
> the original brief is retired as a surface label. The page keeps its title,
> its H1, and its voice untouched.

1. ~~Rename surface copy to "AI ROI Calculator"~~ — **reversed.** The registry
   entry now matches the page (`id: operational-waste-recovery-calculator`).
   Route unchanged.
2. Replace free-text `workflowType` with a **named workflow selector**:
   missed-call recovery · lead follow-up · client intake · reporting ·
   admin/back-office · other. Each preset seeds defaults for hours, frequency,
   and capture rate.
3. **Surface the capture assumption.** The `0.42 × frequency` constant becomes a
   visible, labeled, per-preset, overridable input.
4. Add the estimate disclaimer (§8).

---

## 5. Lead capture

Every tool clones the `roi-calculator` spine — no second architecture:

1. Zod schema in `src/lib/<tool>/<tool>-schema.ts`.
2. Pure calculation fn, importable by both client and server.
3. `POST /api/<tool>/lead` that **recomputes server-side and rejects mismatch**,
   honeypot-drops bots, rate-limits per `ipHash:emailHash`, caps payload bytes.
4. Result shown **before** the email gate — the tool must be useful without a
   call (funnel requirement 1). Email gates only the saved/emailed summary.
5. `after()` for the client email so serverless suspension cannot drop it.

---

## 6. Result storage

Neon Postgres, mirroring `persistRoiCalculatorLead`. Each row stores:
`leadId`, `tool`, hashed email, hashed IP, user agent, UTM set, timestamps,
email delivery status, **the full input object**, **the full result object**,
and **an `assumptions` snapshot** (CTR table, ramp curve, capture rate, and any
user overrides) so a result is reproducible later — funnel requirement 4.

**D-2 (DECIDED, execution layer).** One shared `tool_submissions` table with a
`tool` discriminator plus JSONB `input`, `result`, and `assumptions` columns.
Per F2b the existing precedent is per-tool, and three parallel stacks is exactly
the cost being avoided: a fourth and fifth would mean five migrations, five
admin views, and no cross-tool lead scoring. New tools adopt the shared table;
**existing tools are not migrated** — that is a separate, larger change and is
out of scope here.

---

## 7. Analytics events

Per F6 there is no analytics provider installed at all — this is a net-new
dependency, not a wiring task.

**D-3 (DECIDED, execution layer).** Install `@vercel/analytics` and emit the
events below via `track()`. Rationale: the site already deploys on Vercel, so it
adds no new vendor, no new contract, and no cookie-consent change (it is
cookieless) — which matters given the site ships a `CookieBanner`. PostHog would
give richer per-user funnel replay but adds a vendor, a consent question, and a
cost line; it is the right upgrade *if* per-visitor funnel attribution later
becomes a requirement, and the event names below are provider-agnostic so that
swap stays cheap.

**Flagging for your awareness:** installing any analytics provider is a
client-facing data-collection change. If you would rather that be your call
than mine, say so and I will hold D-3.

Event spec, provider-agnostic:

| Event | When | Properties |
|---|---|---|
| `tool_view` | tool page mount | `tool` |
| `tool_start` | first input changed | `tool` |
| `tool_step` | step advanced | `tool`, `step` |
| `tool_result_viewed` | result rendered | `tool`, `resultTier`, `assumptionsOverridden` |
| `tool_lead_submitted` | 200 from lead route | `tool`, `leadId` |
| `tool_offer_clicked` | routed CTA clicked | `tool`, `offerId` |
| `tool_abandoned` | exit before result | `tool`, `lastStep` |

---

## 8. Estimate labeling (non-negotiable)

Every numeric output carries a visible label: these are **estimates based on
your inputs and stated assumptions — not forecasts or guarantees.** Applies
retroactively to `/roi-calculator` (F3). Every assumption is inspectable.

---

## 9. Offer routing

Routes by outcome, to registry IDs (F7) — never a blanket funnel into AI readiness.

> **Every row below is a *proposed* mapping, not a ratified one.** The offer
> names in the brief — "AI Discovery", "System Blueprint", "Measurement
> Foundation", "Website consultation", "SEO/AEO" — do **not** exist in
> `src/content/offers.ts` under those names. Only "Revenue Leak Diagnostic" and
> "ResponseOS" map cleanly. The registry IDs below are my best reading of intent
> onto existing records; offer routing is a commercial decision and needs your
> sign-off row by row. All 10 registry records are also still
> `evidenceStatus: 'unratified'`.

| Tool | Outcome condition | Offer (registry id) |
|---|---|---|
| AI Readiness Diagnostic | low readiness | `ai-readiness-score` |
| AI Readiness Diagnostic | high readiness | `founder-intelligence-system` |
| Website Project Estimator | any tier | website consultation — **OPEN Q-6: no website offer exists in the registry** |
| SEO ROI Calculator | break-even ≤ 12mo | SEO/AEO or measurement — **OPEN Q-6: no SEO offer in registry** |
| SEO ROI Calculator | break-even > 12mo | `revenue-leak-assessment` |
| Operational Waste Recovery Calculator | `Automate Now` | `responseos-core` / `responseos-managed-pilot` |
| Operational Waste Recovery Calculator | `Pilot First` | `responseos-managed-pilot` |
| Operational Waste Recovery Calculator | `Diagnose the Workflow` | `revenue-leak-assessment` |

**OPEN Q-6 is a blocker for two of the three calculators:** the registry has no
website or SEO offer. Either add them (a commercial decision, HUMAN_REQUIRED) or
route those tools to a generic consultation until offers are ratified.

---

## 10. Build order (revised from findings)

| Wave | Work | Rationale |
|---|---|---|
| 0 | `/resources` restructure into Diagnostics/Calculators + `TOOLS` registry; surface all existing tools; update the Resources description in `src/config/nav.ts` (F9 — one file covers header and footer) | Cheap, reversible, no new offers or analytics needed; creates the slot the rest fills |
| 1 | AI ROI retrofit — rename, workflow presets, assumption disclosure, disclaimer | Fixes a live false-precision risk; no new capture code |
| 2 | SEO ROI Calculator | Clearest standalone lead magnet; blocked on Q-2, Q-5, Q-6 |
| 3 | Website Project Estimator | Blocked on Q-3 (pricing) and Q-6 (offer) |

Wave 0 and Wave 1 ship independently and unblock nothing else. Waves 2–3 are
gated on the open questions.

---

## 11. Open questions requiring ratification

**Decided at the execution layer (logged, no sign-off needed):**

| # | Decision |
|---|---|
| D-1 | Flat routes: `/seo-roi-calculator`, `/website-project-estimator` (§3) |
| D-2 | Shared `tool_submissions` table for new tools; existing tools not migrated (§6) |
| D-3 | `@vercel/analytics` as the provider (§7) — flagged, say the word to hold it |

**Ratified by Tyrone, 2026-09-09:**

| # | Question | Ruling |
|---|---|---|
| Q-6 | Missing website/SEO offers | **Route to `/book-a-call`** until those offers are ratified into the registry. Swap to real offer IDs later via the `TOOLS` registry. Unblocks Waves 2–3. |
| Q-7 | Founder Gravity Audit | **Surface it** under Diagnostics alongside AI Readiness. |
| Q-8 | Diagnostics link target | **Link the landing pages**, not the instruments — they carry the framing copy and FAQ schema; the instrument is one click deeper. |
| — | Build order | **Waves 0 and 1 authorized to proceed.** |
| — | Wave 1 presets | **Ship without them.** `workflowType` unchanged; per-workflow capture rates would have to be invented. |
| — | Tool naming | **Hub card renamed to match the page**, not the reverse. The tool is "Operational Waste Recovery Calculator"; the page's title, H1, and anti-AI-hype positioning line are untouched. |
| — | `planned` tools | **Hidden from the hub**, not shown as "coming soon". They stay in the registry so a wave ships by flipping `status`. |

**Still open — blocks Waves 2–3:**

| # | Question | Type | Blocks |
|---|---|---|---|
| Q-2 | SEO ramp curve shape and the CTR-by-position source | Doctrine/data | Wave 2 |
| Q-3 | Website price bands — must reconcile with DECISIONS.md | **Commercial — HUMAN_REQUIRED** | Wave 3 |

---

## 12. Page copy (as proposed by Tyrone — pending ratification)

Reproduced verbatim from the brief for the record. Not edited, not finalized.

> **Tools for better business decisions**
>
> Assess what needs attention, estimate potential returns, and identify the next
> practical investment for your business.

**Diagnostics** — AI Readiness Diagnostic: "Assess whether your workflows, data,
team, and technology are prepared for useful AI implementation."
CTA: *Assess AI readiness*

**Calculators**
- Website Project Estimator — "Estimate the likely scope, timeline, and
  investment required for your website project." CTA: *Estimate my website project*
- SEO ROI Calculator — "Estimate how additional search visibility could
  translate into traffic, qualified leads, revenue, and payback."
  CTA: *Calculate SEO potential*
- AI ROI Calculator — "Estimate the financial effect of automation through time
  savings, faster response, recovered opportunities, and improved follow-up."
  CTA: *Calculate AI ROI*

---

## 13. Validation contract

`pnpm typecheck` · `pnpm lint` · `pnpm check:no-firebase` · `pnpm build`, plus
unit tests on every pure calculation fn and a route test asserting the
server-side recalculation mismatch rejection. Changes recorded in
`docs/CHANGELOG.md`; no new root-level markdown.
