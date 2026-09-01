# AudioJones.com Search Implementation Spec — v1.1 REDLINE

> **This is a redlined correction of Search Implementation Spec v1.0.** v1.0 existed only as pasted
> text, so its content is reproduced here inline with corrections marked.
>
> `~~Struck text~~` is removed; **bold** text is added; `⚠️ REDLINE N` blocks give the rationale.
>
> Two correction passes are folded in:
> 1. **Research-corpus audit** — the nine QuestionFinder exports were analyzed and rejected as
>    demand evidence. See redline #1.
> 2. **Reconciliation with the redlined Offer Map plan.** v1.0 was authored against the
>    *pre-redline* plan and reproduced several of its defects.
>
> Claims marked *(build-verified)* were confirmed against a local production build on 2026-09-01
> at commit `1c360b2`, inspecting the generated `robots.txt` and `sitemap.xml`.
>
> **Rebuilt 2026-09-01** after the original was lost when `~/Downloads` was emptied. Content is
> unchanged except for the build-verified confirmations now folded into §25 and §23.
>
> **No pricing or offer name is decided in this redline.**

## Redline change log

| # | Section | Change | Severity |
|---|---|---|---|
| 1 | §9, §10, §14, §38, §39 | QuestionFinder corpus rejected as demand evidence; re-acquisition protocol added as §9A | Critical |
| 2 | §25 | `robots.txt` is a merge, not a replacement; named groups do not inherit `*` rules *(build-verified)* | Critical |
| 3 | §4, §26 Wave 0 | Wave 0 inherits the matrix's own ten open commercial decisions | Critical |
| 4 | §5, §19, §26 Waves 3/6 | `proofAssetPaths` added; family hubs gated on named proof | High |
| 5 | §35 | Test intents mapped to CI workflows that can actually execute them | High |
| 6 | §13 | `/diagnostic` does not exist; live content surfaces added to the disposition set | Medium |
| 7 | §4, §5 | "Revenue Leak" name collision and price-display convention surfaced as decisions | Medium |
| 8 | §5 | `displayConvention` field added; Zod flagged as a dependency change | Medium |
| 9 | §27, §28 | Rejected-corpus quarantine path and export provenance fields | Medium |
| 10 | §3, §8, §9A | Matrix authority scoped to structure; DataForSEO becomes the primary question source | Medium |

---

**Status:** ~~Implementation-ready specification~~ **Corrected. Sections 9, 10, 14, 38, and 39 are BLOCKED pending question-data re-acquisition; all other sections are implementation-ready.**
**Purpose:** Convert the Search Intelligence program, Master Pricing Matrix, Offer Map, DataForSEO research, ~~QuestionFinder research,~~ Firecrawl evidence, and first-party data into a governed implementation system for `audiojones.com`.
**Production authorization:** **None.** Route changes, public pricing changes, redirects, GBP changes, merges, and deployments remain separately approval-gated.

---

# 1. Operating architecture

```text
MASTER PRICING MATRIX
        ↓
CANONICAL OFFER REGISTRY
        ↓
SEARCH INTELLIGENCE
  ├─ DataForSEO          ← primary question + volume source
  ├─ QuestionFinder      ← corroboration only, pending re-qualification (§9)
  ├─ Firecrawl
  ├─ GSC
  ├─ GBP
  └─ Customer language
        ↓
QUERY OPPORTUNITY REGISTER
        ↓
QUERY → OFFER → PAGE MAP
        ↓
PAGE IMPLEMENTATION BRIEFS
        ↓
Next.js / Sanity implementation
        ↓
Internal linking + JSON-LD
        ↓
Sitemap + offers.json + llms.txt
        ↓
Preview crawl / QA
        ↓
Approved deploy
        ↓
GSC / GBP / conversion measurement
        ↓
KAIZEN
```

The Master Pricing Matrix is the commercial source of truth. It explicitly distinguishes productized ResponseOS from bespoke conversational-AI implementation and separates diagnostics from implementation and recurring management.

---

# 2. Core implementation doctrine

```text
MARKET CATEGORY → BUYER PROBLEM → RECOGNIZABLE SOLUTION → AUDIO JONES OFFER / IP → BUSINESS RESULT
```

```text
AI receptionist for contractors
        ↓
Missed calls / after-hours inquiries / slow response
        ↓
AI receptionist + lead qualification + booking
        ↓
ResponseOS
        ↓
More captured and recovered opportunities
```

```text
SEO for contractors
        ↓
Not getting found / weak Maps visibility / poor inbound pipeline
        ↓
SEO + Local SEO + GBP + AEO
        ↓
AJ Search / Visibility System
        ↓
Qualified inbound demand
```

Proprietary language such as **ResponseOS, Founder Intelligence, Business Memory, ReKonr and M.A.P.** remains differentiation/IP. It does not need to carry the entire search-acquisition burden.

> **Note:** both chains above are *product hypotheses*, not research findings. Neither is currently
> supported by acquired demand evidence — see redline #1. They are reasonable and probably correct;
> they must still pass Gate A before driving a page.

---

# 3. Source-of-truth hierarchy

| Priority | Source | Governs |
| -------- | ------ | ------- |
| 1 | Approved commercial decisions | What can actually be sold |
| 2 | Master Pricing Matrix | Offer identity, scope, price status, lifecycle |
| 3 | Canonical offer registry | Runtime representation of approved commercial truth |
| 4 | Search Intelligence findings | How buyers discover and describe offers |
| 5 | Existing website | Current implementation, not necessarily canonical truth |
| 6 | Historical strategy/docs | Evidence/history only |

> ⚠️ **REDLINE 10 — scope of the matrix's authority (priority 2).**
> The matrix's closing section claims that its **structure** is canonical, and tags each price with
> an evidence status. Treating the whole document as settled promotes a "market-calibrated working"
> figure to fact. **Adopt the structure as canonical; adjudicate each price against its stated
> evidence status.**
>
> **A fourth precedence rule is required: within priority 4, a finding is admissible only if its
> provenance is recorded and its source has passed acquisition QA (§9A). Unattributed or
> unqualified research data ranks below priority 6 — it is not evidence.**

---

# 4. Phase 0 — Commercial truth reconciliation

## Required fields

| Field | Example |
| ----- | ------- |
| Offer ID | `R3` |
| Canonical name | Business Memory Diagnostic |
| Family | business-memory |
| Stage | diagnostic |
| Public? | yes |
| Price visibility | public-fixed |
| Public price | $3,500 |
| Internal corridor | $2,500–$5,000 |
| Canonical route | `/solutions/diagnostics/business-memory` |
| CTA | Apply / Book Diagnostic |
| Prerequisite | none |
| Follow-on | Business Memory Foundation / Core |
| Managed follow-on | M5 |
| Indexable | yes |
| **Proof asset** | **Named case study or evidence page this offer can link — blank blocks indexing** |
| **Display convention** | **corridor-floor \| anchor — must be identical across all offers** |

