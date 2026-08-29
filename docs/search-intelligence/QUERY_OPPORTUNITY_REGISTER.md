# Audio Jones Query Opportunity Register — SEARCH-04+

**Status:** empty canonical decision register; populate only from validated evidence  
**Snapshot date:** 2026-08-29  
**Governing inputs:** `SEARCH_INTELLIGENCE_PRD.md`, `KEYWORD_SEED_REGISTER.md`, `DATAFORSEO_EXECUTION_SPEC.md`

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

_No opportunities promoted yet._

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
