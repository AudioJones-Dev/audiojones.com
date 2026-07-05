# Competitor Crawl Inventory

Generated: 2026-06-29  
Tooling: Firecrawl CLI v1.19.21, Firecrawl map, Firecrawl scrape  
Scope: public pages only. No private, login-gated, paywalled, or restricted content was intentionally scraped.

## Operating Notes

- Facts in this report come from Firecrawl map/scrape output and local repo inspection.
- Inferences are labeled as inferences.
- No ranking claims are made. Search position was not verified with SERP or keyword data.
- Competitor copy was not copied into these reports. Raw crawl files remain in ignored `.firecrawl/` scratch space.
- Two APPWT AEO/GEO blog pages failed Firecrawl retries; they are listed under crawl limitations.

## Target Classification

| Site | Classification | Reason |
|---|---|---|
| `https://www.audiojones.com/` | Subject site | Public Audio Jones marketing and Founder Intelligence funnel. |
| `https://www.ninjaai.com/` | AEO competitor; category creation reference; platform threat | AI visibility/GEO/AEO positioning, entity-engineering language, case-study and FAQ pages. |
| `https://www.fame.so/podcast-agency-miami` | Local SERP competitor; direct competitor for podcast-agency Miami queries | Geo-specific podcast agency landing page with proposal CTA. |
| `https://contentallies.com/` | Direct competitor; offer model reference; content-cluster reference | B2B podcast production positioning, cost/ROI/top-agency content, case studies. |
| `https://www.sweetfishmedia.com/` | Direct competitor; offer model reference; content-cluster reference | B2B video/podcast service pages, client proof, AI-search and podcast SEO content. |
| `https://buenavistacreative.com/podcast-production/` | Local SERP competitor; direct competitor for podcast-production Miami queries | Local agency page with podcast production, consultation, FAQ/proof patterns. |
| `https://appwt.com/services/podcast-production/florida-miami/` | Local SERP competitor; AEO competitor; category creation reference | Geo service page plus AI visibility/GEO blog footprint discovered in map. |

## Map Results

| Map File | Discovered URLs |
|---|---:|
| `audiojones.json` | 35 |
| `ninjaai.json` | 100 |
| `fame-podcast-agency-miami.json` | 1 |
| `contentallies.json` | 90 |
| `sweetfishmedia.json` | 97 |
| `buenavistacreative-podcast-production.json` | 0 |
| `buenavistacreative-root.json` | 100 |
| `appwt-podcast-production-florida-miami.json` | 0 |
| `appwt-root.json` | 100 |

## Selected Pages Scraped

33 pages were successfully scraped. Selection prioritized homepage, services, pricing/cost, FAQ/AEO, proof/case studies, resource hubs, local pages, and entity/about pages.

| Site | Successful Pages |
|---|---:|
| Audio Jones | 10 |
| NinjaAI | 6 |
| Fame | 1 |
| Content Allies | 6 |
| Sweet Fish Media | 7 |
| Buena Vista Creative | 2 |
| APPWT | 1 |

## Crawl Limitations

| URL | Result |
|---|---|
| `https://appwt.com/blog/aivo-explained-ai-visibility-optimization-gets-you-found` | Firecrawl timed out at 300000 ms on full and lighter extraction retries. |
| `https://appwt.com/blog/death-of-traditional-seo-why-geo-is-future` | Firecrawl returned a socket hang up on lighter extraction retry. |

## Rerun Inputs

```yaml
workflow: firecrawl-competitive-intel + firecrawl-seo-audit
subject_site: https://www.audiojones.com/
targets:
  - https://www.ninjaai.com/
  - https://www.fame.so/podcast-agency-miami
  - https://contentallies.com/
  - https://www.sweetfishmedia.com/
  - https://buenavistacreative.com/podcast-production/
  - https://appwt.com/services/podcast-production/florida-miami/
selection:
  - homepage
  - service pages
  - pricing/cost pages
  - FAQ/AEO pages
  - case studies/proof
  - blog/resource hubs
  - local/geo landing pages
  - about/entity pages
outputs:
  - markdown reports
  - bounded JSON crawl summary
```
