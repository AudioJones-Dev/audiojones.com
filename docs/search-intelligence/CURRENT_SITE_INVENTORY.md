# AudioJones.com Current Site Inventory — SEARCH-02

**Status:** Baseline evidence capture  
**Snapshot date:** 2026-08-29  
**Branch:** `docs/search-intelligence-seo-aeo-2026`  
**Scope:** Research only. This document does not authorize production copy, route, schema, navigation, GBP, or code changes.

---

## 1. Purpose

Establish the current public-site baseline before keyword expansion or messaging changes.

This inventory compares:

1. the live site as discoverable/crawlable through Firecrawl,
2. the XML sitemap,
3. the current `main` repository architecture and canonical navigation,
4. the current canonical product PRD.

The purpose is to separate **what exists now** from assumptions about what should exist next.

---

## 2. Evidence Legend

- **KNOWN** — confirmed current repo state or directly retrieved first-party site output.
- **RETRIEVED** — external/tool observation from Firecrawl or current official documentation.
- **INFERRED** — interpretation that requires additional validation.
- **UNKNOWN** — not established by this baseline.

---

## 3. Baseline Counts

### Live discovery

- **RETRIEVED:** Firecrawl map discovered **43 public URLs/surfaces** under `audiojones.com`, including the sitemap itself, legal pages, diagnostic routes, blog topic hubs, and pages outside the XML sitemap.
- **KNOWN / RETRIEVED:** `https://www.audiojones.com/sitemap.xml` currently contains **32 URLs**.
- **RETRIEVED:** A sitemap-only Firecrawl crawl completed successfully for all **32/32 sitemap URLs**.

The difference between 43 mapped URLs and 32 sitemap URLs is **not automatically an error**. Legal, utility, experimental, or intentionally non-indexed pages may correctly remain outside the sitemap. Each non-sitemap surface needs classification before remediation.

---

## 4. XML Sitemap Inventory — 32 URLs

| # | URL | Baseline role | Initial classification |
|---:|---|---|---|
| 1 | `/` | Primary brand/positioning + funnel entry | Priority commercial |
| 2 | `/solutions` | Canonical offer ladder / what AJ Digital builds | Priority commercial |
| 3 | `/resources` | Resource/content hub | Authority hub |
| 4 | `/agents` | AI/agent-system hub | Commercial/category |
| 5 | `/agents/responseos` | ResponseOS / AI Receptionist / revenue recovery | Priority commercial |
| 6 | `/services` | Human advisory and implementation engagements | Priority commercial; overlap to test |
| 7 | `/case-studies` | Proof/case-study surface | Trust / conversion support |
| 8 | `/insights` | Pillar insight hub | Authority hub |
| 9 | `/roi-calculator` | Operational Waste Recovery Calculator | Lead-gen / tool |
| 10 | `/workshops` | Workshops | Commercial / education |
| 11 | `/ai-readiness-diagnostic` | AI readiness entry | Lead-gen / diagnostic |
| 12 | `/book-a-call` | Conversion route | Conversion |
| 13 | `/founder-intelligence` | Founder Intelligence category/product pillar | Proprietary category |
| 14 | `/founder-intelligence/diagnostic` | Founder Intelligence diagnostic flow | Conversion / diagnostic |
| 15 | `/founder-gravity-audit` | Founder Gravity Audit | Lead-gen / proprietary diagnostic |
| 16 | `/founder-gravity-audit/diagnostic` | Founder Gravity diagnostic flow | Lead-gen flow |
| 17 | `/apply` | Engagement application | Conversion |
| 18 | `/pricing` | Offers and pricing | Priority commercial |
| 19 | `/frameworks` | Framework/IP hub | Authority/entity hub |
| 20 | `/blog` | Blog/topic-cluster hub | Authority/content |
| 21 | `/about` | Brand/operator authority | Trust/entity |
| 22 | `/frameworks/founder-intelligence-systems` | Founder Intelligence definition/framework | Proprietary entity |
| 23 | `/frameworks/map-attribution` | M.A.P. Attribution | Proprietary framework |
| 24 | `/frameworks/niche-framework` | N.I.C.H.E framework | Proprietary framework |
| 25 | `/frameworks/signal-vs-noise` | Signal vs Noise framework | Proprietary framework |
| 26 | `/insights/founder-intelligence-systems` | Founder Intelligence explanatory article | Authority/support |
| 27 | `/insights/signal-vs-noise-business` | Signal vs Noise article | Authority/support |
| 28 | `/insights/why-ai-fails-most-companies` | AI failure / operations article | Authority/support |
| 29 | `/insights/marketing-attribution-causal-identification` | Attribution article | Authority/support |
| 30 | `/insights/revenue-leak-diagnostic` | Revenue Leak Diagnostic explainer | Commercial-support content |
| 31 | `/insights/follow-up-intelligence` | Follow-Up Intelligence explainer | Commercial-support content |
| 32 | `/insights/business-memory` | Business Memory explainer | Authority/support |

