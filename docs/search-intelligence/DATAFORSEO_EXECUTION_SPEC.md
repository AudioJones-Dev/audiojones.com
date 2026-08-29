# DataForSEO Quantitative Execution Spec — SEARCH-04

**Status:** execution-ready; DataForSEO MCP action exposure pending in active ChatGPT session  
**Snapshot date:** 2026-08-29  
**Branch:** `docs/search-intelligence-seo-aeo-2026`  
**Governing inputs:** `KEYWORD_SEED_REGISTER.md`, `SEARCH_INTELLIGENCE_PRD.md`

---

## 1. Objective

Quantitatively validate the controlled 25-seed universe before any search-driven site architecture, messaging, URL, navigation, or production-copy change.

The run must answer:

1. Which identity language reflects actual search demand: founder, business owner, service business, contractor, home service business, etc.?
2. Which ResponseOS bridge terms have measurable demand and commercial intent?
3. Which automation / systems categories create a credible acquisition lane for Audio Jones?
4. Which local SEO / digital visibility terms justify a Miami/South Florida acquisition layer?
5. Which measurement / attribution / calculator concepts deserve commercial or freemium pages?
6. What SERP composition and competitors exist for each surviving query?

These are research inputs, not page-authoring instructions.

---

## 2. DataForSEO MCP Contract

The installed MCP exposes a generic authenticated action:

`api_request`

Expected wrapper shape:

```json
{
  "method": "GET|POST|PUT|DELETE",
  "path": "/v3/...",
  "data": {},
  "noAiMode": false
}
```

Use `path`, not a full URL, unless the MCP requires otherwise.

Keep `noAiMode=false` by default to reduce response size. Set `true` only when a field needed for analysis is missing from the AI-optimized response.

---

## 3. Priority Batch A — 25 Controlled Seeds

1. service business
2. service business owner
3. business owner
4. founder
5. contractor
6. home service business
7. AI receptionist
8. AI receptionist for service businesses
9. AI receptionist for contractors
10. missed call automation
11. lead follow up automation
12. CRM automation
13. CRM for contractors
14. business process automation
15. AI automation for small business
16. AI automation for service businesses
17. business systems consultant
18. local SEO
19. local SEO for service businesses
20. SEO for contractors
21. Google Business Profile optimization
22. website optimization
23. marketing attribution for small business
24. revenue attribution
25. missed call revenue calculator

---

## 4. Run A — United States Search Volume + Commercial Proxy

### Endpoint

`POST /v3/keywords_data/google_ads/search_volume/live`

### Purpose

Capture for all 25 seeds:

- search volume,
- competition / competition index,
- CPC,
- low top-of-page bid,
- high top-of-page bid,
- monthly search history / trend where returned.

### MCP call

```json
{
  "method": "POST",
  "path": "/v3/keywords_data/google_ads/search_volume/live",
  "data": [
    {
      "location_name": "United States",
      "language_code": "en",
      "search_partners": false,
      "keywords": [
        "service business",
        "service business owner",
        "business owner",
        "founder",
        "contractor",
        "home service business",
        "AI receptionist",
        "AI receptionist for service businesses",
        "AI receptionist for contractors",
        "missed call automation",
        "lead follow up automation",
        "CRM automation",
        "CRM for contractors",
        "business process automation",
        "AI automation for small business",
        "AI automation for service businesses",
        "business systems consultant",
        "local SEO",
        "local SEO for service businesses",
        "SEO for contractors",
        "Google Business Profile optimization",
        "website optimization",
        "marketing attribution for small business",
        "revenue attribution",
        "missed call revenue calculator"
      ]
    }
  ],
  "noAiMode": false
}
```

### Important interpretation rule

Google Ads can combine volume for similar keyword variants. Do not treat apparent equality as proof the market views two concepts identically. If two strategic control terms return suspiciously identical values, rerun them in separate requests before drawing a messaging conclusion.

---

## 5. Run B — Miami Local Search Volume Controls

### Endpoint

`POST /v3/keywords_data/google_ads/search_volume/live`

### Purpose

Test whether local commercial demand exists for the terms most relevant to Audio Jones's Miami/South Florida acquisition strategy.

Use DataForSEO's canonical location name after validating it through the locations endpoint. Preferred target:

`Miami,Florida,United States`

### Initial local batch

- AI automation consultant Miami
- business automation Miami
- local SEO Miami
- SEO consultant Miami
- SEO for contractors Miami
- website design for service businesses Miami
- AI receptionist Miami
- small business AI consultant Miami
- Google Business Profile optimization Miami
- CRM automation Miami