Visibility states: `public-fixed` · `public-from` · `public-scoped` · `private-corridor` · `internal-allocation`

### Specific commercial decisions that must be frozen

**ResponseOS:** retain two explicitly different tracks:

```text
PRODUCTIZED RESPONSEOS          vs.    BESPOKE AI RECEPTIONIST SYSTEM
$797 / $1,297 / $1,997 setup           professional implementation
$397 / $797 / $1,297 monthly           target context ≈ $34,500
```

Do not collapse them into one offer.

**Note:** the matrix states tier names, included minutes, integrations, support limits, and overage
methodology **must be finalized before public publication**. The two-track decision does not by
itself unblock publishing the productized tiers.

**Business Memory:** distinguish Business Memory Diagnostic · Foundation · Core AI-Ready Business Knowledge System · Complex Business Memory · Integrated Founder Intelligence / RAG.

**The matrix contradicts itself on Core.** BM1–BM11 sum to a stated **$25,000 "Core Business Memory
target"**; the package table lists **Core at a $15,000–$25,000 corridor, typical $15,000–$20,000**.
One must govern before this split can execute.

> ⚠️ **REDLINE 7 — two decisions v1.0 omitted, and they are coupled.**
>
> **a) "Revenue Leak" is claimed by two products.** Matrix R2 is titled *"ReKonr Revenue **Leak**
> Diagnostic."* The live site has both a "ReKonr Revenue **Recovery** Diagnostic" ($3,500) and a
> separate "Revenue **Leak** Assessment" ($1,997). §26 Wave 4 and §38 both queue "Revenue Leak
> diagnostic" work without resolving which offer that names.
>
> **b) The public price-display convention is unset.** The live "From $3,500" is the floor of R2's
> $3,500–$6,500 corridor; the matrix anchor is $4,500. Both are true. This is a display-convention
> choice, not a price conflict — and it must be made once and applied to all offers, or HTML,
> JSON-LD, and `/offers.json` will disagree in ways the §35 parity tests flag as failures.
>
> Decide (a) and (b) in one sitting. Each constrains the other.

> ⚠️ **REDLINE 3 — Wave 0 must inherit the matrix's own open-decisions list.** See §26.

---

# 5. Canonical offer registry

Create `src/content/offers.ts`.

```ts
type OfferVisibility =
  | "public-fixed"
  | "public-from"
  | "public-scoped"
  | "private-corridor"
  | "internal-allocation";

type OfferStage =
  | "assessment"
  | "diagnostic"
  | "architecture"
  | "foundation"
  | "implementation"
  | "managed";

interface Offer {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  family:
    | "diagnostics"
    | "digital-foundation"
    | "revenue-systems"
    | "business-memory"
    | "ai-systems"
    | "custom-operations"
    | "managed-operations";
  stage: OfferStage;
  summary: string;
  problem: string;
  decisionAnswered?: string;
  desiredOutcome: string;
  audiences: string[];
  pricing: {
    currency: "USD";
    display: string;
    min?: number;
    max?: number;
    recurring?: number;
    billingModel:
      | "free"
      | "one_time"
      | "monthly"
      | "one_time_plus_monthly"
      | "scoped";
    visibility: OfferVisibility;
    // ADDED — records which display rule (§4 decision b) this record follows,
    // so parity tests can verify convention, not just the number.
    displayConvention: "corridor-floor" | "anchor";
  };
  pagePath?: string;
  public: boolean;
  indexable: boolean;
  prerequisiteOfferIds: string[];
  followOnOfferIds: string[];
  relatedResourcePaths: string[];
  // ADDED — enforces the proof gate. A contract test fails any record with
  // indexable: true and an empty proof array. See redline #4.
  proofAssetPaths: string[];
  primaryCTA: {
    label: string;
    href: string;
  };
  schemaTypes: string[];
  evidenceStatus:
    | "established"
    | "market-calibrated"
    | "scoped"
    | "internal";
  updatedAt: string;
}
```

> ⚠️ **REDLINE 8 — two implementation constraints.**
>
> **Zod is not a current dependency.** Adding it is a dependency change requiring separate approval.
> The contract this registry needs is expressible with plain TypeScript types plus assertion helpers
> in the existing `node:test` files.
>
> **The legacy catalog is not superseded.** `data/catalog/services_pricing_catalog.json` covers
> podcast production, media systems, and personal-brand services — families the matrix explicitly
> lists as *not yet priced in this systems matrix* and pending separate integration. Mark it
> non-authoritative for systems offers and exclude it from `/offers.json` and the sitemap, but
> retain it. Superseding it deletes the only pricing record for those families.

---

# 6. Public offer-map architecture

```text
/solutions
├── /solutions/diagnostics
├── /solutions/digital-foundation
├── /solutions/revenue-systems
├── /solutions/business-memory
├── /solutions/ai-systems
├── /solutions/custom-operations
└── /solutions/managed-operations
```

Do **not** place all seven in primary navigation. Primary navigation continues routing buyers through Home / Solutions / Pricing / About / Resources / Contact.

---

# 7. Search Intelligence → implementation bridge

```text
SEED
↓
ACQUISITION QA                    ← ADDED (§9A). Rejects fabricated or degenerate exports
↓                                    before they enter the pipeline.
DataForSEO quantitative evidence
↓
Question expansion (DataForSEO PAA primary; QuestionFinder corroboration only)
↓
SERP classification
↓
Firecrawl competitor extraction
↓
ICP / problem / intent analysis
↓
Query Opportunity Register
↓
Page disposition
↓
Implementation brief
```

> ⚠️ **REDLINE 1 (structural).** v1.0 had no step that could reject a bad export. The nine
> QuestionFinder files passed straight into §38's P0 "normalize" task. Acquisition QA is the
> missing gate.

---

# 8. DataForSEO integration

## Parent keyword validation

```text
POST /v3/keywords_data/google_ads/search_volume/live
```

Collect: search volume, CPC, competition, competition index, monthly history, bid range.

## Keyword expansion

```text
POST /v3/keywords_data/google_ads/keywords_for_keywords/live
```

Use thematic groups instead of giant keyword dumps.

## SERP validation

```text
POST /v3/serp/google/organic/live/regular
```

Collect: ranking URLs, page types, SERP features, local-pack presence, PAA, paid density, dominant intent, competitor composition.

**The `people_also_ask` block returned by this endpoint is now the primary source of buyer
questions**, replacing the QuestionFinder corpus. It is real, attributable, and arrives with the
SERP context needed for classification.

## Local controls

Run major commercial queries twice: United States, and Miami, Florida. Do not equate Miami volume with justification for a Miami landing page.

---

