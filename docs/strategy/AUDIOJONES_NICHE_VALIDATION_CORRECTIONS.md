---
title: Audio Jones Niche Validation Corrections
status: canonical
version: v1.0
date: 2026-05-26
source: Perplexity senior strategic validation audit
scope: docs-only — claim safety + entity risk + terminology corrections
related:
  - docs/governance/GIT_WORKFLOW_OPERATING_STANDARD.md
  - docs/strategy/audiojones-strategy-v1.5.1.md (if present — codified strategy doc)
  - docs/specs/services-rebrand-spec-2026-05-08.md (services rebrand spec, superseded scope but historical reference)
  - docs/codex/responseos-v1-brief.md (ResponseOS product spec — must be audited against §2 entity-risk corrections in a separate scoped PR)
---

# Audio Jones Niche Validation Corrections

Status: corrections layer. This document does NOT replace the canonical strategy; it adds claim-safety and entity-risk discipline that public-facing surfaces must respect.

Approved wedge (preserved): **Founder Intelligence Systems for founder-led service businesses, with accessibility / home-modification / aging-in-place as the primary wedge.**

---

## §1 — Claim Safety Table

| Claim | Verdict | Original Source | Safe Public Form |
|---|---|---|---|
| 95% AI pilots fail | SAFE with qualifier | MIT NANDA Initiative 2025, Aditya Challapally | "MIT's NANDA Initiative found 95% of enterprise generative AI pilots fail to deliver measurable P&L impact." Add: enterprise-scope qualifier. |
| 73% fail without readiness assessment | **REMOVE** | No traceable primary source — vendor-constructed talking point | Do not publish. |
| 41.8M solopreneurs / $1.3T | REQUIRE QUALIFICATION | MBO Partners 2019 — outdated | Use current: 29.8M solopreneurs / $1.7T (US Census via CNBC 2025). Original figure only if explicitly dated 2019. |
| 38% of 7-figure businesses use AI workflows | **REMOVE** | LinkedIn post by Vedant Patel — no study | Do not publish. |
| 62% calls unanswered | SAFE with qualifier | 411 Locals, 85 small businesses over 30 days | "A study of local small businesses found 62% of inbound calls go unanswered." Add small-sample qualifier. |
| $126K/yr missed calls | SAFE if framed as modeled | bizrnr.com industry calculation, transparent assumptions | "Modeling based on call-response and close-rate data suggests the average service business loses six figures annually." Frame as modeled estimate, not measured study. |
| 80% B2B podcasts abandoned | **REMOVE** | Fame.so editorial commentary, not a study | Do not publish. Replace with verifiable: "fewer than 8% of podcasts get past 10 episodes" (Spotify/Apple data). |
| 9.3 hrs/wk context switching | SAFE | Asana Anatomy of Work Index (2024/2025) | Cite Asana, not the 2012 McKinsey study. |
| Aging-in-place market $9.2B by 2032 | SAFE | Verified Market Research | OK to publish with source. |
| 73% remodelers report aging-in-place increase | SAFE | NAHB | OK to publish with source. |

### Verification rule (mandatory)

**No claim from this table appears on a public surface without the verified citation linked.** Claims marked SAFE require their original source linked in the page where they appear (footnote, citation block, or inline `<a href>`). Claims marked REMOVE must not appear in any public copy, schema, OG image, or social collateral going forward.

### Original-source verification required BEFORE any public claim

Even SAFE claims must be re-verified at the primary source before publication. Authors must:

1. Open the canonical source URL (MIT NANDA, Asana Index, NAHB, VMR, etc.)
2. Confirm the cited figure matches the source as of the publication date
3. Capture the source URL + access date in a citations file or inline footnote
4. If the source has been retracted, updated, or moved — escalate before publishing

---

## §2 — Entity Risk Table

