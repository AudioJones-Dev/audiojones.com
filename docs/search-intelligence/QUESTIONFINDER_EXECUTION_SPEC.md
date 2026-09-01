# QuestionFinder Execution Spec — SEARCH-04Q

**Status:** execution-ready supporting research workflow  
**Snapshot date:** 2026-08-31  
**Branch:** `docs/search-intelligence-seo-aeo-2026`  
**Governing inputs:** `SEARCH_INTELLIGENCE_PRD.md`, `KEYWORD_SEED_REGISTER.md`, `DATAFORSEO_EXECUTION_SPEC.md`

---

## 1. Objective

Use QuestionFinder as the dedicated **question-discovery and buyer-intent expansion layer** inside the Audio Jones search-intelligence system.

QuestionFinder is not the canonical keyword-volume provider and does not replace DataForSEO. Its job is to expose the actual question shapes Google is surfacing around a validated seed so Audio Jones can understand:

- what prospects ask before buying,
- what objections recur,
- which cost/pricing/comparison questions indicate commercial investigation,
- which questions belong on a money page versus supporting content,
- which FAQ blocks may improve answerability/AEO,
- which problem-language variants should be sent back into DataForSEO for quantitative validation.

Canonical role:

`validated seed → QuestionFinder question tree → intent clustering → DataForSEO corroboration where material → query/page mapping → Firecrawl competitor-page analysis`

---

## 2. Source Behavior

QuestionFinder states that it derives questions from:

1. Google Search suggestions,
2. People Also Ask,
3. Related Searches / People Also Search For.

It states that People Also Ask is expanded multiple levels deep and that displayed search volume is based on Google advertising data using 12-month averages rounded to standard buckets.

### Evidence treatment

Treat all QuestionFinder output as **Retrieved** evidence.

Do not treat the following as ground truth without corroboration where the decision is material:

- displayed monthly volume,
- aggregate monthly-search totals,
- `Google Signal`,
- buyer-intent score.

QuestionFinder volume should be stored separately from DataForSEO metrics because provider methodology and normalization may differ.

`Google Signal` and buyer-intent scores are useful prioritization heuristics, not direct ranking factors.

---

## 3. When to Run QuestionFinder

Run QuestionFinder for seeds that satisfy at least one condition:

- DataForSEO indicates meaningful demand,
- Firecrawl/SERP reconnaissance shows strong commercial competition,
- the query maps directly to an Audio Jones money page or product,
- the seed is strategically important but user language remains ambiguous,
- the cluster needs FAQ/AEO/question coverage,
- an existing page needs supporting-query expansion,
- a calculator or comparison opportunity is being evaluated.

Do **not** run the full seed universe mechanically if the parent concept has weak commercial fit.

---

## 4. Priority QuestionFinder Seeds

### ResponseOS / Capture Demand

1. AI receptionist
2. AI receptionist for contractors
3. AI receptionist for service businesses
4. missed call automation
5. missed call text back
6. after-hours answering service
7. lead follow up automation
8. CRM automation for contractors

### Get Found

9. SEO for contractors
10. local SEO for service businesses
11. local SEO Miami
12. Google Business Profile optimization
13. website optimization

### Operate & Automate

14. AI automation for small business
15. AI automation for service businesses
16. business process automation
17. automation consultant
18. business systems consultant — falsification/control

### Measure & Improve / Tools

19. marketing attribution for small business
20. missed call revenue calculator
21. SEO ROI calculator
22. business automation ROI calculator

---

## 5. Collection Fields

For every QuestionFinder row captured, store:

- parent seed,
- exact question,
- QuestionFinder displayed monthly volume,
- QuestionFinder Google Signal,
- QuestionFinder buyer-intent score,
- QuestionFinder buyer-intent label,
- source URL/tool,
- collection date,
- question family,
- ICP,
- pain/problem,
- desired outcome,
- commercial solution category,
- Audio Jones offer/product,
- funnel stage,
- geography/local modifier,
- recommended content role,
- current URL candidate,
- DataForSEO corroboration status,
- final decision state.

Do not overwrite DataForSEO volume/CPC/competition fields with QuestionFinder values.

---

## 6. Question Classification

### BOFU / Commercial Investigation

Examples:

- how much does X cost?
- X pricing
- best X
- X near me
- X vs Y
- alternatives to X
- is X worth it?

Likely content roles:

- money-page sections,
- pricing pages,
- comparison pages,
- calculators,
- buyer FAQs,
- decision-stage supporting articles.

### MOFU / Evaluation

Examples:

- how does X work?
- can X do Y?
- does X integrate with Y?
- problems with X
- should I use X?

Likely roles:

- solution guides,
- product FAQ,
- implementation pages,
- objection handling,
- case evidence.

### TOFU / Problem Awareness

Examples:

- why am I missing calls?
- why are leads going cold?
- how do contractors get more leads?

Likely roles:

- problem pages,
- insights,
- diagnostic entry points,
- authority content.

No question should receive its own page merely because it appears in QuestionFinder.

---

## 7. Clustering Rule

Cluster questions by **shared search intent and buyer decision**, not merely wording similarity.

Example:

- how much does AI receptionist for contractors cost
- average AI receptionist for contractors cost
- AI receptionist for contractors pricing explained
- AI receptionist for contractors cost breakdown by service