### Preflight location validation

```json
{
  "method": "GET",
  "path": "/v3/keywords_data/google_ads/locations",
  "noAiMode": false
}
```

Filter the response for Miami, Florida and persist the canonical `location_name` and `location_code` in the result artifact.

Then run:

```json
{
  "method": "POST",
  "path": "/v3/keywords_data/google_ads/search_volume/live",
  "data": [
    {
      "location_name": "Miami,Florida,United States",
      "language_code": "en",
      "search_partners": false,
      "keywords": [
        "AI automation consultant Miami",
        "business automation Miami",
        "local SEO Miami",
        "SEO consultant Miami",
        "SEO for contractors Miami",
        "website design for service businesses Miami",
        "AI receptionist Miami",
        "small business AI consultant Miami",
        "Google Business Profile optimization Miami",
        "CRM automation Miami"
      ]
    }
  ],
  "noAiMode": false
}
```

Do not create Miami/city pages merely because a localized query has volume.

---

## 6. Run C — Keyword Expansion

### Endpoint

`POST /v3/keywords_data/google_ads/keywords_for_keywords/live`

### Purpose

Generate market-language variants from strategic seeds rather than relying only on our wording.

DataForSEO accepts up to 20 seed keywords for this endpoint. Use two bounded thematic runs rather than feeding the entire universe at once.

### C1 — Revenue capture / ResponseOS

```json
{
  "method": "POST",
  "path": "/v3/keywords_data/google_ads/keywords_for_keywords/live",
  "data": [
    {
      "location_name": "United States",
      "language_code": "en",
      "keywords": [
        "AI receptionist",
        "virtual receptionist",
        "answering service",
        "missed call automation",
        "missed call text back",
        "lead follow up automation",
        "automated lead follow up",
        "CRM automation",
        "CRM for contractors",
        "quote follow up automation",
        "estimate follow up automation",
        "appointment booking automation"
      ]
    }
  ],
  "noAiMode": false
}
```

### C2 — Search / automation / systems

```json
{
  "method": "POST",
  "path": "/v3/keywords_data/google_ads/keywords_for_keywords/live",
  "data": [
    {
      "location_name": "United States",
      "language_code": "en",
      "keywords": [
        "local SEO",
        "SEO for contractors",
        "SEO for home services",
        "Google Business Profile optimization",
        "AI search optimization",
        "business process automation",
        "AI automation for small business",
        "AI automation for service businesses",
        "business systems consultant",
        "automation consultant",
        "marketing attribution for small business",
        "marketing ROI calculator"
      ]
    }
  ],
  "noAiMode": false
}
```

### Expansion retention rule

Do not promote every returned keyword. Retain only terms that plausibly map to:

`ICP → problem/outcome → Audio capability/offer → page intent`

Reject irrelevant tool/product/software searches when Audio Jones does not have a credible right-to-win.

---

## 7. Run D — Google SERP Composition

### Endpoint

`POST /v3/serp/google/organic/live/regular`

### Purpose

For promoted or ambiguous seeds, establish:

- organic result composition,
- local pack presence,
- People Also Ask / question features when returned,
- paid-result density,
- top domains and ranking URLs,
- page type / intent pattern,
- whether Google interprets the query as informational, local, software, agency/service, marketplace, or mixed intent.

Each Live SERP call contains one task. Do not run all 25 automatically on the first pass. Begin with the highest decision value queries.

### First SERP batch

1. AI receptionist
2. AI receptionist for contractors
3. missed call automation
4. lead follow up automation
5. CRM automation
6. business process automation
7. AI automation for small business
8. business systems consultant
9. local SEO
10. local SEO for service businesses
11. SEO for contractors
12. Google Business Profile optimization
13. marketing attribution for small business
14. missed call revenue calculator

### National call template

```json
{
  "method": "POST",
  "path": "/v3/serp/google/organic/live/regular",
  "data": [
    {
      "keyword": "AI receptionist",
      "location_name": "United States",
      "language_code": "en",
      "device": "desktop",
      "os": "windows",
      "depth": 20
    }
  ],
  "noAiMode": false
}
```

### Miami call template

For terms with plausible local intent, repeat using the validated Miami location:

```json
{
  "method": "POST",
  "path": "/v3/serp/google/organic/live/regular",
  "data": [
    {
      "keyword": "local SEO",
      "location_name": "Miami,Florida,United States",
      "language_code": "en",
      "device": "mobile",
      "os": "android",
      "depth": 20
    }
  ],
  "noAiMode": false
}
```