# 9. ~~QuestionFinder integration~~ **QuestionFinder — corpus rejected, source unqualified**

> ⚠️ **REDLINE 1 — CRITICAL. The nine collected exports are not usable as demand evidence.**
>
> **Finding.** Six of the nine files are a single generic question template with the seed string
> substituted in and the volumes randomized:
>
> ```text
> baseline: questionfinder-ai-receptionist.csv  (102 rows)
>
> Template identity (same wording AND same row position):
>   102/102  ai-automation-for-service-businesses
>   102/102  business-automation-miami
>   102/102  ai-consultant-miami
>   102/102  google-business-profile-optimization-miami
>   102/102  ai-search-optimization-for-small-business
> ```
>
> All 102 questions identical, in identical order, across all six files. Volumes jittered 17–27%
> around a shared base — row 1 is "how much does {SEED} cost" at
> 5100 / 4548 / 3961 / 4277 / 4009 / 4881.
>
> The template is a home-services/trades FAQ scaffold. Substituted, it yields 84 category-alien
> questions: *"does medicare cover AI receptionist"* (1,175/mo), *"is Google Business Profile
> optimization Miami covered by insurance"* (1,983/mo), *"AI search optimization for small business
> building code requirements,"* *"permits required for AI consultant Miami,"* *"energy-efficient ai
> receptionist,"* *"AI automation for service businesses for landlords."*
>
> **Second failure shape.** The three Miami SEO files are all `volume=0, signal=100`. The questions
> look like genuine PAA scrapes, but the seed's specificity is gone — only 1–2 rows per file retain
> the "Miami" qualifier, and the three heavily overlap. A large share are practitioner/job-seeker
> intent: *"Is SEO a good career path?", "Are SEO jobs still in demand?", "Which country is the best
> for finding SEO jobs?", "Is there a free SEO course available?"* Across all three files, **two
> unique questions carry buyer intent** — "How much does SEO cost in Miami?" and "What is the best
> SEO company in Miami?" — with no volume on either.
>
> **The inversion is the operative risk.** The real Miami data shows almost nothing. The synthetic
> Miami data shows "how much does business automation Miami cost — 3,961/mo." Read without this
> check, the corpus makes the local wedge look validated. It is the fabricated files carrying the
> local signal.
>
> **Scope of the claim.** These *exports* are unusable. Whether QuestionFinder always behaves this
> way, hit a fallback on unrecognized B2B seeds, or something else generated the files is unknown —
> the two distinct failure shapes suggest two modes. Re-qualify the tool before using it again
> (§9A), rather than concluding anything about it from here.

## Disposition

```text
STATUS:    REJECTED as demand evidence
ROWS USABLE IN THE QUERY OPPORTUNITY REGISTER: 0
ACTION:    quarantined per §27; re-acquire per §9A
```

**Quarantined 2026-08-31 to `data/search-intelligence/raw/rejected/questionfinder-2026-08-31/`
with a rejection README, SHA-256 inventory, and a `verify-rejection.cjs` script that reproduces the
finding and exits 1. Committed at `c4ea697`.**

~~That is sufficient to begin cross-cluster analysis; do not wait until hundreds of arbitrary seeds have been exported.~~

**Cross-cluster analysis across these files would actively make things worse.** Six copies of one
template "confirming" the same questions six times reads as convergent evidence. Clustering is the
step that would launder the fabrication into apparent validation.

**Retained from v1.0 and still correct:** QuestionFinder volume, Google Signal, and buyer-intent
scores are separately attributed heuristics and must never replace DataForSEO's canonical
quantitative fields. That rule was right; it was simply not strong enough — the questions
themselves, not only the scores, failed.

---

# 9A. **Question re-acquisition protocol (new)**

**Primary source.** DataForSEO `serp/google/organic/live/regular` → `people_also_ask`, plus
`keywords_for_keywords/live` on the parent seeds.

**Acquisition QA — every batch, every source, before normalization:**

1. **Template-collision test.** Strip the seed from each question; compare the resulting template
   list across ≥2 seeds in the batch. **>60% positional identity fails the batch.**
2. **Domain-plausibility scan.** Reject batches containing category-alien questions — insurance,
   Medicare, permits, building codes, warranties, equipment, seniors/landlords — for a B2B software
   or services seed.
3. **Volume-distribution check.** Reject an all-zero batch, and reject one whose per-row spread
   across unrelated seeds is under ~30%.
4. **Seed-fidelity check.** Reject when the seed's qualifiers ("for contractors", "Miami") are
   absent from the returned questions.
5. **Provenance stamp.** Record tool, endpoint, run date, operator, location/language, and QA
   verdict. **A batch with no provenance record is inadmissible under §3.**

**A reference implementation of tests 1–4 exists** at
`data/search-intelligence/raw/rejected/questionfinder-2026-08-31/verify-rejection.cjs`.

**QuestionFinder re-qualification.** Before further use: one manual re-run on a known-good seed,
compared against the corresponding DataForSEO PAA set. If the template reappears, the tool is
retired for this program. If not, QuestionFinder is admitted as **corroboration only** — it may
confirm a question DataForSEO also returned; it may never originate a register row.

---

# 10. Question classification

Every question row receives `TOFU` / `MOFU` / `BOFU` plus a **content role**.

> ⚠️ **REDLINE 1 (examples).** The worked examples below cite questions that **do not exist in the
> collected corpus**. Grep across `questionfinder-ai-receptionist.csv` returns zero hits for
> "book appointments," "answering service," "CRM," "missed call," "after-hours," "qualification,"
> and "Spanish." They are retained as *format illustrations only*.

## Example — ResponseOS **(illustrative format; not corpus-derived)**

```text
how much does AI receptionist for contractors cost
→ Stage: BOFU | Intent: commercial investigation | Cluster: cost/pricing
  Offer: ResponseOS | Potential page: primary ResponseOS page OR cost page

can an AI receptionist book appointments
→ Stage: MOFU | Intent: capability evaluation | Cluster: booking/capability
  Role: primary ResponseOS page section / FAQ

why are contractors missing calls
→ Stage: TOFU | Intent: problem awareness | Cluster: missed-call leakage
  Role: insight / Revenue Leak diagnostic / calculator
```

---

# 11. Query Opportunity Register

Path: `docs/search-intelligence/QUERY_OPPORTUNITY_REGISTER.md` (plus JSON/CSV alongside).