| Entity | Collision Risk | Ownable? | Qualifier Required? | Action |
|---|---|---|---|---|
| Founder Intelligence Systems | MODERATE — Accenture's "Founders Intelligence" (acquired 2021) | Yes — with qualifier | YES: "for founder-led service businesses" | Always qualified in public. Consider trademark filing on compound mark. |
| Signal Revenue System | HIGH (Signal app collision) | DEPRECATED — renamed to Founder Revenue System | N/A | **RENAMED.** Use "Founder Revenue System" in all new public copy. Historical references retained only in internal docs / changelog. |
| Founder Revenue System | LOW — no competing entity | YES | No (compound name is the qualifier) | **NEW canonical public name** for the core installed offer. Build canonical FAQ + schema. |
| Persistent Business Memory | HIGH — Persistent Systems ($360M+ IT firm), PBM™ (Australian service mark), Intel persistent memory term-of-art | Not as branded product | N/A | Use ONLY as descriptive concept in methodology. Never as a branded product name. |
| M.A.P. Attribution | MODERATE — MAP (Minimum Advertised Price) dominates the acronym | Risky as acronym-first | YES: spell out full term | Avoid acronym-first language in public copy. Use "Measurement · Attribution · Prediction" verbatim. |
| Founder Revenue Leak Diagnostic | LOW-MODERATE — fragmented competitors (Bifrost Agency, SEVAKOR, Kinto Global) at adjacent intersection | YES with "Founder" qualifier | Compound name is the qualifier | **LEAD with this name in public.** Build canonical FAQ + schema. |
| Founder Operator Under Cognitive Load | LOW — no competing entity | YES — strongest whitespace | No | **Strongest single language asset.** Develop as content pillar. |
| Signal Doctrine | LOW — no competing entity in SMB/founder space | YES | No | Keep as methodology framework name. |

---

## §3 — Updated Public Terminology Recommendations

- LEAD with: **Founder Revenue Leak Diagnostic** (entry diagnostic)
- Core installed offer: **Founder Revenue System** (replaces Signal Revenue System for public use)
- Category umbrella: **Founder Intelligence Systems for founder-led service businesses** (qualifier mandatory)
- Methodology: **Signal Doctrine**
- Persona / content pillar: **Founder Operator Under Cognitive Load**
- **Avoid Signal Revenue System** as a public product name (deprecated 2026-05-26 — see §2)
- Use Persistent Business Memory **descriptively only, not as a branded product**
- **Avoid M.A.P. acronym-first language** in public copy; spell out Measurement · Attribution · Prediction

---

## §4 — Revised First 90-Day Content Backlog

### P0 (priority zero — build first)

1. **Founder Revenue Leak Diagnostic** (canonical FAQ + schema) — entry diagnostic
2. **Founder Revenue System** (core installed offer — replaces deprecated Signal Revenue System; canonical definition + service framing) — added 2026-05-26 per naming decision
3. **Operational AI for Accessibility Contractors** (vertical-specific whitespace)
4. **Founder Operator Under Cognitive Load** (broadest emotional entry)

### P1 (priority one — after P0)

4. **Speed-to-Lead Benchmark for Accessibility Contractors** (annual citable data study)
5. **AI Readiness for Founder-Led Service Businesses** (diagnostic format)
6. **Attribution for Home Services in Contractor English** (translation layer)

---

## §5 — Naming Conflicts with Current Site

Audit performed against `origin/main` at HEAD `e0ddca6` (date: 2026-05-26). Findings are FLAG-ONLY — this document does not fix any of them. Each flagged conflict requires its own scoped PR with user-approved terminology decisions.

### 5.1 "Founder Intelligence Systems" public usage — HIGH VOLUME (23 files)

