# Audio Jones Search Intelligence & Demand Architecture — PRD

**Status:** Research / planning only  
**Branch:** `docs/search-intelligence-seo-aeo-2026`  
**Owner:** AJ Digital LLC / Audio Jones  
**Production impact:** None. No live copy, routes, schema, navigation, or code may be changed from this research branch without a separately approved implementation task.

---

## 1. Problem

AudioJones.com has differentiated proprietary positioning and real capabilities across operations engineering, business systems, AI/automation implementation, revenue recovery, CRM/follow-up, website optimization, SEO, local SEO, and AEO.

The current messaging and information architecture may not consistently match the language used by the target market—especially owner-operated, blue-collar, home-service, local-service, and other service businesses. Terms such as `founder`, `Founder Intelligence`, and proprietary framework names may be useful positioning language without being the highest-value acquisition language.

The site therefore needs an evidence-backed search and messaging architecture that separates:

1. market/search language,
2. customer problem language,
3. commercial solution language,
4. Audio Jones proprietary framework language,
5. local intent,
6. remote/national service intent.

---

## 2. Desired Outcome

Create a canonical search-demand intelligence system that maps:

`market language → ICP → pain → desired outcome → solution category → Audio Jones offer → canonical URL → CTA → attributable business result`

The resulting plan should improve:

- Google organic visibility,
- local SEO visibility,
- AI-search / answer-engine visibility,
- commercial query coverage,
- comprehension of what Audio Jones does,
- qualified lead generation,
- route/page intent clarity,
- internal topical authority,
- measurement from search demand through pipeline/revenue.

The architecture must support South Florida / Miami local acquisition while remaining structurally scalable to remote service clients outside the local market.

---

## 3. Success Criteria

Research is successful when we can answer with evidence:

- What terminology does the target market actually use for itself: `owner`, `business owner`, `contractor`, `operator`, `service business`, `home service business`, `founder`, or other terms?
- Which problems create commercially meaningful search behavior?
- Which solution categories have real buyer intent?
- Which proprietary Audio Jones terms should remain brand/IP language rather than primary SEO acquisition terms?
- Which existing URLs should retain, broaden, narrow, consolidate, or change intent?
- Which high-value commercial intents lack a dedicated page?
- Which topics deserve supporting content, calculators, diagnostics, comparison pages, case studies, FAQs, or tools?
- How should local intent and remote/national intent coexist without creating duplicate or doorway-style content?
- Which opportunities justify implementation based on evidence, right-to-win, commercial value, and maintenance burden?

Implementation success will later be measured by qualified-search outcomes, not raw traffic alone, including:

- relevant impressions,
- ranking movement,
- CTR,
- qualified organic sessions,
- calls/forms/diagnostics/bookings,
- lead quality,
- pipeline contribution,
- attributable revenue where instrumentation permits.

---

## 4. Scope

### 4.1 ICP and market-language research

Evaluate language used by:

- owner-operated service businesses,
- blue-collar / trade businesses,
- home-service businesses,
- local service providers,
- established small service businesses,
- contractors,
- operators/business owners,
- remote service-business prospects where relevant.

Do not assume `founder` is canonical acquisition language.

### 4.2 Search-demand research

Use and reconcile evidence from:

- Google Search Console,
- Google Business Profile performance/search terms,
- QuestionFinder,
- Google SERPs / People Also Ask / related searches,
- competitor keyword and page-gap research,
- customer/client conversations,
- CRM/forms/email inquiry language,
- Reddit/forums/community discussions when useful,
- first-party site analytics,
- **DataForSEO MCP** for structured keyword, SERP, local, competitor, and related search-demand data,
- **Firecrawl MCP** for competitor/site discovery, crawling, scraping, page inventory, and structured content extraction,
- additional keyword tools where useful.

#### MCP operating status