---

## 5. Public Surfaces Discovered Outside the XML Sitemap

Firecrawl's broader map also surfaced the following URLs outside the 32 sitemap entries:

| URL | Observed role | Current interpretation |
|---|---|---|
| `/blog/topic/founder-intelligence-systems` | Blog topic hub | Index/sitemap intent requires review |
| `/blog/topic/signal-vs-noise` | Blog topic hub | Index/sitemap intent requires review |
| `/blog/topic/map-attribution` | Blog topic hub | Index/sitemap intent requires review |
| `/blog/topic/why-ai-fails` | Blog topic hub | Index/sitemap intent requires review |
| `/blog/topic/ai-readiness` | Blog topic hub | Index/sitemap intent requires review |
| `/step-2` | Proprietary thesis / operating-layer page | Intent and canonical role require review |
| `/applied-intelligence/diagnostic` | Strategic diagnostic variant | Funnel/canonical relationship requires review |
| `/cookie-policy` | Legal | Sitemap exclusion can be intentional |
| `/privacy-policy` | Legal | Sitemap exclusion can be intentional |
| `/terms-of-service` | Legal | Sitemap exclusion can be intentional |
| `/sitemap.xml` | XML sitemap | Not a content URL |

### Additional repo-only or sitemap-excluded surfaces observed

The current `src/app` root also includes at least these directories that were not present in the Firecrawl map/sitemap snapshot:

- `cancellation-policy`
- `consent-testimonial`
- `ecosystem`
- `env`

`robots.txt` explicitly disallows `/env` and `/consent-testimonial`, so their absence from index-oriented discovery is expected. The intended status of other repo-only surfaces requires route-level review; absence from Firecrawl's map does not prove they are unavailable.

---

## 6. Canonical Navigation vs Commercial Surface Inventory

### KNOWN — current navigation doctrine

`src/config/nav.ts` states that **Solutions is the canonical “what we sell” surface** and that content surfaces live beneath Resources. Primary navigation is:

- Home
- Solutions
- Pricing
- About
- Resources
- Contact → `/book-a-call`

Header CTAs are:

- AI Readiness Diagnostic
- Book a Call

### RETRIEVED — live overlap requiring research

`/services` remains a substantial, sitemap-prioritized commercial page with its own H1, engagement model, service descriptions, process, proof language, direct-answer block, and conversion path.

This creates a **potential intent overlap** between `/solutions` and `/services`:

- `/solutions` = offer ladder: free → audit → blueprint → build → operate.
- `/services` = engagement ladder: diagnose → design/build → operate/measure.

**INFERRED:** They may be able to coexist if they target materially distinct query intent. They may also be cannibalizing or creating unnecessary decision complexity. Search-demand/GSC evidence is required before consolidation or repositioning is recommended.

No route change is authorized by this finding.

---

## 7. Messaging Baseline — Primary Commercial Pages

### Homepage `/`

**Title:** `Audio Jones — Founder Intelligence Systems for founder-led businesses`

**Primary positioning:**

