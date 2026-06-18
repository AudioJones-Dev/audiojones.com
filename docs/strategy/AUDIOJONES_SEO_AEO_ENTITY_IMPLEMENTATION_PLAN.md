---
title: Audio Jones SEO/AEO Entity Implementation Plan
status: canonical
version: v1.0
date: 2026-05-26
related:
  - docs/strategy/AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md
  - docs/governance/GIT_WORKFLOW_OPERATING_STANDARD.md
  - CLAUDE.md
source: AJ Digital strategy + Perplexity validation + user naming decisions
---

# Audio Jones SEO/AEO Entity Implementation Plan

Docs-only plan. Defines the canonical entity stack, approved/deprecated terminology, content backlog priorities, page/route recommendations, internal linking strategy, schema recommendations, claim-safety rules, and AEO ownership strategy for each entity. Implementation happens in subsequent scoped PRs after user approval per entity / per pillar.

This plan operationalizes the corrections layer at `docs/strategy/AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md`. Where the corrections doc says what NOT to publish and which entities carry collision risk, this plan says what to BUILD, where to put it, how to schema-mark it, and how to measure retrieval.

---

## 1. Canonical Entity Map

| Entity | Role | Layer | Status | Qualifier |
|---|---|---|---|---|
| Founder Revenue Leak Diagnostic | Entry diagnostic | Operational | Canonical | None (compound name is the qualifier) |
| Founder Revenue System | Core installed offer | Operational | Canonical | None (compound name is the qualifier) |
| Founder Intelligence Systems | Category umbrella | Operational | Canonical | **MANDATORY: "for founder-led service businesses"** |
| Signal Doctrine | Methodology / decision filter | Theoretical | Canonical | None |
| Founder Operator Under Cognitive Load | Persona / content pillar | Operational | Canonical | None |

---

## 2. Approved Terminology (public-facing)

| Entity | First-mention public form | Subsequent-mention form |
|---|---|---|
| Founder Revenue Leak Diagnostic | "Founder Revenue Leak Diagnostic" | "the Diagnostic" (only within the same page; full name on every new page) |
| Founder Revenue System | "Founder Revenue System" | "Founder Revenue System" (no abbreviation; do not introduce an acronym) |
| Founder Intelligence Systems | "Founder Intelligence Systems for founder-led service businesses" | "Founder Intelligence Systems" (qualifier-once-per-page rule — the first mention on every page MUST include "for founder-led service businesses"; subsequent mentions on the same page may shorten) |
| Signal Doctrine | "Signal Doctrine" | "Signal Doctrine" or "the Doctrine" (within methodology context) |
| Founder Operator Under Cognitive Load | "Founder Operator Under Cognitive Load" | "Founder Operator Under Cognitive Load" or "the Founder Operator" (avoid acronymization) |

**Hard rule:** the first mention of "Founder Intelligence Systems" on every page MUST carry the qualifier "for founder-led service businesses". Schema `alternateName` may carry the unqualified form for retrieval, but visible page copy gets the qualifier on first mention.

---

## 3. Deprecated Terminology (do not use in new public copy)

| Deprecated Term | Replacement | Reason |
|---|---|---|
| Signal Revenue System | Founder Revenue System | Signal messaging app trademark collision (deprecated 2026-05-26) |
| Founder Intelligence Systems (public) | Founder Intelligence Systems for founder-led service businesses | Same-vertical competitor at appliedintelligencesystems.com |
| Signal Theory | Signal Doctrine | signaltheory.com (Ad Age agency) — cannot own |
| Persistent Business Memory (as branded product) | Persistent business memory (descriptive only) | Multiple entity collisions; descriptor only |
| M.A.P. (acronym-first) | M.A.P. (Meaningful. Actionable. Profitable.) — expanded on first mention | MAP (Minimum Advertised Price) acronym collision dominates retrieval; expansion ratified 2026-06-17 (supersedes "Measurement · Attribution · Prediction") — see `docs/strategy/MAP_FRAMEWORK_CORRECTION_AUDIT.md` |

---

## 4. First 90-Day Content Backlog

### P0 — Build first

1. **Founder Revenue Leak Diagnostic** — entry diagnostic page, canonical FAQ + schema (planned)
2. **Founder Revenue System** — core offer page, canonical definition + service framing (planned; replaces deprecated Signal Revenue System)
3. **Founder Operator Under Cognitive Load** — content pillar persona page
4. **Operational AI for Accessibility Contractors** — vertical-specific whitespace pillar

