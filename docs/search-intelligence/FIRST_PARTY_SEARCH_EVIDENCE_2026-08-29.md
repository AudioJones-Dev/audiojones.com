# Audio Jones First-Party Search Evidence — 2026-08-29

**Status:** SEARCH-06 GSC overlay complete; GBP evidence unavailable; no production authorization
**Capture date:** 2026-08-29
**GSC property:** `sc-domain:audiojones.com`
**Search window:** 2025-05-04 through 2026-08-26 (480 days)
**Search type:** Web

---

## 1. Scope and evidence rules

- The existing `aj-gsc` CLI reported an authenticated, read-only session. No auth files were opened and no login was initiated.
- Search Console query rows are first-party performance evidence, but they are not exhaustive because Google can omit anonymized queries.
- `No returned row` means the query was absent from the returned query dataset. It does not prove zero searches, impressions, or demand.
- Direct matches and adjacent concept matches are kept separate. Adjacent language cannot substitute for the register query without an explicit rationale.
- CTR and average position below are Search Console metrics, not DataForSEO metrics.
- Google Business Profile evidence was not available from an authorized callable source, installed reporting tool, or bounded local report-file discovery. This is an access/evidence gap, not proof that the profile has no performance data.
- Nothing in this artifact authorizes public copy, route, navigation, schema, code, GBP, credential, dependency, commit, push, PR, merge, or deployment changes.

## 2. Read-only request ledger

| Pull | Dimensions | Rows returned | Purpose |
|---|---|---:|---|
| GSC-1 | `query,page,country,device` | 97 | Query-to-page mapping with geography and device detail |
| GSC-2 | `query,page` | 47 | Stable query/page totals |
| GSC-3 | `query` | 31 | Query-level totals and direct-match control |
| GSC-4 | `country,device` | 82 | Site-level geography/device context; not used as query-level proof |

All pulls used the same property, 480-day window, and Web search type. The query-only response contained 182 disclosed-query impressions and 4 clicks. These totals exclude anonymized query data and therefore must not be treated as complete site totals.

## 3. First-party clusters that intersect the register

### 3.1 Miami AEO language — adjacent to SEARCH-04-011

| Returned query | Clicks | Impressions | CTR | Average position | Page | Geography / device |
|---|---:|---:|---:|---:|---|---|
| `aeo agency` | 0 | 4 | 0% | 1.00 | `https://www.audiojones.com/` | USA / desktop |
| `aeo agency miami` | 0 | 15 | 0% | 1.67 | `https://www.audiojones.com/` | USA / desktop |
| `aeo consulting miami` | 0 | 1 | 0% | 1.00 | `https://www.audiojones.com/` | USA / desktop |
| `aeo marketing agency miami` | 0 | 11 | 0% | 13.73 | `https://www.audiojones.com/` | USA / desktop |
| **Adjacent cluster total** | **0** | **31** | **0%** | **5.84 weighted** | homepage | USA / desktop |

Interpretation:

- This is first-party evidence that Google has exposed the site for AEO agency/consulting language, including Miami modifiers.
- It is not a direct match for `AI search optimization`, and it points to the homepage rather than the register's `/solutions` hypothesis.
- Strong positions on three small rows are positive right-to-win evidence, but zero clicks, a 31-impression sample, and one weaker variant prevent promotion to `PROCEED`.
- Decision effect: retain SEARCH-04-011 at `SPIKE` until click behavior, exact-query exposure, current-page intent, or a bounded measurement plan resolves the ambiguity.

### 3.2 Revenue-recovery calculator language — adjacent to SEARCH-04-012 and SEARCH-04-013

| Returned query | Clicks | Impressions | CTR | Average position | Page | Geography / device |
|---|---:|---:|---:|---:|---|---|
| `revenue recovery calculator` | 0 | 8 | 0% | 12.00 | `https://audiojones.com/roi-calculator` | USA / desktop |
| `revenue recovery calculator` | 0 | 24 | 0% | 20.17 | `https://www.audiojones.com/roi-calculator` | USA / desktop |
| `revenue recovery calculator` | 0 | 8 | 0% | 26.50 | `https://www.audiojones.com/roi-calculator` | USA / mobile |
| `revenue recovery calculator` | 0 | 1 | 0% | 16.00 | `https://www.audiojones.com/roi-calculator` | France / desktop |
| **Adjacent cluster total** | **0** | **41** | **0%** | **19.71 weighted** | `/roi-calculator` | USA 40 / France 1; desktop 33 / mobile 8 |

Interpretation:

- The existing calculator URL has first-party exposure for revenue-recovery tool intent.
- The evidence does not establish either `missed call` or `marketing ROI` specificity, so it cannot choose between those two register hypotheses.
- Zero clicks and an average position near 20 are disconfirming evidence against treating the current exposure as a proven winner.
- The split between `www` and non-`www` rows is recorded as historical exposure only; this 480-day aggregate does not by itself prove a current canonical-host defect.
- Decision effect: retain SEARCH-04-012 and SEARCH-04-013 at `TEST`; the overlay strengthens the shared calculator-family hypothesis but does not justify `PROCEED`.

### 3.3 Rejected substitutions