- “Founder Intelligence Systems for founder-led service businesses.”
- “You don't have a growth problem. You have a signal problem.”

**Strong market/problem language already present:**

- missed calls
- slow follow-up
- marketing that pays off
- service businesses
- revenue leakage
- revenue recovery
- capture / qualify / recover
- attribution
- operational noise

**Key observation:** the FAQ answer is materially plainer than the top-level category language: it says Audio Jones helps **service businesses** stop losing revenue to missed calls, slow follow-up, and uncertainty about which marketing works.

### `/solutions`

**H1:** `Founder Intelligence Systems — diagnosed, architected, and installed.`

**Audience label:** `founder-led service businesses`

**Market-recognizable solution language present:**

- AI Readiness Scorecard
- AI Operations Audit
- System Architecture & Blueprint
- Custom Application Build
- AI Agent Build
- AI Receptionist System
- Managed Intelligence Retainer

**Observation:** the underlying offer ladder is operationally coherent, but its front-door category remains proprietary/founder-centered.

### `/services`

**Title/H1:** `Founder Intelligence Services`

**Core method:** diagnose business system → identify leverage → install automation/agent/reporting layer → measure/harden.

**Market-recognizable terms present:**

- business systems
- AI workflows
- AI Operations Audit
- AI Agent Build
- attribution
- CRM
- reporting
- operational leverage

**Observation:** service mechanics are clearer than the category label.

### `/agents/responseos`

**Title:** `ResponseOS Revenue Recovery Infrastructure | Audio Jones`

**Explicit category language:** `AI Receptionist System`

**Problem/solution language:**

- missed calls
- slow follow-up
- inbound inquiries/forms/messages
- qualification
- routing
- appointment/booking path
- stalled/ghosted leads
- recovery cadence
- revenue recovery

**Observation:** ResponseOS already contains a large amount of likely commodity search language beneath the proprietary product name. This is a strong candidate for query-to-page testing rather than immediate renaming.

### `/roi-calculator`

**Title:** `Operational Waste Recovery Calculator | Audio Jones`

**Current problem language:**

- manual work
- slow follow-up
- rework
- founder bottlenecks
- headcount avoidance
- revenue recovery

**INFERRED:** The tool may have acquisition potential under more established calculator/problem terminology, but keyword evidence is required before title/H1 changes.

---

## 8. Founder-Language Saturation — Current State

### KNOWN / RETRIEVED

The current canonical repo PRD defines AudioJones.com as the front door to **Founder Intelligence Systems** and says the site is intended to convert the “right-fit founder.” It defines the core offer as founder-led AI infrastructure for businesses in the `$250K–$5M` range.

The live site repeats founder/founder-led language across:

- homepage
- Solutions
- Services
- Agents
- ResponseOS
- Resources
- Insights
- Blog
- About
- Pricing
- Founder Intelligence
- diagnostics
- workshops
- multiple framework/insight pages

### Research implication

This confirms that the question “does the ICP actually identify/search as founder?” is **structural**, not a minor copy preference.

Changing it later would require reconciliation with:

- `docs/PRD.md`
- `AGENTS.md` content-tone guidance
- page metadata
- category/IP positioning
- diagnostic wording
- navigation descriptions
- supporting authority content

No such change should happen until query/customer evidence establishes the acquisition vocabulary.

---

## 9. Local SEO Baseline

### RETRIEVED

A targeted Firecrawl site crawl looking for explicit geographic/service-area language such as:

- Miami
- South Florida
- Florida
- local service area
- remote
- national/nationwide
- United States

returned **no matching page set** in that targeted pass.

### Interpretation

- **RETRIEVED:** the current sitemap/commercial-content corpus does not visibly foreground a Miami/South Florida service-area layer.
- **INFERRED:** this is likely a material gap relative to the stated objective of using local SEO as a high-priority acquisition wedge while retaining remote-service scalability.
- **UNKNOWN:** current GBP configuration, GBP search terms, local-pack rankings, NAP/entity consistency, local backlinks/citations, service-area settings, and GSC geographic performance have not yet been retrieved.