### P1 — Build after P0 lands

5. **Speed-to-Lead Benchmark for Accessibility Contractors** — annual citable data study
6. **AI Readiness for Founder-Led Service Businesses** — diagnostic format
7. **Attribution for Home Services in Contractor English** — translation layer

---

## 5. Page / Route Recommendations

| Entity | Recommended Route | Page Type | Schema Type |
|---|---|---|---|
| Founder Revenue Leak Diagnostic | `/diagnostics/founder-revenue-leak-diagnostic` | Diagnostic landing + FAQ | `DefinedTerm` + `FAQPage` + `Service` |
| Founder Revenue System | `/services/founder-revenue-system` OR `/system/founder-revenue-system` | Service / offer page | `Service` + `DefinedTerm` |
| Founder Intelligence Systems | `/frameworks/founder-intelligence-systems` | Category page | `DefinedTerm` + `Article` |
| Signal Doctrine | `/frameworks/signal-doctrine` | Methodology page | `DefinedTerm` + `Article` |
| Founder Operator Under Cognitive Load | `/frameworks/founder-operator-under-cognitive-load` | Persona page | `DefinedTerm` + `Article` |
| Operational AI for Accessibility Contractors | `/verticals/accessibility-contractors` OR `/industries/accessibility-contractors` | Vertical landing | `Article` + `Service` |

### Route-collision flags (informational, no code changes in this PR)

Per the Section 5 audit in the corrections doc, current `src/app/` does not contain any of the proposed routes above. Two related existing routes warrant disposition decisions in subsequent scoped PRs:

- **`/founder-intelligence/page.tsx` + `/founder-intelligence/diagnostic/`** — methodology entry-point + Signal Audit diagnostic instance. Likely keep as-is (methodology entry; not public brand vehicle). Confirm in the AIS→FIS migration PR.
- **`/frameworks/founder-intelligence-systems/`** — dedicated AIS-slugged route. Disposition: rename to `/frameworks/founder-intelligence-systems` with 308 redirect from the old slug, OR retire to internal-only banner. Lock in the AIS→FIS migration PR.
- **`/insights/founder-intelligence-systems/`** — same AIS-slug pattern. Same disposition decision.

Route slug decisions for new entities are open in §12 below.

---

## 6. Internal Linking Strategy

Every new canonical entity page emits a "Related" block linking to:

- Every framework page → links to **Founder Intelligence Systems** (category umbrella) and **Signal Doctrine** (methodology)
- **Founder Revenue Leak Diagnostic** links forward to **Founder Revenue System** as the next step
- **Founder Revenue System** links back to **Founder Revenue Leak Diagnostic** as the entry diagnostic
- **Founder Operator Under Cognitive Load** links to all five operational pillars (Diagnostic, System, AI for Founder-Led Businesses, FIS umbrella, Signal Doctrine)
- **Accessibility Contractors vertical page** links to all founder-* entities as supporting frameworks

Pattern: max 4 outbound internal links per page on the "Related" block (avoid spammy density). Inline contextual links inside body copy are unrestricted but should always be intentional (not decorative).

---

## 7. Schema Recommendations

### Organization schema (global)

- `legalName: "AJ Digital LLC"`
- `name: "Audio Jones"`
- `parentOrganization` / `subOrganization` modeling: Audio Jones is the brand identity; AJ Digital LLC is the operating entity (`legalName`). Already partially in place via `src/lib/seo/schema.ts:organizationJsonLd()` — verify the `legalName` field is set during the AIS→FIS migration PR.

### Per-entity schema blocks

