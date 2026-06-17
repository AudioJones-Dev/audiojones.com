---
title: M.A.P. Framework Correction Audit
status: audit-findings (documentation only)
version: v1.0
date: 2026-06-17
owner: AJ Digital LLC
approver: Audio — approves copy and framework corrections
companion: AUDIOJONES_DOCTRINE_ALIGNMENT_AUDIT.md · AJ_DIGITAL_CANONICAL_OFFER_RATIFICATION_PROPOSAL.md
scope: documentation only — no code changed, no copy changed, no routes/URLs changed
satisfies: PR #175 deliverable 5 ("M.A.P. inconsistency report")
---

# M.A.P. Framework Correction Audit

> **Purpose.** Establish ONE canonical definition of the M.A.P. framework
> and inventory every place the repository deviates from it, so the exact
> scope of a later correction PR is known. **This document changes nothing**
> — no code, no copy, no routes, no metadata. It is the pre-implementation
> map.

---

## 0. Canonical definition (ratified by Audio, 2026-06-17)

**M.A.P. = Meaningful. Actionable. Profitable.**

- M.A.P. is the **master decision-making framework**, applied across
  Marketing, Sales, Operations, Reporting, AI Adoption, Founder
  Intelligence Systems, and Revenue Intelligence.
- M.A.P. is **NOT** an attribution framework. It is **NOT** a pipeline.
- Core filter: **(1) Is it Meaningful? (2) Is it Actionable? (3) Is it
  Profitable?**

**Framework hierarchy:**

```
M.A.P.  (Meaningful. Actionable. Profitable.)        ← PARENT / master decision framework
   └── M.A.P. Attribution Framework                  ← CHILD / one applied methodology
         (which channels/campaigns/activities are Meaningful, Actionable, Profitable)
```

> ⚠️ **This ratified definition supersedes a conflicting one already in the
> repo.** Two strategy docs —
> `docs/strategy/AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md` (§2, §3) and
> `docs/strategy/AUDIOJONES_SEO_AEO_ENTITY_IMPLEMENTATION_PLAN.md` (§ entity
> map) — instruct teams to expand M.A.P. as **"Measurement · Attribution ·
> Prediction."** That expansion now **conflicts** with the ratified
> "Meaningful. Actionable. Profitable." and must be reconciled at the doc
> level (see §5 and §8). It appears **only in those strategy docs and in the
> three audit/proposal docs that cite them — never in any live code.**

---

## 1. Current usage inventory