Do not solve this with thin city pages. Local architecture must be grounded in legitimate service-area/entity evidence and actual demand.

---

## 10. Content / Topical Authority Baseline

### Blog

The live `/blog` page explicitly says **“No posts published yet”** while presenting five topic-cluster hubs:

- Founder Intelligence Systems
- Signal vs Noise
- M.A.P. Attribution
- Why AI Fails
- AI Readiness

Those topic URLs are discoverable by Firecrawl but are not present in the current XML sitemap.

**INFERRED:** The content architecture is scaffolded ahead of the actual publishing corpus. This is not inherently wrong, but the topic-hub indexing/sitemap strategy should be reviewed before expanding content.

### Insights

Seven substantive insight pages are in the sitemap and provide the site's current authority corpus around:

- Founder Intelligence
- signal vs noise
- AI failure modes
- marketing attribution
- revenue leak diagnostics
- follow-up intelligence
- business memory

Several already use question/definition structures useful for AEO.

### Case studies

The live case-study surface uses a clear `signal → leak → system` proof model. In the Firecrawl baseline, the visible examples are scenario-style summaries and do not display named clients or quantified outcomes.

**INFERRED:** proof depth may become a trust/E-E-A-T and conversion constraint, but client-consent and evidence availability must govern any recommendation.

---

## 11. Evidence / Credibility Flags

### Homepage missed-call statistic

The homepage currently cites:

> `62% of inbound calls to small businesses go unanswered`

with the page itself identifying the source as **411 Locals, January 2016, 85 businesses, 30 days**.

**KNOWN:** the cited evidence is approximately a decade old in the 2026 site context and based on a small disclosed sample.

**Research requirement:** locate stronger/current primary or high-quality evidence before deciding whether to retain, replace, or contextualize the statistic.

No public-copy change is authorized at this stage.

---

## 12. Robots / AI-Search Baseline

Current `robots.txt` includes:

```txt
User-Agent: *
Allow: /
...
User-Agent: GPTBot
Disallow: /
```

It also points to the XML sitemap and excludes internal/utility paths such as `/portal/`, `/ops/`, `/api/`, `/env`, and `/consent-testimonial`.

### Current interpretation

- **KNOWN / RETRIEVED:** GPTBot is blocked.
- **RETRIEVED from current OpenAI publisher guidance:** GPTBot is used for training-control purposes, while **OAI-SearchBot** is the crawler publishers should allow for content discovery/summaries in ChatGPT search.
- **INFERRED from the current robots rules:** OAI-SearchBot is not explicitly blocked by `robots.txt` because the general user-agent rule allows `/` and only GPTBot receives a specific full-site disallow.
- **UNKNOWN:** whether Cloudflare/WAF/bot-management rules permit OAI-SearchBot in practice.

Therefore, the GPTBot block should **not** be classified as a ChatGPT-search visibility defect by itself.

Reference for later verification: OpenAI Publishers and Developers FAQ, current as of 2026-08-29.

---

## 13. Repo / Product Doctrine Tension to Resolve

### Current canonical PRD

`docs/PRD.md` currently defines:

- the site as the public front door to Founder Intelligence Systems,
- the target as founder-led AI infrastructure for `$250K–$5M` businesses,
- “Founders / SMB” as a principal audience,
- SEO/AEO quality requirements including structured data, canonical URLs, and sitemap.

### New research objective

The approved Search Intelligence PRD asks whether acquisition language should broaden toward:

- service business owner
- business owner
- contractor
- home-service business
- local-service company
- operator
- vertical/trade-specific language

while preserving Founder Intelligence as proprietary IP where it remains strategically useful.

**Decision gate:** Any later messaging architecture that materially changes the audience/category model must update canonical product/brand doctrine deliberately; it must not be implemented as isolated SEO copy edits.

---

## 14. Initial Findings — Evidence Before Recommendation

### F-01 — Front-door vocabulary mismatch is plausible