- Every canonical entity gets a **`DefinedTerm`** schema block with:
  - `name` — canonical entity name
  - `alternateName` — list of valid alternative phrasings (may include unqualified "Founder Intelligence Systems" for retrieval even though the visible page copy requires the qualifier)
  - `description` — 1-2 sentence canonical definition (matches the page's Founder TL;DR per §0.8)
  - `url` — canonical URL of the entity's definition page
  - `inDefinedTermSet` — optional grouping if a glossary or framework collection schema is added later
- **Founder Revenue System** uses **`Service`** schema in addition to `DefinedTerm` (it's a sellable offer)
- **Founder Revenue Leak Diagnostic** uses **`Service` + `DefinedTerm` + `FAQPage`** (diagnostic entry point + FAQ block)
- **DO NOT** use `Product` schema for Persistent Business Memory (descriptor only — never branded product)
- **DO NOT** carry the old "Signal Revenue System" name in any schema block. Schema must align with the deprecated terminology table.

### Speakable spec

Every canonical entity page should include `speakableSpec(['h1', '.tldr-block'])` so the H1 and Founder TL;DR are surfaced for voice-search / AEO retrieval.

---

## 8. Claim-Safety Rules

Every claim cited on a public surface must:

1. **Map to a SAFE entry** in the corrections doc Section 1 table (or be added to that table before publication)
2. **Include the required qualifier** (small-sample, enterprise-scope, modeled-not-measured, etc.) as specified in the corrections doc
3. **Link to the primary source** (not a vendor blog citing it)
4. **Carry an inline citation footnote** OR a structured `<cite>` element in rendered HTML

Claims marked **REMOVE** in the corrections doc are **forbidden** in all new public content:

- "73% fail without readiness assessment" — REMOVE
- "38% of 7-figure businesses use AI workflows" — REMOVE
- "80% B2B podcasts abandoned" — REMOVE

A CI check (`scripts/check-no-removed-claims.ts`, to be added in a separate scoped PR) is recommended to grep public surfaces for these strings on every build.

---

## 9. Source-Verification Requirements

Before any content PR ships:

- Every cited statistic must have an active link to the primary source
- Citations to secondary sources (Forbes article citing MIT study) are acceptable **if and only if** the secondary source links to the primary
- Vendor blogs citing a number are **NOT acceptable** as sole source
- For "modeled estimate" claims (e.g., $126K missed calls), the model inputs must be linkable to a transparent calculation page
- Each claim's source URL + access date must be captured either:
  - Inline in the page (footnote or `<cite>`), OR
  - In a per-page or central `citations.ts` data file referenced by the page

Standing rule: if a source URL returns 404 or has been substantively updated, the cited claim must be re-verified at the new canonical source before the page can re-deploy.

---

## 10. AEO Ownership Strategy

For each canonical entity:

| Entity | Canonical page status | Citation magnets (verbatim retrieval phrasings) | Off-site signal plan |
|---|---|---|---|
| Founder Revenue Leak Diagnostic | Pending | "The Founder Revenue Leak Diagnostic is a structured assessment that surfaces where founder-led service businesses are losing revenue to operational gaps." | Podcast guest spots, Reddit (`r/smallbusiness`, `r/Entrepreneur`, `r/HomeImprovement`), LinkedIn long-form, guest posts on accessibility-contractor publications |
| Founder Revenue System | Pending | "The Founder Revenue System is the installed operating system AJ Digital deploys to close the leaks identified in the Founder Revenue Leak Diagnostic." | Same channels; emphasize post-diagnostic transition framing |
| Founder Intelligence Systems | Pending | "Founder Intelligence Systems for founder-led service businesses combine operational diagnostics, AI-assisted workflows, and signal-driven measurement." | Long-form thought leadership; podcast guest spots; AI-adjacent business publications |
| Signal Doctrine | Pending | "Signal Doctrine is the decision filter AJ Digital applies: complexity exists in the architecture, not in the reading experience." | Methodology-focused content; Substack-style essays; conference talks |
| Founder Operator Under Cognitive Load | Pending | "Founder Operator Under Cognitive Load describes the operationally-involved founder who is overwhelmed by tooling complexity, skeptical of AI hype, and struggling with attribution clarity." | Persona-led content; LinkedIn carousels; podcast guest discussions on founder mental load |
| Operational AI for Accessibility Contractors | Pending | "Operational AI for accessibility contractors closes the call-response gap, automates aging-in-place lead qualification, and instruments revenue measurement specific to home-modification businesses." | Accessibility-contractor publications; NAHB Remodelers communities; aging-in-place industry forums |

### Measurement cadence

Per the §0.12 measurement loop (vault doctrine): every entity gets monthly retrieval probes once its canonical page ships. The probe target is "name growth from zero to first citation by ChatGPT / Claude / Perplexity / Gemini" — that's the AEO success metric.

A measurement-infrastructure PR will land in `aj-rekonr` (not in this repo). It will:
- Run scheduled LLM retrieval probes for each canonical entity
- Track first-citation date + citation frequency per LLM
- Surface drift (a previously-cited name that stops being cited)

This `audiojones-clean` repo carries the canonical entity pages; `aj-rekonr` carries the measurement infrastructure. No measurement code in this repo.

---

## 11. Next PR Phases (after this docs update)

Each phase is its own draft PR, sequenced. No phase auto-triggers the next — user approval gates every step.

1. **Site grep + rename sweep** — `refactor/rename-signal-revenue-system-to-founder-revenue-system` (likely a no-op on current public copy per the corrections doc Section 5.4 finding that `Signal Revenue System` does not currently appear in `src/`; verify by re-grep and document the no-op result). May still touch internal `docs/codex/responseos-v1-brief.md` if ResponseOS scoping references Signal Revenue System internally.
2. **Founder Revenue System canonical page scaffold** — `feat/scaffold-founder-revenue-system-page`. Route + content + schema per §5 / §7.
3. **Founder Revenue Leak Diagnostic canonical page scaffold** — `feat/scaffold-founder-revenue-leak-diagnostic-page`. Route + content + schema + FAQ block.
4. **Founder Operator Under Cognitive Load page scaffold** — `feat/scaffold-founder-operator-under-cognitive-load-page`. Persona content + content-pillar topic clusters.
5. **Operational AI for Accessibility Contractors page scaffold** — `feat/scaffold-operational-ai-accessibility-contractors-page`. Vertical landing + supporting frameworks links.
6. **Content pillars (P0 then P1)** — one PR each, sequenced per the 90-day backlog
7. **Schema migration** — `chore/seo-schema-migration` — adds DefinedTerm + Service + FAQPage + speakableSpec to all canonical entity pages; updates `organizationJsonLd()` to confirm `legalName: "AJ Digital LLC"`
8. **Measurement infrastructure** — lives in `aj-rekonr`, not this repo. Out of scope here.

### Dependency graph

```
Phase 1 (rename sweep) ──→ no dependencies; can run immediately
Phase 2 (FRS page)     ──→ depends on Phase 1 (no-op or completed)
Phase 3 (FRLD page)    ──→ depends on Phase 1; can run parallel to Phase 2
Phase 4 (FOUCL page)   ──→ no hard dependency; can run parallel to 2/3
Phase 5 (vertical pg)  ──→ no hard dependency; can run parallel to 2/3/4
Phase 6 (pillars)      ──→ depends on Phases 2-5 (anchor pages must exist before pillar topic clusters link to them)
Phase 7 (schema)       ──→ depends on Phases 2-5 (entity pages must exist before schema block is added)
Phase 8 (measurement)  ──→ depends on Phase 7 (schema must be live before LLM probes have something to measure against)
```

---

## 12. Unresolved Decisions

Surface for user resolution before Phase 1 begins:

1. **Founder Revenue System route slug** — `/services/founder-revenue-system` vs `/system/founder-revenue-system` vs `/founder-revenue-system` (top-level). Recommendation: `/services/founder-revenue-system` — keeps the offer under the existing `/services` taxonomy and avoids creating a new top-level segment.
2. **Operational AI for Accessibility Contractors route slug** — `/verticals/accessibility-contractors` vs `/industries/accessibility-contractors`. Recommendation: `/verticals/...` — "verticals" reads as operator language; "industries" is generic.
3. **`/frameworks/founder-intelligence-systems` disposition** — rename to `/frameworks/founder-intelligence-systems` with 308 redirect, OR convert to internal-only banner, OR retire entirely. Locked in the AIS→FIS migration PR (not this one).
4. **`/insights/founder-intelligence-systems` disposition** — same decision space as #3.
5. **Founder Revenue System abbreviation policy** — directive says "no abbreviation; do not introduce an acronym" but verify: is there ANY context where the team wants to internally use "FRS"? If yes, document the boundary (internal-only, like AIS).
6. **Founder Intelligence Systems trademark filing** — corrections doc flagged "Consider trademark filing on compound mark". Decision is out of code scope but referenced here for the strategic record.

---

## 13. Out-of-Scope (this PR + this doc explicitly)

- **No new routes created** in this PR. Route slug decisions stay as recommendations until user-approved scoped PRs implement them.
- **No schema markup added** in this PR. Schema recommendations in §7 stay as plan until the schema migration PR (Phase 7).
- **No app code modified**. Plan is docs-only.
- **No `package.json` / `pnpm-lock.yaml` / CI changes**.
- **No Firebase references introduced**.
- **No public copy migrated** from "Founder Intelligence Systems" to "Founder Intelligence Systems for founder-led service businesses". That sweep lives in the AIS→FIS migration PR (a separate scoped PR per the corrections doc Section 5 audit findings).
- **No content pillar copy written**. Content lives in scaffolded page PRs in §11 phases 2-6.
- **No measurement code**. Lives in `aj-rekonr`, not in this repo.
