# Audio Jones Query Opportunity Register — SEARCH-04+

**Status:** SEARCH-06 GSC overlay complete; GBP evidence unavailable; no query is at `PROCEED` or `BUILD`
**Snapshot date:** 2026-08-29  
**Governing inputs:** `SEARCH_INTELLIGENCE_PRD.md`, `KEYWORD_SEED_REGISTER.md`, `DATAFORSEO_EXECUTION_SPEC.md`, `DATAFORSEO_EVIDENCE_2026-08-29.md`, `FIRST_PARTY_SEARCH_EVIDENCE_2026-08-29.md`

---

## 1. Purpose

This is the canonical promotion layer between research and site recommendations.

A query belongs here only after enough evidence exists to map:

`query → ICP → pain/outcome → intent → Audio offer → current/new URL hypothesis → commercial value → evidence confidence`

Raw keyword output, competitor observations, and unverified ideas remain in research artifacts and do not automatically enter this register.

---

## 2. Decision States

- **IGNORE** — weak fit or misleading demand.
- **WATCH** — interesting but insufficient evidence.
- **SPIKE** — requires targeted research to resolve an important unknown.
- **TEST** — bounded experiment justified; not yet canonical site architecture.
- **PROCEED** — enough evidence exists to recommend a specific SEO/AEO change for approval.
- **BUILD** — approved implementation work.
- **COMPOUND** — proven winner worth expanding or reinforcing.
- **KILL** — experiment or hypothesis failed its threshold.

---

## 3. Canonical Register

| ID | Query | Geo | Volume | CPC | SERP Intent | Local Pack | ICP | Pain / Outcome | Audio Offer | Existing URL | Page Gap | Right-to-Win 1–5 | Commercial Fit 1–5 | Evidence Confidence | Decision | Evidence Notes |
|---|---|---|---:|---:|---|---|---|---|---|---|---|---:|---:|---|---|---|

| SEARCH-04-001 | AI receptionist | US | 12,100 | $33.64 | commercial product/service | No | contractors and home services | capture missed calls and qualify leads | ResponseOS | `/agents/responseos` | optimize existing | 4 | 5 | high | TEST | Product-led SERP; AI Overview and PAA; contractor competitors validate the bridge. |
| SEARCH-04-002 | AI receptionist for contractors | US | 10 | $40.76 | niche commercial product/service | No | contractors | capture job leads while crews are unavailable | ResponseOS | `/agents/responseos` | optimize existing | 4 | 5 | medium | TEST | Low exact volume but contractor-specific vendors and pages dominate the SERP. |
| SEARCH-04-003 | virtual receptionist | US | 3,600 | $113.63 | mixed product/service/jobs | No | service businesses | continuous call coverage | ResponseOS | `/agents/responseos` | positioning unresolved | 3 | 5 | high | SPIKE | Strong commercial proxy, but human-service and employment intent create category ambiguity. |
| SEARCH-04-004 | answering service | US | 3,600 | $183.84 | mature commercial service | No | service businesses | answer calls and capture demand | ResponseOS | `/agents/responseos` | differentiation unresolved | 2 | 5 | high | SPIKE | Mature service vendors dominate; ResponseOS must distinguish AI operating-system value. |
| SEARCH-04-005 | missed call automation | US | — | — | mixed practical/software | No | service businesses | recover missed-call demand | ResponseOS | `/agents/responseos` | optimize existing | 4 | 4 | medium | WATCH | No numeric metric returned; fragmented SERP includes support docs, automation pages, and forums. |
| SEARCH-04-006 | CRM for contractors | US | 390 | $151.40 | software/comparison | No | contractors | manage leads and jobs | ResponseOS integration | `/agents/responseos` | no standalone product fit | 2 | 3 | high | SPIKE | Exceptional CPC, but SERP expects contractor CRM software rather than an implementation service. |
| SEARCH-04-007 | SEO for contractors | US | 590 | $14.52 | commercial service/guide | No | contractors | gain qualified search demand | Search systems | `/solutions` | cluster candidate | 3 | 4 | high | TEST | Dedicated agency and guide pages validate commercial coherence; capability proof still required. |
| SEARCH-04-008 | SEO for home services | US | 210 | $15.93 | commercial service/local | Yes | home-service businesses | improve local visibility and leads | Search systems | `/solutions` | cluster candidate | 3 | 4 | high | TEST | Service pages, guides, and a local pack appear; likely one cluster with contractor SEO. |
| SEARCH-04-009 | local SEO Miami | Miami | 110 | — | local commercial | Yes | Miami service businesses | improve local discovery | Search systems | — | new candidate unresolved | 2 | 4 | high | SPIKE | Local demand and pack confirmed; GSC returned no direct row, adjacent Miami AEO language is not an SEO substitute, and GBP evidence is unavailable. |
| SEARCH-04-010 | SEO consultant Miami | Miami | 90 | — | local commercial | Yes | Miami service businesses | obtain local SEO help | Search systems | — | new candidate unresolved | 2 | 4 | high | SPIKE | Agency and directory pages plus local pack dominate; GSC returned no direct row and GBP evidence is unavailable. |
| SEARCH-04-011 | AI search optimization | US | 1,300 | $45.41 | informational/agency | No | growth-oriented service businesses | improve visibility in AI search | Search/AEO authority | `/solutions` | authority candidate | 3 | 3 | high | SPIKE | GSC returned no direct row; adjacent AEO agency/consulting queries produced 31 impressions, 0 clicks, and 5.84 average position on the homepage, which does not validate exact intent or `/solutions`. |
| SEARCH-04-012 | missed call revenue calculator | US | — | — | tool | No | contractors and home services | quantify revenue lost to slow response | Diagnostic/tool | `/roi-calculator` | reconcile tool intent | 4 | 5 | high | TEST | GSC returned no direct row; adjacent `revenue recovery calculator` produced 41 impressions, 0 clicks, and 19.71 average position on `/roi-calculator`, supporting tool-family exposure but not missed-call specificity. |
| SEARCH-04-013 | marketing ROI calculator | US | 320 | $18.35 | tool | No | service-business owners | quantify marketing return | Diagnostic/tool | `/roi-calculator` | optimize existing | 4 | 4 | high | TEST | GSC returned no direct row; adjacent `revenue recovery calculator` produced 41 impressions, 0 clicks, and 19.71 average position on `/roi-calculator`, supporting the URL family but not marketing-ROI specificity. |
| SEARCH-04-014 | business systems consultant | US | 210 | $16.03 | job/career | No | — | — | professional descriptor only | — | no acquisition page | 1 | 1 | high | IGNORE | Jobs and career pages dominate; unsuitable as the primary acquisition category. |
| SEARCH-04-015 | CRM automation | US | 590 | $57.67 | informational/software | No | small service businesses | automate lead and customer workflows | Systems implementation | `/solutions` | no dedicated page | 2 | 3 | high | WATCH | Enterprise vendors and educational pages dominate; demand does not establish Audio fit. |
| SEARCH-04-016 | business process automation | US | 1,300 | $47.51 | informational/enterprise | No | broad business audience | automate repeatable operations | Systems implementation | `/solutions` | no dedicated page | 1 | 2 | high | WATCH | Large-platform and definition pages dominate; query is too broad for immediate acquisition. |
| SEARCH-04-017 | local SEO | US | 9,900 | $22.89 | mixed informational/local | Yes | local service businesses | improve local visibility | Search systems | `/solutions` | broad category unresolved | 2 | 4 | high | WATCH | Strong demand but broad intent and entrenched authority competition; GSC returned no direct row and GBP evidence is unavailable. |
| SEARCH-04-018 | Google Business Profile optimization | US | 6,600 | $23.30 | informational | No | local service businesses | improve GBP visibility | Search systems | `/solutions` | content/service boundary unresolved | 2 | 3 | high | WATCH | Google and major publishers dominate; GSC returned no direct row and GBP evidence is unavailable, so the content/service boundary remains unresolved. |