- Miami AEO rows are not substituted for `local SEO Miami` or `SEO consultant Miami`; AEO and SEO are adjacent services with different query language.
- `revenue diagnostics` (3 impressions, 0 clicks, average position 60.33 on `/insights/revenue-leak-diagnostic`) is not substituted for a calculator query.
- `food waste roi calculator` and `product recovery system roi` are unrelated vertical/tool intents and are not positive evidence for Audio Jones's calculator opportunity.
- Branded and brand-confusion queries are excluded from opportunity promotion.

## 4. Mapping against all 18 opportunities

| ID | Register query | Direct GSC row | Accepted adjacent evidence | First-party metrics | Geography / device | Observed page | Decision effect |
|---|---|---|---|---|---|---|---|
| SEARCH-04-001 | AI receptionist | No returned row | None | — | — | — | Retain `TEST`; no first-party validation |
| SEARCH-04-002 | AI receptionist for contractors | No returned row | None | — | — | — | Retain `TEST`; no first-party validation |
| SEARCH-04-003 | virtual receptionist | No returned row | None | — | — | — | Retain `SPIKE`; category ambiguity unresolved |
| SEARCH-04-004 | answering service | No returned row | None | — | — | — | Retain `SPIKE`; differentiation unresolved |
| SEARCH-04-005 | missed call automation | No returned row | None | — | — | — | Retain `WATCH`; no first-party validation |
| SEARCH-04-006 | CRM for contractors | No returned row | None | — | — | — | Retain `SPIKE`; software-intent mismatch unresolved |
| SEARCH-04-007 | SEO for contractors | No returned row | None | — | — | — | Retain `TEST`; capability/right-to-win proof absent |
| SEARCH-04-008 | SEO for home services | No returned row | None | — | — | — | Retain `TEST`; cluster hypothesis remains external-evidence-led |
| SEARCH-04-009 | local SEO Miami | No returned row | Miami AEO rejected as substitution | — | — | — | Retain `SPIKE`; GBP unavailable and local SEO proof absent |
| SEARCH-04-010 | SEO consultant Miami | No returned row | Miami AEO rejected as substitution | — | — | — | Retain `SPIKE`; GBP unavailable and exact local proof absent |
| SEARCH-04-011 | AI search optimization | No returned row | AEO agency/consulting family | 0 clicks / 31 impressions / 0% CTR / 5.84 avg. position | USA / desktop | homepage | Retain `SPIKE`; adjacent visibility, no click or exact-intent proof |
| SEARCH-04-012 | missed call revenue calculator | No returned row | Revenue recovery calculator | 0 clicks / 41 impressions / 0% CTR / 19.71 avg. position | USA 40, France 1 / desktop 33, mobile 8 | `/roi-calculator` | Retain `TEST`; tool family supported, missed-call specificity absent |
| SEARCH-04-013 | marketing ROI calculator | No returned row | Revenue recovery calculator | 0 clicks / 41 impressions / 0% CTR / 19.71 avg. position | USA 40, France 1 / desktop 33, mobile 8 | `/roi-calculator` | Retain `TEST`; tool family supported, marketing-ROI specificity absent |
| SEARCH-04-014 | business systems consultant | No returned row | None | — | — | — | Retain `IGNORE`; no evidence overturns job/career SERP mismatch |
| SEARCH-04-015 | CRM automation | No returned row | None | — | — | — | Retain `WATCH`; no first-party validation |
| SEARCH-04-016 | business process automation | No returned row | None | — | — | — | Retain `WATCH`; broad enterprise intent unresolved |
| SEARCH-04-017 | local SEO | No returned row | None | — | — | — | Retain `WATCH`; GBP unavailable and first-party proof absent |
| SEARCH-04-018 | Google Business Profile optimization | No returned row | None | — | — | — | Retain `WATCH`; GBP unavailable and content/service boundary unresolved |

`—` means no accepted first-party metric was available for that register entry; it does not mean zero.

## 5. Decision reconciliation

No decision state changes are supported by the available first-party evidence.

- `TEST`: 6
- `SPIKE`: 6
- `WATCH`: 5
- `IGNORE`: 1
- `PROCEED`: 0
- `BUILD`: 0

The strongest promotion argument is SEARCH-04-011: small Miami AEO rows show strong homepage positions. The strongest counterargument is more decisive at this gate: the exact register query is absent, all 31 adjacent impressions produced zero clicks, and the observed homepage does not validate the proposed `/solutions` destination.

## 6. Unresolved evidence

- GBP performance, search terms, calls, website actions, direction requests, and geography/device detail: unavailable from the authorized execution surface.
- GSC exact-query evidence for all 18 register phrases: no returned rows.
- Conversion and lead quality: not present in Search Console.
- Query-level city geography: Search Console reports country, not city, in this pull; Miami is inferred only from query text and is not independently geo-verified.
- Recency segmentation: this artifact uses the maximum 480-day window to avoid overstating a very small dataset; it does not claim current-month momentum.

## 7. Next evidence gate

1. Obtain an authorized GBP Performance export or read-only reporting connection without changing profile configuration.
2. Reconcile the homepage's AEO query exposure against the intended search/AEO offer architecture.
3. Inspect the current `/roi-calculator` intent and measurement design before choosing missed-call versus marketing-ROI positioning.
4. Define bounded success thresholds and kill conditions before presenting any implementation proposal.