- **Firecrawl:** installed and available as an MCP research capability. In ChatGPT sessions where the connector is exposed, it may be called directly for search, scrape, map, crawl, structured extraction, and related research operations.
- **DataForSEO:** installed as an MCP research capability in the Audio Jones toolchain. Availability can vary by execution environment/session; when exposed, use it as a primary structured SEO data provider. If not exposed in a given session, run collection from the environment where the MCP is available and persist/import the resulting evidence rather than replacing it with unsupported estimates.

The research architecture is tool-agnostic: MCP/tool availability must not change the evidentiary standard or the canonical data model.

### 4.3 Commercial search territories

Initial territories to validate rather than assume:

1. **Get Found** — SEO, local SEO, GBP, AEO, website optimization.
2. **Capture Demand** — AI receptionist, answering, missed-call response, appointment capture.
3. **Convert & Recover** — CRM, lead follow-up, quote/estimate follow-up, revenue recovery.
4. **Operate & Automate** — business systems, workflow automation, process automation, AI implementation.
5. **Measure & Improve** — attribution, ROI, reporting, revenue intelligence, operational measurement.

### 4.4 Existing-site audit

Inventory current URLs and classify:

- current purpose,
- title/H1,
- target language,
- likely search intent,
- offer represented,
- CTA,
- internal links,
- structured data,
- local/national relevance,
- keep / improve / consolidate / retire / test.

No route rename or deletion occurs during research.

### 4.5 Competitor analysis

Evaluate several competitor classes, not only direct AI consultants:

- digital marketing / SEO agencies,
- local SEO specialists,
- contractor/home-service marketing firms,
- AI automation firms,
- AI receptionist / answering vendors,
- CRM / RevOps consultants,
- business systems / operations consultants.

Capture both keyword gaps and **page architecture gaps**.

Use Firecrawl for site-level evidence collection and DataForSEO for SERP/keyword/competitor evidence where each materially improves coverage. Do not treat either vendor's output as ground truth without HDIKIT classification and corroboration where material.

### 4.6 Local + scalable architecture

Research should determine how to support:

- Miami / South Florida local commercial intent,
- legitimate service-area relevance,
- Google Business Profile alignment,
- remote/national clients,
- industry verticals,
- future expansion without thin location pages or duplicate intent.

### 4.7 AEO / AI-search optimization

Optimize for answerability and entity clarity without treating AEO as a separate collection of unsupported hacks.

Research should evaluate:

- direct-answer structures,
- entity relationships,
- schema already in the repo,
- FAQ usefulness,
- definitions/comparisons,
- firsthand evidence,
- citation-worthy expertise,
- crawl/index quality,
- generative-search reporting where available.

---

## 5. Out of Scope — Research Phase

Until a separate implementation task is approved, do not:

- rewrite production homepage copy,
- rename Founder Intelligence, ResponseOS, or other IP,
- rename or delete routes,
- restructure navigation,
- publish mass SEO content,
- generate programmatic location pages,
- add dependencies,
- alter production schema/code,
- bulk-edit title/meta tags,
- change GBP services/categories,
- deploy or merge to `main`.

---

## 6. Evidence Governance

Use an HDIKIT-style truth-state discipline for material claims:

- **Known** — first-party observed data or confirmed repo state.
- **Retrieved** — external/tool evidence, including Firecrawl and DataForSEO outputs.
- **Inferred** — reasoned interpretation of evidence.
- **Assumed** — working premise not yet validated.
- **Unknown** — unresolved.
- **Conflicting** — evidence points in different directions.

Do not promote repeated assumptions into facts.

For meaningful recommendations, record disconfirming evidence and what would reverse the decision.

---

## 7. Opportunity Evaluation

Use market/search evidence plus strategic fit.

Candidate topics/pages should be evaluated on:

- demand signal,
- commercial intent,
- ICP fit,
- economic pain,
- existing spend/workaround evidence,
- Audio Jones right-to-win,
- differentiation potential,
- evidence confidence,
- competitive intensity,
- maintenance burden,
- natural extension of existing offers/assets.