| Field | Meaning |
| ----- | ------- |
| Opportunity ID | Stable identifier |
| Parent seed | Research origin |
| Exact query | Keyword/question |
| Source | DFS / QF / GSC / GBP / customer |
| **Acquisition batch ID** | **Provenance link to the §9A QA record — required** |
| **QA verdict** | **PASS only. A row from a failed batch may not be entered.** |
| Search volume | Provider-labelled |
| CPC · Competition | DFS |
| QF volume · Google Signal · Buyer intent score | QuestionFinder only |
| SERP intent | Commercial/informational/local/etc |
| ICP · Vertical | Contractor/service business; HVAC/plumber/etc |
| Problem · Desired outcome | Business pain; what buyer wants |
| Offer | Canonical Offer ID |
| Existing URL · Proposed URL | If any / if necessary |
| Content role | Page/section/FAQ/tool/article |
| Commercial fit · ICP fit · Right-to-win | 1–5 |
| Evidence confidence · Competitive burden · Maintenance burden | 1–5 |
| Decision state | WATCH/TEST/BUILD/etc |

**The register currently contains zero admissible rows.** No row from the nine quarantined
QuestionFinder exports may be entered.

---

# 12. Opportunity promotion gate

A query does **not** create a page. It must satisfy enough of:

```text
distinct intent
commercial relevance
ICP fit
economic pain
credible Audio Jones offer
SERP evidence
sufficient content substance
non-duplication with existing page
maintainability
available proof asset        ← ADDED, see redline #4
```

Outcomes: `EXISTING PAGE — optimize` · `EXISTING PAGE — expand` · `SECTION` · `FAQ` · `COMPARISON PAGE` · `COST / PRICING PAGE` · `CALCULATOR` · `DIAGNOSTIC` · `SUPPORTING ARTICLE` · `NEW MONEY PAGE` · `IGNORE`

---

# 13. Page disposition matrix

States: `KEEP` · `OPTIMIZE` · `EXPAND` · `REPURPOSE` · `CONSOLIDATE` · `REDIRECT` · `NOINDEX` · `CREATE` · `HOLD`

```text
/solutions
/services
/agents
/agents/responseos
/ai-readiness-diagnostic
/founder-intelligence/diagnostic
/founder-gravity-audit
~~/diagnostic~~
/founder-gravity-audit/diagnostic     ← corrected
```

> ⚠️ **REDLINE 6.** There is no top-level `/diagnostic` route in `src/app`. The two diagnostic
> sub-routes are `/founder-gravity-audit/diagnostic` and `/founder-intelligence/diagnostic`, both
> build-verified present in the generated sitemap.
>
> **The disposition sweep must also cover these live indexed surfaces, omitted from v1.0 and all
> build-verified in the sitemap:**
>
> ```text
> /case-studies    /insights    /frameworks    /blog    /workshops    /roi-calculator    /apply
> ```
>
> `/apply` is in the sitemap and every pricing CTA routes to it with UTM parameters — confirm no
> campaign depends on its indexation before removing it.

No redirect occurs until backlinks, traffic, campaigns, forms, and analytics destinations are checked.

---

# 14. Priority implementation wedge #1 — ResponseOS

> ⚠️ **REDLINE 1 (wedge status).** This wedge is **product hypothesis, not research finding.** None
> of the concepts, problem clusters, or decision clusters below appear in the collected corpus.
> **Status: HOLD until §9A acquisition returns real questions for these clusters.** Everything below
> is retained as the hypothesis to test, not the conclusion to build.

## Primary acquisition concepts **(hypothesis — validate via §9A)**

```text
AI receptionist · AI receptionist for contractors · AI receptionist for service businesses
AI answering service · virtual receptionist · after-hours answering · missed-call automation
```

## Problem clusters **(hypothesis)**

```text
missed calls · after-hours inquiries · slow lead response · unqualified calls
missed estimate requests · manual appointment booking · poor handoff · leads going cold
```

## Decision-stage clusters **(hypothesis)**

```text
cost · pricing · ROI · AI receptionist vs answering service · AI vs human receptionist
integrations · booking · CRM · implementation · languages · limitations
```

## Primary page

Initially `/agents/responseos`. Preserve it until migration is separately justified. Future canonical candidate `/solutions/ai-systems/responseos`, only with an approved 308 plan.

## ResponseOS page requirements

```text
H1: AI Receptionist for Service Businesses
Opening: Direct explanation of the problem and outcome.
Sections:
1. What ResponseOS is          10. Integrations
2. Who it is for               11. Pricing / commercial model
3. What happens on a call      12. AI receptionist vs answering service
4. Qualification               13. Implementation process
5. Appointment booking         14. Limitations / escalation
6. CRM routing                 15. ROI / missed-call economics
7. Missed-call recovery        16. FAQ
8. After-hours handling        17. CTA
9. Languages
```

Do not finalize the exact H1 before DataForSEO/ICP comparison is complete. **Section 11 (pricing)
additionally depends on the matrix's ResponseOS tier decision, which is not yet closed.**

---

# 15. Priority implementation wedge #2 — SEO / Local SEO / AEO

```text
SEO for contractors · contractor SEO · local SEO · local SEO for service businesses
local SEO Miami · SEO consultant Miami · Google Business Profile optimization
AI search optimization · AEO
```

**Evidence status: none.** The three Miami exports covering this wedge yielded two usable questions,
both zero-volume (§9). This wedge has less supporting evidence than any other, and the fabricated
Miami files make it look better-supported than it is. **Re-acquire before scoping.**

## Recommended architecture if evidence survives

```text
/solutions/digital-foundation → SEO/AEO commercial surface
→ R5 SEO/AEO Visibility Diagnostic → A7 SEO/AEO Foundation → M4 SEO/AEO & Local Visibility Management
```

Much stronger than selling an undifferentiated monthly "SEO package."

---

# 16. Priority implementation wedge #3 — AI automation / operations

Research clusters **(hypothesis — the corresponding exports were rejected in §9)**:

```text
AI automation for service businesses · AI automation for small businesses · business automation
workflow automation · business process automation · automation consultant · AI consultant
```

Map into: `R1` · `R4` · `R8` · `A4` · Custom AI implementation · `M3` · `M8` · `M9`.

The page should not promise generic "AI transformation." It should explain: current workflow → manual failure → data/system constraint → automation opportunity → required architecture → implementation → governance → measurement.

---

# 17. Business Memory search integration

Do not rely primarily on **Business Memory** as a search term. Research acquisition language such as:

```text
AI knowledge base for business · business knowledge management · SOP management
company knowledge base · AI-ready knowledge base · organizational knowledge management
business process documentation · founder knowledge capture
```

Then map demand to: `R3` → Foundation → Core → Founder Intelligence/RAG → `M5`.

**No exports exist for these seeds.** This wedge is unresearched rather than mis-researched — which
makes it the cleanest candidate for the first §9A acquisition run.

---

# 18. Tool / freemium architecture

| Priority | Tool | Flow |
|---|---|---|
| 1 | Missed Call Revenue Calculator | search → calculator → estimated leakage → R6 or R2 → ResponseOS |
| 2 | SEO ROI Calculator | inputs → projected economics → R5 → A7 / M4 |
| 3 | AI Automation ROI Calculator | manual hours + labor + errors → opportunity → R1 / R4 → implementation |