**Good news up front:** the live site is **already internally consistent on
the expansion** — every code reference expands M.A.P. as **"Meaningful /
Actionable / Profitable."** There is **no** "Meaningful Attribution
Pipeline" and **no** "Attribution Pipeline" string anywhere in the
repository (searched repo-wide). The conflation named in the brief does
**not** exist in code; the real defects are **(a) punctuation** ("M.A.P"
without the trailing period), **(b) acronym-before-expansion**, and **(c) a
collapsed parent/child hierarchy** (the site treats M.A.P. itself as "the
attribution framework").

### 1.1 Framework data store

| File:line | Current string | Notes |
|---|---|---|
| `src/content/frameworks/index.ts:20` | `title: "M.A.P Attribution Framework"` | Missing trailing period; lists the **child** as the only framework — no parent "M.A.P." entry. |
| `src/content/frameworks/index.ts:21` | `shortTitle: "M.A.P"` | Missing trailing period. |
| `src/content/frameworks/index.ts:22` | `tagline: "Meaningful. Actionable. Profitable."` | ✅ correct expansion. |

### 1.2 Dedicated framework page

| File:line | Current string |
|---|---|
| `src/app/frameworks/map-attribution/page.tsx:19` | `TITLE = "M.A.P Attribution Framework"` (feeds page `<title>`, breadcrumb, schema) |
| `:20-21` | `DEFINITION = "M.A.P Attribution is an Audio Jones methodology for evaluating whether a metric…is Meaningful, Actionable, and Profitable…"` |
| `:25,30,32,47` | FAQ copy: "M.A.P Attribution Framework", "M.A.P is a three-question filter…", "M.A.P measures decision quality", "all three M.A.P filters" |
| `:53-54` | meta description "M.A.P Attribution: a three-filter framework…" |
| `:87-88,96,100` | Body H2s/intro: "M.A.P Attribution…", "M = Meaningful" |

> Architectural note: this page **defines M.A.P. itself as an attribution
> methodology** ("M.A.P Attribution is an Audio Jones methodology…"). Per the
> canonical hierarchy, M.A.P. is the parent decision framework and *this page*
> is the child. The copy conflates the two.

### 1.3 Homepage landing components

| File:line | Current string |
|---|---|
| `src/components/home/landing/MAPAttributionSection.tsx:71` | Eyebrow `M.A.P Attribution` |
| `:10-12,200` | "Meaningful…", "meaningful, actionable, and profitable" |
| `:97` | image alt "M.A.P Attribution framework visual…meaningful, actionable, and profitable filters" |
| `:213` | "Read the full M.A.P framework →" |
| `src/components/home/landing/FrameworksDuo.tsx:25` | Eyebrow `M.A.P` |
| `:26` | `<h3>Meaningful · Actionable · Profitable</h3>` ✅ |
| `:29,37,68,109` | "M.A.P measures…", "Read M.A.P framework", aria-label "M.A.P pyramid", "MEANINGFUL" |
| `src/components/home/landing/ProcessPipeline.tsx:22` | "Apply M.A.P. Filter every metric through meaningful, actionable, profitable." (✅ has trailing period) |
| `src/components/home/landing/SystemModelLoop.tsx:44` | "M.A.P attribution scoring" |
| `src/components/home/landing/InsightsPreview.tsx:16-17` | FAQ "What is the M.A.P Attribution Framework?" / "fails any leg of M.A.P" |

### 1.4 Founder-intelligence components

| File:line | Current string |
|---|---|
| `src/components/founder-intelligence/FrameworkFeature.tsx:25-27,56` | "M.A.P Attribution Framework", "passes M.A.P.", "every data point through three filters", "Explore the M.A.P framework →" |
| `src/components/founder-intelligence/OfferCard.tsx:8` | "M.A.P attribution review" |
| `src/components/founder-intelligence/ProcessSteps.tsx:5` | "Audit dashboards, reports, and inputs against the M.A.P filter." |

### 1.5 Insights articles

| File:line | Current string |
|---|---|
| `src/app/insights/marketing-attribution-causal-identification/page.tsx:34,99` | "three filters — Meaningful, Actionable, Profitable", "M.A.P filter" |
| `src/app/insights/why-ai-fails-most-companies/page.tsx:99` | "M.A.P Attribution" |
| `src/app/insights/signal-vs-noise-business/page.tsx:34,103,111` | "meaningful…", "metrics that pass M.A.P: Meaningful to strategy…", "M.A.P Attribution" |

### 1.6 Blog (Sanity-wired index + topic pages)

| File:line | Current string |
|---|---|
| `src/app/blog/page.tsx:16,23,33,58-59,125,438` | Meta + cluster card "M.A.P Attribution" / "Meaningful. Actionable. Profitable." |
| `src/app/blog/topic/[slug]/page.tsx:35,37,258` | cluster label "M.A.P Attribution", "Meaningful. Actionable. Profitable.", link "M.A.P Attribution Framework" |

### 1.7 Other live surfaces

| File:line | Current string |
|---|---|
| `src/app/frameworks/page.tsx:13` | index meta lists "M.A.P Attribution" |
| `src/app/frameworks/niche-framework/page.tsx:108` | "M.A.P Attribution lives here." |
| `src/app/founder-intelligence/diagnostic/thank-you/page.tsx:60` | link "M.A.P Attribution →" |

### 1.8 Content-model / docs (not user-facing code, but governs future content)

| File:line | Current string |
|---|---|
| `docs/sanity-blog-content-model.md:33,42,226-227,242` | "M.A.P Attribution", "MAP attribution framework", route `map-attribution` |
| `docs/strategy/AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md:61,77,201` | mandates **"Measurement · Attribution · Prediction"** ⚠️ conflicts with canonical |
| `docs/strategy/AUDIOJONES_SEO_AEO_ENTITY_IMPLEMENTATION_PLAN.md:55` | maps M.A.P. → **"Measurement · Attribution · Prediction"** ⚠️ conflicts |

---

## 2. Incorrect usages (classified)

**Type A — Punctuation: "M.A.P" missing the trailing period.** The dominant
defect. Canonical is **"M.A.P."**. Affected: `frameworks/index.ts` (title +
shortTitle), `frameworks/map-attribution/page.tsx` (TITLE/DEFINITION/FAQ/meta/
body), `MAPAttributionSection.tsx`, `FrameworksDuo.tsx`, `SystemModelLoop.tsx`,
`InsightsPreview.tsx`, `FrameworkFeature.tsx`, `OfferCard.tsx`, `ProcessSteps.tsx`,
insights pages, blog pages, `frameworks/page.tsx`, `niche-framework/page.tsx`,
diagnostic thank-you. (`ProcessPipeline.tsx:22` is one of the few already
correct with "M.A.P.".)

**Type B — Acronym before expansion (first-mention rule).** Many surfaces
lead with "M.A.P" / "M.A.P Attribution" with no inline expansion on first
mention (e.g. homepage eyebrows in `MAPAttributionSection.tsx:71`,
`FrameworksDuo.tsx:25`; `frameworks/index.ts` shortTitle; blog cluster labels).

**Type C — Hierarchy conflation (M.A.P. presented AS the attribution
framework).** `frameworks/index.ts` lists only "M.A.P Attribution Framework"
as *the* framework; `frameworks/map-attribution/page.tsx:20-21` defines
"M.A.P Attribution is an Audio Jones methodology…". There is **no parent
"M.A.P." (master decision framework) entry** anywhere. This is the
substantive correction: separate parent from child.

**Type D — Expansion conflict (docs only).** The corrections doc + SEO/AEO
plan expand M.A.P. as "Measurement · Attribution · Prediction," contradicting
the ratified "Meaningful. Actionable. Profitable." **Code is not affected**
(code already uses the correct expansion); only the two strategy docs need
reconciling.

**Not found (no action):** "Meaningful Attribution Pipeline," "Attribution
Pipeline," "MAP" (bare, as a brand) — **zero occurrences**. The brief's
suspected conflation does not exist in this repository.

---

## 3. Recommended replacements

| Context | From (examples) | To (canonical) |
|---|---|---|
| First mention on any page | `M.A.P` / `M.A.P Attribution` | **`M.A.P. (Meaningful. Actionable. Profitable.)`** |
| Subsequent mentions | `M.A.P` | **`M.A.P.`** (with period) |
| Attribution page title/schema | `M.A.P Attribution Framework` | **`M.A.P. Attribution Framework`** (and add: "a methodology built on the M.A.P. framework") |
| Attribution page alt phrasing | — | **`Marketing Attribution Through the M.A.P. Framework`** |
| Framework store parent | *(absent)* | **Add a parent entry: `M.A.P.` — "Meaningful. Actionable. Profitable." — master decision framework** |
| Framework store child | `title:"M.A.P Attribution Framework"` | `title:"M.A.P. Attribution Framework"`, described as built on M.A.P. |
| `shortTitle:"M.A.P"` | | `shortTitle:"M.A.P."` |
| Avoid everywhere | `Meaningful Attribution Pipeline`, `M.A.P Attribution` (unexplained), `MAP Attribution` (unexplained) | (already absent / fix per above) |

---

## 4. SEO implications

- **Page `<title>` & breadcrumb:** `frameworks/map-attribution/page.tsx`
  `TITLE` feeds the document title, breadcrumb, and schema `name`. Changing
  "M.A.P Attribution Framework" → "M.A.P. Attribution Framework" is a
  **title-string** change (adds a period); **the route `/frameworks/map-attribution`
  does NOT change** — no redirect needed, no URL/slug churn.
- **Indexed term consistency:** today the site emits "M.A.P Attribution"
  (no period). Standardizing to "M.A.P." improves entity consistency but is a
  minor change to an already-indexed phrase; expect negligible ranking impact
  if the slug and H1 intent are preserved.
- **Acronym-collision context (from SEO/AEO plan):** "MAP" collides with
  "Minimum Advertised Price." The first-mention expansion rule
  ("M.A.P. (Meaningful. Actionable. Profitable.)") is the correct mitigation;
  it should be applied in the H1/intro and meta description of the attribution
  page and homepage section.
- **Blog topic route `/blog/topic/map-attribution`** and Sanity content model
  reference the same slug — **no slug change recommended**; only display labels
  update.

---

## 5. Metadata implications

- **`buildMetadata` titles/descriptions** in `frameworks/map-attribution/page.tsx`
  (lines 52-54) carry "M.A.P Attribution" into `<title>`, OpenGraph, and
  Twitter — these need the period + (optionally) first-mention expansion in the
  description.
- **Schema.org JSON-LD:** the page emits `articleJsonLd` and
  `definedTermJsonLd` with `name: TITLE` (`map-attribution/page.tsx:70,73`).
  Updating `TITLE` updates the structured-data `name` automatically — verify
  the `DefinedTerm` description reflects the parent/child relationship.
- **Blog metadata** (`blog/page.tsx`, `blog/topic/[slug]/page.tsx`) repeats
  "M.A.P Attribution" in descriptions — update display labels only.
- **Strategy-doc metadata conflict (Type D):** the corrections doc and SEO/AEO
  plan must be amended so downstream content authors don't reintroduce
  "Measurement · Attribution · Prediction" into metadata.

---

## 6. Framework hierarchy (canonical, for the correction PR)

```
M.A.P.  — Meaningful. Actionable. Profitable.
  Role:   Master decision-making framework
  Scope:  Marketing · Sales · Operations · Reporting · AI Adoption ·
          Founder Intelligence Systems · Revenue Intelligence
  Filter: Meaningful? → Actionable? → Profitable?

  ├── M.A.P. Attribution Framework   (child methodology)
  │     Applies the M.A.P. filter to channels, campaigns, activities
  │     Alt label: "Marketing Attribution Through the M.A.P. Framework"
  │     Route: /frameworks/map-attribution  (UNCHANGED)
  │
  └── (future children may apply M.A.P. to other domains — out of scope here)
```

Implication for `src/content/frameworks/index.ts`: today it has **one** entry
(the child). The corrected model needs a **parent "M.A.P." entry** plus the
child, with the child explicitly described as built on the parent.

---

## 7. Final canonical language (copy block for the correction PR)

- **Name (first mention):** `M.A.P. (Meaningful. Actionable. Profitable.)`
- **Name (subsequent):** `M.A.P.`
- **Master framework one-liner:** "M.A.P. — Meaningful. Actionable.
  Profitable. — is the decision filter every metric, channel, and AI
  initiative must pass before it earns the right to drive a decision."
- **Child framework:** `M.A.P. Attribution Framework` — "a marketing/revenue
  attribution methodology built on the M.A.P. framework that determines which
  channels, campaigns, and activities are Meaningful, Actionable, and
  Profitable."
- **Alt attribution heading:** `Marketing Attribution Through the M.A.P.
  Framework`
- **Never use:** "Meaningful Attribution Pipeline" · "Attribution Pipeline" ·
  "M.A.P Attribution" (no period) · unexplained "MAP".

---

## 8. Files requiring updates (scope of the future correction PR)

**Code — punctuation + first-mention + hierarchy (display strings only):**
1. `src/content/frameworks/index.ts` — add parent M.A.P. entry; fix child title + shortTitle (periods).
2. `src/app/frameworks/map-attribution/page.tsx` — TITLE, DEFINITION, FAQ, meta, body, schema `name`.
3. `src/components/home/landing/MAPAttributionSection.tsx`
4. `src/components/home/landing/FrameworksDuo.tsx`
5. `src/components/home/landing/ProcessPipeline.tsx` *(already "M.A.P." — verify only)*
6. `src/components/home/landing/SystemModelLoop.tsx`
7. `src/components/home/landing/InsightsPreview.tsx`
8. `src/components/founder-intelligence/FrameworkFeature.tsx`
9. `src/components/founder-intelligence/OfferCard.tsx`
10. `src/components/founder-intelligence/ProcessSteps.tsx`
11. `src/app/frameworks/page.tsx`
12. `src/app/frameworks/niche-framework/page.tsx`
13. `src/app/insights/marketing-attribution-causal-identification/page.tsx`
14. `src/app/insights/why-ai-fails-most-companies/page.tsx`
15. `src/app/insights/signal-vs-noise-business/page.tsx`
16. `src/app/blog/page.tsx`
17. `src/app/blog/topic/[slug]/page.tsx`
18. `src/app/founder-intelligence/diagnostic/thank-you/page.tsx`

**Docs — reconcile the conflicting expansion (Type D), no code impact:**
19. `docs/strategy/AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md` (§2/§3) — supersede "Measurement · Attribution · Prediction" with ratified canonical.
20. `docs/strategy/AUDIOJONES_SEO_AEO_ENTITY_IMPLEMENTATION_PLAN.md` (§ entity map) — same.
21. `docs/sanity-blog-content-model.md` — standardize labels to "M.A.P. Attribution".

**No change:** routes/slugs (`/frameworks/map-attribution`, `/blog/topic/map-attribution`), URLs, sitemap, redirects.

---

## 9. Risk assessment

| Risk | Severity | Notes |
|---|---|---|
| URL/route change | **None** | Slugs unchanged; display strings only. |
| Broken internal links | **Low** | Links use `href` slugs, not labels; label edits are safe. |
| SEO ranking dip | **Low** | Period addition + first-mention expansion on an already-indexed term; intent preserved. |
| Schema/JSON-LD breakage | **Low** | `name`/`description` are free-text; type unchanged (`DefinedTerm`/`Article`). |
| Hierarchy edit (adding parent entry) | **Medium** | `frameworks/index.ts` is consumed by `/frameworks` index + components; adding a record must not break `.map()` rendering — verify the index page handles a 5th framework card. |
| Doc expansion conflict reintroduced | **Medium** | If corrections/SEO docs aren't reconciled, future authors re-add "Measurement · Attribution · Prediction." Must update docs in the same PR. |
| Scope creep into copy rewrite | **Medium** | Keep to M.A.P. naming/hierarchy; do not rewrite surrounding marketing copy. |

---

## 10. Recommended implementation plan (for a later, separate PR)

> Documentation deliverable only — this audit does not execute any of the
> following. Implementation requires Audio's go-ahead.

1. **Branch** `fix/map-framework-canonicalization` off latest `main`.
2. **Hierarchy first:** add the parent **M.A.P.** entry to
   `src/content/frameworks/index.ts`; re-describe the child as built on it;
   verify `/frameworks` index renders the added card.
3. **Punctuation + first-mention sweep** across the 18 code files (§8),
   applying the §7 canonical language. Pure display-string edits.
4. **Attribution page** (`map-attribution/page.tsx`): update TITLE/DEFINITION/
   FAQ/meta/body + confirm JSON-LD `name`/`description`.
5. **Docs reconciliation:** update the two strategy docs + Sanity content model
   to the ratified expansion (resolves Type D).
6. **Validate:** `pnpm typecheck && pnpm lint && pnpm check:no-firebase && pnpm build`.
7. **Verify:** spot-check `/frameworks`, `/frameworks/map-attribution`,
   homepage M.A.P. section, and one insight + blog topic page render the
   corrected language; no route changed.
8. **Open draft PR**, reference this audit as the canonical source.

**Sequencing note:** this correction is independent of PR #175 (offer/nav
alignment) and can land before or after it. If both touch
`src/content/frameworks/index.ts`, land this one first to avoid a conflict.
</content>