Use mobile for local-intent validation because mobile search is especially relevant to local service discovery. Use desktop as a control where necessary.

---

## 8. Run E — Local Finder Validation

### Endpoint

`POST /v3/serp/google/local_finder/live/advanced`

### Purpose

Use only for queries where the regular Google SERP indicates local intent or a local pack.

Priority candidates:

- local SEO
- SEO consultant
- Google Business Profile optimization
- website design
- AI consultant / automation consultant if a local pack is present

This is a local-market validation step, not a universal keyword step.

---

## 9. DataForSEO → Firecrawl Handoff

DataForSEO determines **which URLs/domains matter**. Firecrawl then retrieves those pages for architectural and messaging analysis.

For each query promoted after SERP analysis:

1. capture top ranking commercial URLs,
2. classify direct competitors vs directories/software/publishers,
3. send the relevant direct-competitor URLs to Firecrawl,
4. extract title, H1, opening proposition, service language, proof, CTA, FAQ, local signals, schema-visible content, and internal-link context,
5. compare against current AudioJones.com canonical destination.

Canonical operating sequence:

`DataForSEO → search/SERP evidence → Firecrawl → page evidence → HDIKIT/MIOS synthesis → opportunity decision`

---

## 10. Output Schema

Normalize every query into the following fields where evidence exists:

| Field | Requirement |
|---|---|
| query | exact query |
| source | DataForSEO endpoint |
| timestamp | capture time |
| location | location name/code |
| device | desktop/mobile where applicable |
| search_volume | provider value |
| monthly_searches | trend if returned |
| cpc | paid commercial proxy |
| paid_competition | provider competition value |
| top_of_page_bid_low | if returned |
| top_of_page_bid_high | if returned |
| SERP intent | informational/commercial/local/software/mixed/etc. |
| local_pack | yes/no/unknown |
| PAA | questions if returned |
| top_domains | relevant top domains |
| top_urls | relevant ranking pages |
| related_keywords | retained market-language variants |
| ICP | Audio target fit |
| pain/outcome | mapped customer problem/result |
| Audio offer | ResponseOS / Search / Systems / M.A.P. / tool / etc. |
| current URL | existing canonical destination if any |
| page gap | none / optimize / new candidate / unresolved |
| right-to-win | 1–5 |
| commercial fit | 1–5 |
| evidence confidence | low/medium/high |
| decision | IGNORE/WATCH/SPIKE/TEST/PROCEED |

Provider metrics must remain identified as DataForSEO metrics. Do not merge them with GSC or other provider definitions as if methodologies are identical.

---

## 11. Promotion Gate

A query enters `QUERY_OPPORTUNITY_REGISTER.md` only when enough evidence exists to state:

`query → ICP → pain/outcome → intent → Audio offer → current/new URL hypothesis → commercial value → evidence confidence`

A query with volume but weak right-to-win does not automatically become an opportunity.

A query with low volume but strong commercial relevance may still become a bounded experiment if customer-language, GSC, competitor, or local evidence supports it.

---

## 12. Immediate Execution Order Once MCP Is Callable

1. Smoke test: `GET /v3/keywords_data/google_ads/locations`.
2. Resolve canonical Miami location name/code.
3. Run **A** — US 25-seed search-volume batch.
4. Run **B** — Miami local-control batch.
5. Run **C1/C2** — two bounded keyword-expansion calls.
6. Rank seeds by decision value, not volume alone.
7. Run **D** — SERP calls on the first 14 decision-critical queries.
8. Run **E** only where local SERP evidence warrants it.
9. Firecrawl the ranking competitor pages that materially affect a decision.
10. Populate `QUERY_OPPORTUNITY_REGISTER.md`.
11. Apply HDIKIT falsification before recommending new routes/pages.

---

## 13. Cost / Scope Controls

- Do not run SERPs for the entire expanded keyword universe.
- Do not run Local Finder unless local intent is established.
- Do not crawl every competitor URL returned by a SERP.
- Prefer one search-volume call containing the controlled seed set rather than many individual calls unless Google Ads variant grouping creates ambiguity.
- Split strategically similar terms into separate volume calls only when needed to resolve grouping artifacts.
- Keep raw API evidence separate from canonical decisions.

---

## 14. Current Blocker

As of this snapshot, ChatGPT recognizes the installed DataForSEO dev-mode app and its OAuth/permissions, but its actions are not yet exposed in this conversation's callable namespace. Firecrawl is exposed and callable.

This is an execution-surface issue, not authorization to substitute estimates for DataForSEO metrics.