Tools should collect structured information that improves qualification, not merely email addresses.

**Note:** "validated commercial questions" is a real precondition; no tool here currently has one.
**A calculator is also a legitimate proof asset under §12's proof gate** — original, useful, and
requiring no client to go on the record. That makes Wave 5 a candidate to move ahead of Wave 3 if
named case studies stay unavailable.

---

# 19. Internal linking implementation

```text
ResponseOS:       Missed-call article → Missed Call Calculator → AI Receptionist Feasibility
                  → ResponseOS → Managed ResponseOS
SEO:              SEO insight → SEO/AEO Visibility Diagnostic → SEO/AEO Foundation → Managed SEO/AEO
Business Memory:  knowledge-management article → BM Diagnostic → BM Foundation/Core → Managed BM
Automation:       workflow problem article → AI Readiness / Digital Foundation Diagnostic
                  → Automation Implementation → Automation Management / M9
```

Every indexed commercial page must have:

* one contextual inbound link beyond nav/footer,
* one parent/hub link,
* one logical next-step link,
* ~~one evidence/proof link where appropriate.~~ **one evidence/proof link — required, not "where appropriate," for any page carrying a price or an apply CTA.**

> ⚠️ **REDLINE 4.** `/case-studies` renders anonymous cards with no client names, no named outcomes,
> and **no `/case-studies/[slug]` detail routes**. Total long-form inventory is 7 insight and 4
> framework detail pages (build-verified). Every chain above terminates in a proof link that has no
> page behind it.
>
> **Resolve one way or the other in Wave 0:** either produce case-study detail routes as a Wave 3
> prerequisite, or formally relax the contract to accept an insight/framework/calculator as the
> evidence link.

---

# 20. Page implementation brief

```text
Canonical URL:              Proof required:
Offer ID:                   Proof asset path:          ← ADDED — must resolve to a real page
Primary query:              Pricing treatment:
Secondary cluster:          Display convention:        ← ADDED — must match the registry
ICP:                        CTA:
Vertical:                   Internal links in:
Geo:                        Internal links out:
Pain:                       Schema:
Desired outcome:            Canonical:
Search intent:              Indexability:
Current ranking evidence:   Measurement events:
Acquisition batch ID:       Success threshold:         ← ADDED — provenance for the primary query
Competitor pattern:         Reversal condition:
Title: / H1: / Meta description:
Page purpose:
Direct-answer paragraph:
Sections:
Questions to answer:
```

**A brief with an unresolved proof asset path or a missing acquisition batch ID is not ready to
hand off.**

---

# 21. Content-generation rule

```text
QUERY CLUSTER + BUYER STAGE + OFFER + SEARCH INTENT + CUSTOMER LANGUAGE
+ FIRSTHAND EXPERTISE + SERP GAP + CTA
```

> ⚠️ **REDLINE 1 (downstream).** `CUSTOMER LANGUAGE` is an input to every brief. Sourcing it from
> the rejected corpus would propagate fabricated phrasing into production copy — a failure that
> becomes invisible, because it reads as normal marketing prose. Until §9A completes, customer
> language must come from real sources only: GSC queries, GBP queries, sales-call transcripts,
> intake forms, and DataForSEO PAA.

---

# 22. Structured-data contract

Stable entity IDs: `#organization` · `#person` · `#website`. Page entities: `#webpage` · `#service` · `#offer`.

| Page | Schema |
| ---- | ------ |
| Homepage | Organization + Person + WebSite + WebPage |
| `/solutions` | CollectionPage + ItemList + BreadcrumbList |
| Family hub | CollectionPage/WebPage + ItemList + BreadcrumbList |
| Service/offer | Service + Offer where public + WebPage + Breadcrumb |
| Pricing | ItemList + Service + Offer + FAQ where visible |
| Diagnostic | Service + Offer + FAQ where visible |
| Insight | Article + Breadcrumb |
| Defined framework | DefinedTerm + Article/WebPage |

Never publish: internal corridors · fake AggregateRating · unverified statistics · hidden FAQs · schema-only claims.

**Note:** `speakableSpec()` is already implemented and exported from `src/lib/seo/schema.ts`.

---

# 23. Sitemap integration

Generate from registry + content source. Include only `200` + canonical + indexable + public. Exclude apply steps, thank-you pages, portal, ops, admin, API, redirects, noindex, duplicate funnels.

Do not assign `new Date()` to every page on each sitemap generation. Use real modification dates or omit them.

**Build-verified 2026-09-01: the generated sitemap contains 32 URLs — 21 static + 4 framework + 7
insight detail pages — and all 32 carry an identical `<lastmod>` equal to the build timestamp
(`2026-09-01T12:19:19.515Z`). `/apply` is present. Both defects are observable in output, not only
in source.**

---

# 24. AI-readable endpoints

## `/offers.json`

```json
{
  "schemaVersion": "1.0",
  "updatedAt": "2026-09-01",
  "offers": [
    {
      "id": "R3",
      "name": "Business Memory Diagnostic",
      "family": "business-memory",
      "stage": "diagnostic",
      "summary": "...",
      "price": "$3,500",
      "url": "https://www.audiojones.com/solutions/diagnostics/business-memory"
    }
  ]
}
```

Never include private price corridors, margin targets, internal allocations, or proposal strategy.

**Filter `private-corridor` and `internal-allocation` records at serialization time in the public
view helper, not at authoring time, so a mis-tagged record fails closed rather than leaking.**

## `/llms.txt`

Entity definition · canonical Solutions · canonical Diagnostics · primary products · pricing · resources · evidence/case studies · contact · last updated.

Supplemental. Crawlable HTML + sitemap + internal links + structured data remain primary.

---

# 25. Robots policy

> ⚠️ **REDLINE 2 — CRITICAL. v1.0 reproduced the pre-redline replacement block.**
> The generated `robots.txt` — build-verified 2026-09-01 — carries **sixteen** disallow lines.
> v1.0's block has three. Applying it as written would expose `/uploader`, `/env`, `/status`,
> `/not-authorized`, `/test-slack`, `/consent-testimonial`, `/business`, `/creators`, `/artisthub`,
> `/(site)/artist-hub`, `/(site)/epm`, and `/portal/admin/` to every crawler.
>
> **Second, subtler defect:** a named user-agent group does **not** inherit the `*` group's
> disallows. robots.txt matching selects the single most specific matching group and applies only
> that group's rules. An `OAI-SearchBot` group with bare `Allow: /` therefore *widens* that
> crawler's access — even if every other disallow is preserved.
>
> **The only intended change is adding the OAI-SearchBot group. The disallow set must not shrink.**