A practical prioritization model may use normalized 1–5 scores rather than pretending keyword estimates are exact.

Decision states:

- IGNORE
- WATCH
- SPIKE
- TEST
- PROCEED
- BUILD
- COMPOUND
- KILL

---

## 8. Required Research Artifacts

Create these only as evidence becomes available; do not fill them with invented data.

1. `CURRENT_SITE_INVENTORY.md`
2. `ICP_LANGUAGE_MATRIX.md`
3. `KEYWORD_SEED_REGISTER.md`
4. `QUERY_OPPORTUNITY_REGISTER.md`
5. `COMPETITOR_GAP_ANALYSIS.md`
6. `CUSTOMER_LANGUAGE_CORPUS.md`
7. `PAGE_INTENT_MAP.md`
8. `LOCAL_SEARCH_ARCHITECTURE.md`
9. `AEO_ENTITY_ANSWER_ARCHITECTURE.md`
10. `CONTENT_CLUSTER_MAP.md`
11. `EXPERIMENT_REGISTER.md`
12. `FINDINGS_AND_DECISIONS.md`
13. `IMPLEMENTATION_PLAN.md`

Raw exports/snapshots should be kept separate from canonical conclusions.

---

## 9. Research Sequence

1. Inspect current repo architecture and canonical docs.
2. Reconcile prior SEO/AEO branches and stale strategy documents.
3. Inventory current live/site routes and page intent.
4. Establish ICP language hypotheses.
5. Build a controlled seed universe (~40–60 initial concepts).
6. Collect first-party evidence from GSC/GBP where available.
7. Expand and validate demand with QuestionFinder / PAA / SERP evidence and **DataForSEO MCP** where available.
8. Run competitor keyword + money-page gap analysis using **DataForSEO + Firecrawl** as complementary evidence sources.
9. Build customer-language corpus from calls/forms/emails where authorized.
10. Cluster queries by ICP, pain, outcome, solution, intent, geography, and offer.
11. Map queries to existing/new canonical URLs.
12. Falsify high-cost architecture recommendations.
13. Specify bounded implementation experiments.
14. Approve implementation plan separately before production changes.
15. Measure results and iterate via Kaizen.

---

## 10. Prior Work to Reconcile

Prior SEO/AEO branches exist and must be treated as evidence, not automatically canonical.

Notable prior branch:

- `claude/audiojones-seo-aeo-strategy-KUCGZ`
  - contains `docs/AUDIOJONES_AEO_SEO_CONTENT_INTEGRATION_STRATEGY.md`
  - substantially predates current `main`
  - centers three AnswerThePublic themes and repeated `founder-led` acquisition language
  - contains useful page/entity/content architecture ideas that require revalidation against current repo state and current search-demand evidence.

Other prior SEO/AEO branches should also be inspected before recommendations are finalized.

---

## 11. Initial Hypotheses — NOT Decisions

The following are working hypotheses only:

- `founder` may remain valuable positioning/IP language while `owner`, `business owner`, `contractor`, `service business`, or industry-specific terms outperform it for acquisition.
- ResponseOS may acquire demand more effectively through established categories such as `AI receptionist`, `answering service`, `missed call automation`, and `lead follow-up automation`, while retaining ResponseOS as proprietary product language.
- Broad titles such as `forward-deployed AI engineer` may accurately describe capability but may not be primary customer search language.
- Audio Jones may be better understood commercially as engineering the path from demand → response → conversion → operations → measurement rather than presenting disconnected SEO, web, AI, CRM, and automation services.
- Local SEO should be treated as a high-priority acquisition wedge without constraining the business to Miami-only service delivery.

Each hypothesis must be validated, rejected, or narrowed with evidence.

---

## 12. Approval Gate

This branch is safe for research and documentation.

Any implementation that changes public messaging, routes, navigation, schema, production code, Google Business Profile configuration, or deployed behavior requires a separate implementation task and explicit approval under the repository operating rules.