**Evidence:** The site's strongest plain-language value propositions use service-business pain (`missed calls`, `slow follow-up`, `which marketing works`), while titles/H1s repeatedly lead with `Founder Intelligence` / `founder-led`.

**State:** `TEST`, not decided.

### F-02 — ResponseOS has the clearest commodity-demand bridge

**Evidence:** It explicitly uses `AI Receptionist System`, missed calls, inbound capture, qualification, routing, follow-up, and revenue recovery.

**State:** `PROCEED` to keyword/query research; no copy change yet.

### F-03 — `/solutions` and `/services` need intent reconciliation

**Evidence:** Both are substantial commercial surfaces; navigation doctrine declares Solutions canonical, while Services remains sitemap-prioritized and conversion-oriented.

**State:** `SPIKE` using GSC + external query evidence.

### F-04 — Local acquisition is underrepresented in visible site language

**Evidence:** Targeted geographic crawl returned no matching local/remote/national service-area page set.

**State:** `PROCEED` to local-demand/GBP research; do not create location pages yet.

### F-05 — Authority architecture exists but publishing depth is uneven

**Evidence:** seven insight pages and four framework pages exist, but the Blog reports no published posts while five topic hubs are externally discoverable and absent from the sitemap.

**State:** `SPIKE` indexation/content-role intent before expansion.

### F-06 — Proof quality needs evidence review

**Evidence:** case-study structure is present, but visible examples are not named/quantified in the baseline crawl.

**State:** `WATCH` pending available client evidence/consent.

### F-07 — Homepage lead statistic should be revalidated

**Evidence:** cited source is from 2016 with a disclosed 85-business sample.

**State:** `PROCEED` to evidence replacement/revalidation research.

---

## 15. Unknowns — Do Not Fill by Guessing

The baseline does **not** yet establish:

- actual GSC query/impression/click/position data,
- branded vs non-branded organic split,
- pages already ranking on positions 5–30,
- actual keyword volume or difficulty,
- actual search demand for `founder` vs `owner` vs `contractor` vs `service business`,
- GBP search terms/categories/services/performance,
- local-pack rankings,
- DataForSEO keyword/SERP evidence,
- QuestionFinder question corpus,
- customer-call language frequency,
- organic conversion rate by landing page,
- cannibalization between Solutions/Services/Founder Intelligence pages,
- live structured-data coverage on every URL,
- OAI-SearchBot access through Cloudflare/WAF,
- index status of the five blog topic hubs and other non-sitemap pages.

---

## 16. Next Evidence Gate — SEARCH-03

Do **not** rewrite pages yet.

The next research unit should create the initial `ICP_LANGUAGE_MATRIX.md` and `KEYWORD_SEED_REGISTER.md`, then validate them with the strongest available evidence in this order:

1. GSC first-party queries/pages if accessible,
2. GBP search/performance evidence if accessible,
3. DataForSEO keyword/SERP/local evidence in an environment where its MCP is callable,
4. Firecrawl competitor/page-architecture evidence,
5. QuestionFinder expansion,
6. customer/client language corpus.

The first seed tests should explicitly compare identity/category vocabulary rather than assuming it:

- founder / founder-led
- owner / business owner
- service business / service business owner
- contractor
- home-service business
- local service business
- operator / owner-operator

and pair those with high-value problem/solution seeds already visible on the site:

- AI receptionist
- missed call automation
- lead follow-up automation
- revenue recovery
- CRM automation
- business process automation
- AI automation
- operations consulting / business systems
- local SEO
- SEO for service businesses / contractors
- website optimization
- marketing attribution

---

## 17. Baseline Decision

**Decision:** `PROCEED` to evidence collection and query-language testing.

**Do not proceed yet to:** public messaging changes, route consolidation, local landing-page generation, title/H1 rewrites, GBP edits, or production implementation.

The site already contains a coherent systems thesis and useful problem language. The primary open question is whether its **acquisition vocabulary and search architecture expose that value in the language the ICP actually uses**.