~~Recommended:~~ **Recommended (complete — mirrors the build-verified output plus the new group):**

```text
User-agent: *
Allow: /
Disallow: /portal/
Disallow: /ops/
Disallow: /api/
Disallow: /test-slack
Disallow: /uploader
Disallow: /env
Disallow: /not-authorized
Disallow: /status
Disallow: /consent-testimonial
Disallow: /business
Disallow: /creators
Disallow: /artisthub
Disallow: /(site)/artist-hub
Disallow: /(site)/epm
Disallow: /portal/admin/

User-agent: OAI-SearchBot
Allow: /
Disallow: /portal/
Disallow: /ops/
Disallow: /api/
Disallow: /test-slack
Disallow: /uploader
Disallow: /env
Disallow: /not-authorized
Disallow: /status
Disallow: /consent-testimonial
Disallow: /business
Disallow: /creators
Disallow: /artisthub
Disallow: /(site)/artist-hub
Disallow: /(site)/epm
Disallow: /portal/admin/

User-agent: GPTBot
Disallow: /

Sitemap: https://www.audiojones.com/sitemap.xml
```

**Simpler alternative: omit the OAI-SearchBot group entirely.** The `*` group already permits it, so
the group adds no access — only an explicit policy statement, at the cost of a duplicated list that
will drift. If kept, add a contract test asserting the two lists stay identical.

Treat GPTBot training preference independently from ChatGPT Search visibility. Also verify Cloudflare does not block OAI-SearchBot's published IP ranges.

---

# 26. Implementation waves

## Wave 0 — Commercial truth

No public changes. Complete: pricing reconciliation · ResponseOS two-track model · offer visibility · route ownership · CTA ownership.

**Plus — close or explicitly defer with a stated reason, each of the matrix's ten open decisions:**

```text
 1. Public names and included usage for the three ResponseOS tiers
 2. Whether diagnostic fees are credited toward implementation
 3. Final SLA tiers and response-time commitments
 4. Included monthly capacity for M1–M10
 5. Pass-through billing administration fee
 6. Bundled-usage and overage methodology (telephony, SMS, AI models, storage)
 7. M9's canonical capacity model
 8. South Florida quote validation for R3, R4, R5, R6, R8, R9
 9. Final public-versus-internal visibility status for each price
10. Disposition of podcast, media, and personal-brand families not in the systems matrix
```

**Plus three decisions this spec adds:**

```text
11. Which product owns the name "Revenue Leak" (§4)
12. The public price-display convention: corridor floor or anchor (§4)
13. Whether §19's proof-link contract is enforced or relaxed (§19)
```

**Plus resolve the matrix-internal Core Business Memory contradiction ($25,000 vs $15,000–$20,000).**

> ⚠️ **REDLINE 3.** Items 3, 4, and 6 are publication-blocking for the managed retainers this
> program intends to price publicly. Item 1 blocks the ResponseOS tier decision in either direction.

## **Wave 0B — Research re-acquisition (new, blocking for Waves 4–7)**

```text
quarantine the nine rejected exports (§27)          ← DONE 2026-08-31, commit c4ea697
re-qualify or retire QuestionFinder (§9A)
run DataForSEO parent-seed + PAA acquisition on all wedge seeds
apply acquisition QA to every batch
build the first admissible Query Opportunity Register
```

**Runs in parallel with Wave 0 — blocks nothing in Waves 1–3.**

## Wave 1 — Infrastructure

Build `offers.ts`, registry types/helpers, schema builders, public pricing view, tests. **Unblocked today; the correct place to start.**

## Wave 2 — Existing high-value pages

Optimize `/` · `/solutions` · `/pricing` · `/agents/responseos` · `/resources` · existing diagnostic pages.

**Caveat: "optimize" means registry integration, internal linking, and schema — not search-driven
copy rewrites, which depend on Wave 0B.**

## Wave 3 — Family hubs

Build the seven `/solutions/*` hubs. **Each ships with `proofAssetPaths` populated. A hub with no
proof source ships `noindex` as a navigational stub, or waits — per the Wave 0 item 13 decision.**

## Wave 4 — Evidence-backed acquisition pages

**BLOCKED until Wave 0B produces an admissible register.**

Likely first candidates **(hypotheses, not validated)**: ResponseOS / AI receptionist · SEO for contractors · SEO/AEO diagnostic · Business Memory diagnostic · Revenue Leak diagnostic.

Local SEO Miami remains evidence-gated. **Now known to have essentially zero supporting evidence.**

## Wave 5 — Tools

Missed Call Revenue Calculator · SEO ROI Calculator · Automation ROI Calculator.

**Consider promoting ahead of Wave 3** — calculators are original proof assets that can satisfy the
§19 contract that currently has nothing behind it.

## Wave 6 — Supporting authority

Comparisons, FAQs, cost content, case studies, original research, expert resources.

**If Wave 0 item 13 keeps the proof contract as written, the case-study portion is a Wave 3
prerequisite and moves earlier.**

## Wave 7 — Vertical/local expansion

Only after performance proves the system. No mass location-page program.

---

# 27. Data storage architecture

```text
docs/search-intelligence/
├── SEARCH_INTELLIGENCE_PRD.md          ├── COMPETITOR_GAP_ANALYSIS.md
├── SEARCH_IMPLEMENTATION_SPEC.md       ├── PAGE_INTENT_MAP.md
├── CURRENT_SITE_INVENTORY.md           ├── LOCAL_SEARCH_ARCHITECTURE.md
├── ICP_LANGUAGE_MATRIX.md              ├── AEO_ENTITY_ANSWER_ARCHITECTURE.md
├── KEYWORD_SEED_REGISTER.md            ├── CONTENT_CLUSTER_MAP.md
├── DATAFORSEO_EXECUTION_SPEC.md        ├── EXPERIMENT_REGISTER.md
├── QUESTIONFINDER_EXECUTION_SPEC.md    ├── FINDINGS_AND_DECISIONS.md
├── QUERY_OPPORTUNITY_REGISTER.md       └── IMPLEMENTATION_PLAN.md
├── CUSTOMER_LANGUAGE_CORPUS.md
└── ACQUISITION_QA_LOG.md               ← ADDED: one record per batch, per §9A

data/search-intelligence/
├── raw/
│   ├── dataforseo/  questionfinder/  firecrawl/  gsc/  gbp/
│   └── rejected/                     ← ADDED
│       └── questionfinder-2026-08-31/    ← EXISTS, commit c4ea697
│           ├── README.md                 rejection record + SHA-256 inventory
│           ├── verify-rejection.cjs      reproduces the finding, exits 1
│           ├── .gitattributes            *.csv -text, keeps hashes stable
│           └── (the nine original CSVs, unmodified)
├── normalized/   queries.json · questions.json · serps.json · pages.json
└── outputs/      opportunities.json · page-map.json
```