### 3.1 Decision boundary

- No query is promoted to `PROCEED`.
- SEARCH-06 found no direct GSC row for any of the 18 register queries. Adjacent AEO and calculator evidence is recorded in `FIRST_PARTY_SEARCH_EVIDENCE_2026-08-29.md`.
- No decision state changed: the available adjacent rows had zero clicks, and GBP performance was unavailable from the authorized execution surface.
- `TEST` means a bounded experiment is research-justified, not approved for implementation.
- ResponseOS, contractor/home-service SEO, local Miami acquisition, and calculator intent remain separate experiment families.
- GSC, GBP, customer-language, current-page, and measurement evidence must be overlaid before any production proposal.

---

## 4. Required Evidence Before `PROCEED`

At minimum:

1. search-demand or first-party query evidence,
2. SERP intent confirmation,
3. credible ICP/problem fit,
4. Audio Jones right-to-win,
5. current-page or page-gap determination,
6. material disconfirming evidence considered,
7. bounded implementation/measurement plan.

For local pages or local acquisition claims, also require local-market evidence rather than simply adding a city modifier.

---

## 5. Evidence Sources

Preferred evidence hierarchy:

1. Google Search Console / first-party search behavior,
2. DataForSEO quantitative keyword + SERP evidence,
3. Google Business Profile / local behavior,
4. customer-language corpus / discovery calls / CRM notes,
5. Firecrawl competitor page architecture,
6. QuestionFinder / PAA / community-question evidence,
7. broader web research.

No source alone proves commercial opportunity.

---

## 6. Promotion Template

When promoting an opportunity, record:

- Query:
- Source(s):
- Evidence date:
- Location/device:
- Search demand:
- Commercial proxy:
- SERP intent:
- Local intent:
- ICP:
- Pain / desired outcome:
- Current Audio offer:
- Right-to-win:
- Existing URL:
- Proposed page action: optimize existing / consolidate / new candidate / no page
- Competing hypothesis:
- Disconfirming evidence:
- Recommended experiment:
- Success threshold:
- Kill condition:
- Decision state:

---

## 7. Guardrail

This register does **not** authorize production changes by itself. `PROCEED` means the research case is strong enough to present a site action for approval. Production code, messaging, navigation, route, schema, or GBP changes remain separately gated.