The current site publishes "Founder Intelligence Systems" as the public brand wedge in 23 source files. Per the corrections approved wedge (§intro) + §2 entity-risk table, the public name should be **"Founder Intelligence Systems for founder-led service businesses"** with the qualifier always present (Accenture's "Founders Intelligence" collision risk).

**Critical public surfaces (must be addressed first):**

| File | Surface | Current text (sampled) | Recommended action |
|---|---|---|---|
| `src/app/page.tsx` | Homepage `<title>` + `<meta>` + OG | `"Audio Jones — Founder Intelligence Systems for founder-led businesses"` + matching OG title + Twitter title | Migrate to qualified FIS™ wording per §2 |
| `src/app/layout.tsx` | Root layout metadata | (root metadata template references AIS) | Audit + migrate |
| `src/app/about/page.tsx` | About page | (publishes AIS publicly) | Audit + migrate |
| `src/app/services/page.tsx` | Services page | (publishes AIS publicly) | Audit + migrate (services rebrand spec already exists) |
| `src/app/blog/page.tsx` | Blog index | (publishes AIS publicly) | Audit + migrate |
| `src/app/blog/topic/[slug]/page.tsx` | Blog topic pages | (publishes AIS publicly via dynamic copy) | Audit + migrate |
| `src/app/insights/page.tsx` | Insights index | (publishes AIS publicly) | Audit + migrate |
| `src/app/insights/founder-intelligence-systems/page.tsx` | Dedicated AIS insight page | Slug includes AIS | Decide: rename route, add 308 redirect to FIS-named slug, OR convert to internal-only banner |
| `src/app/insights/why-ai-fails-most-companies/page.tsx` | Insight article | (references AIS) | Audit + migrate |
| `src/app/frameworks/page.tsx` | Frameworks index | (publishes AIS publicly) | Audit + migrate |
| `src/app/frameworks/founder-intelligence-systems/page.tsx` | Dedicated AIS framework page | Slug includes AIS | Decide: rename route, add 308 redirect, OR convert to internal-only banner |
| `src/app/founder-intelligence/page.tsx` | `/founder-intelligence` page | Route slug + body content reference AIS | Decide: keep as methodology entry-point, retitle copy to FIS qualified wording |
| `src/app/founder-intelligence/diagnostic/thank-you/page.tsx` | Post-diagnostic thank-you | (references AIS) | Audit + migrate |
| `src/components/Footer.tsx` | Footer (every page) | (references AIS in tagline/description) | Audit + migrate |
| `src/components/home/landing/HeroAllSignal.tsx` | Homepage hero | Hero copy references AIS | Migrate hero copy to qualified FIS™ wording |
| `src/components/home/landing/SystemModelLoop.tsx` | Homepage section | (references AIS) | Audit + migrate |
| `src/components/founder-intelligence/SystemModel.tsx` | Applied-intelligence sub-component | (references AIS) | Audit + migrate |

**Internal / config (lower priority — verify each before migrating):**

| File | Surface | Notes |
|---|---|---|
| `src/lib/site.ts` | `siteConfig.description` — leaks to OG + schema | Verify exact public-string usage; migrate the public-leaking strings |
| `src/lib/founder-intelligence/tokens.ts` | TS token mirror | Internal module name; code comments only — may stay as-is |
| `src/lib/javi/mockJaviResponses.ts` | Javi chat widget mock responses | Audit — chatbot replies count as public copy |
| `src/config/nav.ts` | Nav label / CTA copy | Verify nav text doesn't publish unqualified AIS |
| `src/app/globals.css` | CSS file comment (line 9-10: `Positioning: Founder Intelligence Systems for founder-led businesses ($250K–$5M ARR).`) | Code comment, not public output — low priority |
| `src/content/frameworks/index.ts` | Framework content store | Audit — content surfaces as public framework pages |

**Sub-flag — `$250K–$5M ARR` qualifier appears in `globals.css` comment.** Per the corrections preserved-wedge, the primary persona is qualified on signal-maturity criteria, NOT hard ARR bands. The `$250K–$5M ARR` framing should be retired in any public-facing copy that publishes it.

### 5.2 ResponseOS copy — 10 files reference ResponseOS

ResponseOS is currently published as a product name across 10 files including the dedicated route `/agents/responseos`, homepage components (`ResponseOSWedge`, `RoiLeadMagnet`), agents index, workshops, about, design tokens, and the Javi chatbot mock. ResponseOS is not explicitly in §2's entity-risk table, but:

- The corrections preserved-wedge does NOT mention ResponseOS as a public-facing product
- "Signal Revenue System" IS flagged HIGH-risk in §2 — if ResponseOS positioning relies on "Signal Revenue System" framing, that connection must be unwound
- Any ResponseOS copy that frames the offering using REMOVE-class claims from §1 (95%, 73%, 41.8M, $1.3T, 38%, 62% calls, $126K modeled, 80% podcasts) requires removal or qualification

**Files to audit (separate scoped PR):**

- `src/app/agents/responseos/page.tsx` — dedicated product page
- `src/components/home/landing/ResponseOSWedge.tsx` — homepage flagship wedge
- `src/components/home/landing/RoiLeadMagnet.tsx` — ROI calculator lead magnet
- `src/app/agents/page.tsx` — agents index
- `src/app/workshops/page.tsx` — workshops page (references ResponseOS)
- `src/app/about/page.tsx` — about page (references ResponseOS)
- `src/data/audiojones-design.ts` — design data store (references ResponseOS)
- `src/components/home/landing/index.ts` — landing barrel (exports ResponseOSWedge)
- `src/app/page.tsx` — homepage (imports ResponseOSWedge)
- `src/lib/javi/mockJaviResponses.ts` — Javi chatbot mock responses

**Cross-reference:** `docs/codex/responseos-v1-brief.md` (existing spec) — must be reviewed against §2 entity-risk before further ResponseOS implementation work.

### 5.3 REMOVE-class claims on public pages — ZERO HITS

Grep for `95%`, `73%`, `62%`, `80%` across public page files (`src/app/**/page.tsx`) returned zero hits on PUBLIC surfaces. The four files that matched these strings are admin/SLO internals only:

- `src/lib/ai/SelfHealingEngine.ts` — admin self-healing engine threshold
- `src/app/api/cron/monitoring/route.ts` — internal cron monitoring
- `src/lib/server/defaultSLOs.ts` — default SLO targets
- `src/app/api/admin/performance/route.ts` — admin performance endpoint

Plus `src/app/portal/admin/blog/edit/[id]/page.tsx:73-75` contains placeholder template text `**75% reduction** in content creation time / **280% improvement** in conversion rates / **45% increase** in revenue per content piece` — this is admin blog-editor placeholder/sample copy, NOT published anywhere public.

**Conclusion: no REMOVE-class claims (§1) currently appear on any public marketing surface.** This is a positive finding — corrections can be enforced going forward without requiring removal sweeps on existing pages.

### 5.4 §2 entity-risk names — ZERO PUBLIC HITS

Grep across `src/` for `Founder Intelligence Systems`, `Signal Revenue System`, `Persistent Business Memory`, `M.A.P. Attribution`, `Founder Revenue Leak`, `Founder Operator Under Cognitive Load` returned **zero matches**. None of the v1.0-corrections target brand names are currently published. The brand migration is greenfield in code — the corrections can land cleanly in subsequent scoped PRs without conflicting with existing published copy.

### 5.5 robots.txt + sitemap audit

Routes that would be affected by §5.1 migrations (and require sitemap + robots updates):

- `/insights/founder-intelligence-systems` (if route renamed or retired — needs 308 redirect + sitemap update)
- `/frameworks/founder-intelligence-systems` (same)
- `/founder-intelligence` + `/founder-intelligence/diagnostic` (likely keep as-is per earlier strategy — methodology pages, not public brand vehicle — but verify with terminology-decision PR)

This audit does NOT modify `robots.ts`, `sitemap.ts`, or `src/lib/site.ts`. Those updates land in the per-route migration PRs.

---

## §6 — PR Description Notes

This document is corrections-only. It does NOT modify product copy, marketing pages, or app code. Implementation of these corrections requires separate scoped PRs after user approval of each terminology change:

1. **AIS → FIS™ qualified migration PR(s)** — likely sequenced as: homepage + layout + about (single PR) → blog + insights → frameworks (with 308 redirects for route renames) → founder-intelligence pages → footer + nav copy
2. **ResponseOS audit PR** — review `docs/codex/responseos-v1-brief.md` against §2 entity-risk, decide whether ResponseOS as product name needs adjustment or qualifier
3. **Signal Revenue System rename PR** — if any internal docs/specs reference Signal Revenue System as a product name (none currently published; check `docs/codex/`, `docs/specs/`), update them
4. **Persistent Business Memory descope PR** — if any current/planned product surface uses PBM as a branded name, rewrite to descriptive use only
5. **M.A.P. Attribution spell-out PR** — replace acronym-first language with "Measurement · Attribution · Prediction" verbatim on any public surface (likely lands with the framework page rewrite)
6. **$250K–$5M ARR qualifier retirement** — sweep public surfaces for the ARR band and replace with signal-maturity criteria framing
7. **Citation hardening PR** — for the SAFE claims in §1, add primary-source citations to any page that currently publishes them

Each subsequent PR must:
- Reference this corrections doc as the canonical source for the decision
- Add the verified citation if the claim is SAFE (per §1 verification rule)
- Open as draft per `docs/governance/GIT_WORKFLOW_OPERATING_STANDARD.md`
- Squash merge per the standard