Raw data never gets manually rewritten. Normalized data is derived. Canonical decisions live in `docs/`.

**Rejected data is quarantined, never deleted** — the rejection itself is evidence, and the files
document a failure mode worth recognizing again.

---

# 28. Naming convention for QuestionFinder exports

~~`qf__<seed-slug>__YYYY-MM-DD.csv`~~ **`<source>__<seed-slug>__<YYYY-MM-DD>__<qa-verdict>.csv`**

```text
dfs__ai-receptionist__2026-09-02__pass.csv
qf__ai-receptionist__2026-08-31__reject-template-collision.csv
qf__seo-consultant-miami__2026-08-31__reject-zero-volume.csv
```

**The QA verdict belongs in the filename** so a rejected export cannot be picked up months later and
mistaken for evidence. Preserve original files unchanged. **The date is the acquisition date, not
the audit date.**

---

# 29. Firecrawl integration

Use Firecrawl after query/SERP discovery for: ranking-page extraction · competitor IA · H1/title/meta · copy structure · FAQ extraction · pricing · proof · CTA · internal links · schema-visible content.

Crawl the **top relevant commercial pages**, not every result.

Normalize: domain · URL · page type · title · H1 · primary promise · ICP · pain · offer · pricing · proof · CTA · FAQ themes · internal-link pattern · content depth.

The purpose is not "copy competitors." It is:

> determine what Google is rewarding and where Audio Jones can produce a more credible, differentiated answer.

**Competitor FAQ extraction is also a real question source** — pre-validated by the fact that a
ranking page chose to answer it. Treat it as a secondary input to §9A.

---

# 30. GSC integration

Weekly queues for: positions 5–20 · high impressions + low CTR · query/page mismatch · commercial queries without an appropriate landing page · declining commercial pages · new query emergence.

Do not replace a page with a new page when the existing page is already earning relevant impressions unless the intents are genuinely different.

**GSC is first-party and unfalsifiable — it outranks every third-party research tool in the §3
hierarchy for questions about your own existing demand. Given the corpus failure, pull the GSC query
export before commissioning any new third-party research.**

---

# 31. GBP integration

Reconcile: GBP categories · GBP services · actual GBP queries · website service pages · local commercial keywords.

Do not create thin city pages merely to match every nearby location.

**GBP's "queries used to find your business" report is first-party local demand data — the only
trustworthy local signal currently available.**

---

# 32. Measurement instrumentation

```text
search_landing_view · diagnostic_cta_click · diagnostic_start · diagnostic_complete
calculator_start · calculator_complete · pricing_view · responseos_cta_click
book_call_start · book_call_complete · qualified_form_submit
```

Attach where feasible: landing page · offer ID · query cluster · campaign · source · medium · conversion type.

Ultimate measurement: search query / page → lead → qualified opportunity → proposal → closed revenue.

---

# 33. Implementation scorecard

| Layer | KPI |
| ----- | --- |
| Crawl | indexable/canonical health |
| Visibility | qualified impressions |
| SERP | rankings / local visibility |
| CTR | click-through |
| Engagement | commercial-page interaction |
| Conversion | calls/forms/diagnostics |
| Qualification | viable opportunities |
| Revenue | attributable pipeline/revenue |
| Efficiency | maintenance effort / CPL |
| **Evidence integrity** | **% of register rows with a passing acquisition-QA provenance record** |

---

# 34. Experiment framework

Hypothesis · Evidence · Expected mechanism · Baseline · Primary KPI · Secondary KPI · Time horizon · Success threshold · Failure threshold · Reversal condition.

```text
Hypothesis:
A commercially targeted "AI receptionist for contractors" surface will generate
higher-qualified non-brand search demand for ResponseOS than proprietary
ResponseOS language alone.

Evidence:        NONE ACQUIRED — see §9. This is the reason the framework has an
                 Evidence field; it is currently empty for every wedge.
Primary KPI:     qualified non-brand organic leads.
Secondary:       impressions for contractor AI receptionist cluster.
Kill criterion:  meaningful impressions emerge but visitor intent consistently
                 does not map to ResponseOS buyers.
```

---

# 35. CI / repository acceptance criteria

```bash
pnpm typecheck
pnpm lint
pnpm check:no-firebase
pnpm build
```

Additionally add tests for:

| Test | **Workflow that can run it** |
|---|---|
| offer IDs unique | `build-and-lint.yml` |
| offer paths unique | `build-and-lint.yml` |
| public prices match HTML | `build-and-lint.yml` |
| public prices match JSON-LD | `build-and-lint.yml` |
| public prices match `offers.json` | `build-and-lint.yml` |
| all offer relationships resolve | `build-and-lint.yml` |
| no private pricing in public JSON | `build-and-lint.yml` |
| no orphan indexed offer page | `build-and-lint.yml` |
| **every indexed offer has non-empty `proofAssetPaths`** | `build-and-lint.yml` |
| **display convention identical across all public offers** | `build-and-lint.yml` |
| **robots.txt disallow set has not shrunk, per user-agent group** | `build-and-lint.yml` |
| all sitemap URLs return canonical/indexable definitions | **`smoke-preview.yml` / `smoke-prod.yml`** |

> ⚠️ **REDLINE 5.** **There is no `pnpm test` script.** Contract tests run as individual
> `pnpm exec tsx --test <file>` steps in `.github/workflows/build-and-lint.yml`. **A new test file
> without its own step never runs** — the build stays green and asserts nothing. The sitemap check
> needs a live URL and cannot run in `build-and-lint.yml` at all.
>
> **Rule: every PR adding a test file also adds its workflow step, in the same PR.**
>
> **Local note:** `pnpm install` fails inside a git worktree on Windows; junction `node_modules` to
> the main checkout instead. Also, any lintable file in a directory not listed in `globalIgnores`
> makes `pnpm lint` abort with `exit 2` and a misleading "could not find plugin react" — the config
> ends with an unscoped rules block that `eslint-config-next` does not cover for non-JSX file types.

---

# 36. Branch strategy

Research remains `docs/search-intelligence-seo-aeo-2026`. Implementation is separate:

```text
feat/offer-registry
feat/search-foundation
feat/responseos-search-alignment
feat/solution-family-hubs
feat/search-tools
```

Do not combine offer registry migration, route migration, a homepage rewrite, 20 new pages, and schema redesign into one giant PR.

---

# 37. Deployment gates

| Gate | Question |
|---|---|
| A — Research | Evidence sufficient? **Includes acquisition-QA provenance (§9A), not only volume.** |
| B — Commercial | Offer/pricing approved? **Includes all thirteen Wave 0 decisions.** |
| C — Architecture | Query → offer → page approved? |
| D — Build | Tests/pass/preview ready? |
| E — Search QA | Firecrawl preview crawl clean? |
| F — Human review | Copy/pricing/CTA accurate? |
| G — Deploy | Explicit production authorization. |
| H — Measurement | Record deployed SHA/date and baseline. |