These likely belong to one `cost/pricing` intent cluster rather than four separate URLs.

Potential canonical asset:

`AI Receptionist for Contractors: Pricing, Cost Drivers & ROI`

or a pricing/cost section on the primary ResponseOS acquisition page if SERP evidence shows one page can satisfy the intent.

Page architecture is decided only after DataForSEO + SERP + existing-page evidence.

---

## 8. DataForSEO Feedback Loop

QuestionFinder should generate **new candidate queries** for DataForSEO, not bypass DataForSEO.

For questions with strong buyer intent or meaningful strategic fit:

1. send exact question to DataForSEO search-volume endpoint,
2. capture CPC/competition where available,
3. inspect Google SERP composition,
4. determine whether the question is distinct enough to justify an asset,
5. retain both provider observations if values differ,
6. flag material disagreement as `Conflicting` evidence.

Use DataForSEO as the structured quantitative control; use QuestionFinder as the question-language discovery layer.

---

## 9. Firecrawl Feedback Loop

After a question cluster survives quantitative/strategic review:

1. identify ranking URLs from DataForSEO or Firecrawl search,
2. Firecrawl the top relevant commercial/informational pages,
3. extract:
   - title,
   - H1/H2,
   - direct answer,
   - CTA,
   - pricing language,
   - proof,
   - FAQs,
   - internal links,
   - comparison structure,
   - schema/structured-answer patterns where observable,
4. compare against the current AudioJones.com destination page,
5. document the page/content gap.

This turns question discovery into implementation evidence rather than a generic blog-idea list.

---

## 10. QuestionFinder Test — ResponseOS Seed

### Seed

`AI receptionist for contractors`

### Retrieved snapshot

QuestionFinder reported:

- **102 questions**
- **73K aggregate directional monthly searches**

Visible ungated results included:

| Question | QF Volume/mo | Google Signal | Buyer Intent |
|---|---:|---:|---:|
| how much does AI receptionist for contractors cost | 4.0K | 79 | 74 — Buyer |
| average AI receptionist for contractors cost | 2.7K | 74 | 73 — Buyer |
| AI receptionist for contractors cost per hour | 1.7K | 67 | 75 — Buyer |
| AI receptionist for contractors cost near me | 1.1K | 75 | 91 — Buyer |
| is AI receptionist for contractors expensive | 848 | 62 | 33 — Info |

Additional visible rows continued to concentrate around price/cost questions.

### Preliminary interpretation

**Retrieved:** QuestionFinder is surfacing a large cost/pricing question family around the ResponseOS acquisition category.

**Inferred:** Cost/pricing is likely an important decision-stage sub-intent for `AI receptionist for contractors`.

**Unknown until corroborated:** exact demand, CPC, SERP composition, geographic distribution, and whether a dedicated pricing asset should exist.

### Immediate follow-up

Send the following exact questions into DataForSEO:

1. how much does AI receptionist for contractors cost
2. average AI receptionist for contractors cost
3. AI receptionist for contractors cost per hour
4. AI receptionist for contractors cost near me
5. AI receptionist for contractors pricing
6. AI receptionist for contractors ROI
7. AI receptionist vs answering service for contractors

Then compare the ranking pages with Firecrawl.

---

## 11. Operating Sequence

### SEARCH-04A — DataForSEO parent-seed validation

Validate demand, CPC, competition, trends, geography.

### SEARCH-04Q — QuestionFinder expansion

For surviving seeds, collect real question shapes and buyer-intent heuristics.

### SEARCH-04B — DataForSEO exact-question corroboration

Quantify the most commercially relevant QuestionFinder discoveries.

### SEARCH-04C — SERP classification

Determine actual result intent and page types.

### SEARCH-05 — Firecrawl page analysis

Extract and compare ranking pages.

### SEARCH-06 — First-party overlay

Reconcile GSC, GBP, CRM/customer language.

### SEARCH-07 — Query-to-page mapping

Decide whether each cluster maps to:

- optimize existing page,
- new money page,
- pricing/comparison page,
- FAQ section,
- supporting article,
- diagnostic/calculator,
- no asset.

---

## 12. Guardrails

- Do not equate QuestionFinder aggregate search counts with addressable traffic.
- Do not create one article per question.
- Do not use QuestionFinder buyer-intent score as the only commercial-intent signal.
- Do not overwrite DataForSEO metrics with QuestionFinder metrics.
- Do not treat `Google Signal` as a Google ranking factor.
- Do not unlock gated/exported QuestionFinder data by bypassing its email requirement.
- Do not generate mass FAQ content without demonstrated relevance to a commercial or authority cluster.
- Do not change production routes/copy from QuestionFinder results alone.

---

## 13. Canonical Three-Tool Pattern

```text
DATAFORSEO
Quantitative parent demand + SERP + competitor evidence
        ↓
QUESTIONFINDER
Real customer-question expansion + buyer-intent heuristics
        ↓
DATAFORSEO
Exact-question corroboration + SERP classification
        ↓
FIRECRAWL
Ranking-page extraction + content/offer/CTA/internal-link analysis
        ↓
AJ ANALYSIS
HDIKIT + MIOS + right-to-win + page mapping
        ↓
QUERY OPPORTUNITY REGISTER
        ↓
IMPLEMENTATION EXPERIMENT
```

This is the canonical role of QuestionFinder inside the Audio Jones search-intelligence system.