**Gate A is what caught the corpus problem.** The architecture worked; it simply had no mechanism to
*apply* the gate to incoming data before §9A. Keep this gate strict.

---

# 38. First implementation backlog

| Priority | Work | State |
| -------- | ---- | ----- |
| P0 | Commercial/pricing reconciliation **(13 decisions, §26 Wave 0)** | Required |
| P0 | Canonical `offers.ts` registry | BUILD after P0 |
| P0 | ~~Normalize existing QuestionFinder exports~~ **Quarantine the nine rejected exports** | ~~BUILD~~ **DONE — commit c4ea697** |
| P0 | **Re-qualify or retire QuestionFinder (§9A)** | **SPIKE** |
| P0 | **Pull GSC + GBP first-party query exports** | **BUILD — cheapest real evidence available** |
| P0 | Complete DataForSEO Batch A **+ PAA extraction, with acquisition QA** | BUILD |
| P0 | ~~ResponseOS Query Opportunity cluster~~ | ~~BUILD~~ **BLOCKED on re-acquisition** |
| P1 | `/agents/responseos` implementation brief | ~~TEST/BUILD~~ **BLOCKED on re-acquisition** |
| P1 | SEO contractor cluster validation | TEST **— re-acquire first; prior exports rejected** |
| P1 | SEO/AEO Diagnostic page | ~~likely BUILD after validation~~ **HOLD — least-evidenced wedge** |
| P1 | `/solutions` registry integration | BUILD **— unblocked** |
| P1 | Family hubs | BUILD **— gated on the Wave 0 item 13 proof decision** |
| P1 | **Produce one named case study, or relax the proof contract** | **DECIDE then BUILD** |
| P2 | Missed Call Revenue Calculator | TEST **— also a proof asset; consider promoting to P1** |
| P2 | SEO ROI Calculator | TEST |
| P2 | Business Memory acquisition-language research | SPIKE **— cleanest first §9A run; no prior bad data** |
| P2 | Local SEO Miami commercial surface | TEST, not BUILD yet **— evidence now known absent** |
| P3 | Vertical pages | WATCH |
| P3 | Broad South Florida page program | HOLD |

---

# 39. Immediate next execution sequence

~~1. Normalize the QuestionFinder CSVs already collected.~~
~~2. Merge/de-duplicate question clusters.~~

> ⚠️ **REDLINE 1.** Steps 1–2 are deleted. Normalizing the collected corpus produces a
> well-structured register of fiction; merging six copies of one template would present the
> fabrication as convergent evidence.

**Corrected sequence:**

```text
 1. Quarantine the nine rejected exports with a written rejection record (§27).   ← DONE
 2. Pull first-party evidence first: GSC query export + GBP "queries used to find your
    business." Free, unfalsifiable, and outranks third-party tools in the §3 hierarchy.
 3. Run DataForSEO on parent seeds — search_volume + keywords_for_keywords + SERP/PAA.
 4. Apply acquisition QA (§9A) to every batch; log verdicts.
 5. Re-qualify or retire QuestionFinder against a known-good seed.
 6. Build the first admissible Query Opportunity Register.
 7. Run Firecrawl against ranking commercial competitors; harvest their FAQs as a
    secondary question source.
 8. Complete ResponseOS Query → Offer → Page decision.
 9. Complete SEO/Local/AEO Query → Offer → Page decision.
10. Complete pricing reconciliation (all thirteen Wave 0 decisions).
11. Build the offer registry.
12. Generate the first implementation briefs.
13. Implement on separate feature branches.
14. Preview crawl.
15. Review.
16. Approved deploy.
17. Measure.
```

**Steps 10–11 do not depend on steps 2–9 and should run in parallel starting now.** Pricing
reconciliation and the registry are the highest-leverage unblocked work in the entire program.

---

# 40. Canonical boundary between the two specs

## Search Intelligence Spec — *"What does the evidence justify?"*

Owns: DataForSEO · QuestionFinder · Firecrawl research · GSC · GBP · customer language · competitor evidence · query clustering · opportunity scoring **· acquisition QA and provenance**.

## Search Implementation Spec — *"Exactly what will change on AudioJones.com, why, where, how, in what sequence, and how will we validate it?"*

Owns: offer registry · URLs · page briefs · copy requirements · internal links · JSON-LD · sitemap · robots · offers.json · llms.txt · instrumentation · tests · deployment gates · measurement.

---

## Final architecture

> **Pricing determines what is commercially true. Search intelligence determines what buyers call
> it. The offer registry reconciles those two worlds. Pages present that truth to humans.
> Structured data and machine-readable endpoints present the same truth to machines. Internal links
> encode the commercial relationships. Measurement determines what compounds.**

**One amendment.** That chain has a prior link: **research data must be verified before it is
allowed to determine what buyers call anything.** A fabricated corpus entering at the "search
intelligence" step propagates through the registry into pages, schema, and machine endpoints — and
by the time it reaches production it reads as ordinary marketing copy, indistinguishable from truth.
§9A exists so that never happens silently. The corpus that prompted this correction was caught
because six files shared a row order, not because any single question looked wrong.

---

## Corrections applied in v1.1

| Source | Correction |
|---|---|
| Research-corpus audit | §9 rejection · §9A acquisition protocol · §7 QA step · §10/§14/§15/§16 status downgrades · §11 provenance fields · §21 language-source restriction · §26 Wave 0B · §27 quarantine · §28 naming · §33 integrity KPI · §34 evidence field · §38/§39 resequencing |
| Offer Map plan redline #1 | §25 robots.txt merge + group-inheritance defect (build-verified: 16 disallows) |
| Offer Map plan redline #2 | §4 / §26 Wave 0 inherits the matrix's ten open decisions |
| Offer Map plan redline #3 | §5 `proofAssetPaths` · §12 gate · §19 contract · §26 Wave 3 gating · §35 test |
| Offer Map plan redline #4 | §5 legacy catalog retained for media/personal-brand families |
| Offer Map plan redline #6 | §13 live content surfaces added to the disposition set |
| Offer Map plan redline #7 | §4 "Revenue Leak" collision · display convention · §5 `displayConvention` |
| Offer Map plan redline #8 | §3 matrix authority scoped to structure · Core BM contradiction |
| Offer Map plan redline #9 | §35 test-to-workflow mapping · no `pnpm test` · worktree and lint gotchas |
| Offer Map plan redline #10 | §13 `/diagnostic` · §22 `speakable` already implemented · §5 Zod |
| Build verification 2026-09-01 | §13 · §19 · §23 · §25 confirmed against generated `robots.txt` and `sitemap.xml` |
