# Schema And Entity Gap Report

Generated: 2026-06-29  
Evidence: Firecrawl summaries, `src/lib/seo/schema.ts`, selected page source files, and `docs/strategy/AUDIOJONES_SEO_AEO_ENTITY_IMPLEMENTATION_PLAN.md`.

## Important Limitation

Firecrawl's scraped body/html output did not reliably expose JSON-LD blocks for the crawled pages. Therefore, competitor schema findings are detection notes, not definitive absence claims.

For Audio Jones, local source inspection is stronger evidence than Firecrawl body extraction.

## Audio Jones Schema Facts

Local source confirms reusable JSON-LD helpers for:

- `Organization`
- `Person`
- `WebSite`
- `BreadcrumbList`
- `FAQPage`
- `Article`
- `DefinedTerm`
- `SpeakableSpecification`

Observed source usage:

- Homepage emits `Organization`, `Person`, and `WebSite`.
- `/services` emits `FAQPage`.
- `/pricing` emits `BreadcrumbList` and `FAQPage`.
- `/about` emits `Organization`, `Person`, and `BreadcrumbList`.
- Insight and framework pages use `Article`, `DefinedTerm`, `BreadcrumbList`, and `FAQPage` patterns on selected routes.

## Entity Gap

Audio Jones has the right schema primitives, but the entity model is not fully deployed across the commercial taxonomy.

| Entity/Surface | Current Evidence | Gap | Recommendation |
|---|---|---|---|
| Organization | `organizationJsonLd()` includes brand, legal name, URL, logo, sameAs, founder. | Consider `parentOrganization`/`subOrganization` modeling if brand/entity distinction matters for retrieval. | Keep `Audio Jones` as brand and `AJ Digital LLC` as legal entity; verify rendered output. |
| Founder Intelligence Systems | Framework page exists and local plan defines entity strategy. | First-mention qualifier and schema expansion need consistency. | Use "Founder Intelligence Systems for founder-led service businesses" on first visible mention per page. |
| Founder Revenue Leak Diagnostic | Planned as P0 entity in strategy doc; current `/pricing` includes Revenue Leak Diagnostic. | No dedicated canonical route found in current plan implementation. | Build dedicated diagnostic landing page with `Service`, `DefinedTerm`, and `FAQPage`. |
| Founder Revenue System | Planned as core installed offer. | No dedicated route yet. | Build `/services/founder-revenue-system` or approved equivalent with `Service` + `DefinedTerm`. |
| ResponseOS | Public offer exists. | Treat as productized system/service with schema, not just a page. | Add `Service` schema and connect to pricing/diagnostic. |
| Founder Operator Under Cognitive Load | Planned persona/entity. | No route yet. | Build framework/persona page with `DefinedTerm`, `Article`, and internal links to diagnostic/system pages. |
| Vertical pages | Accessibility contractors listed as planned. | No vertical route yet. | Build one vertical only where sales motion supports it; use `Service` + `Article`. |

## Competitor Entity Patterns

| Site | Observed Entity Pattern | Structural Lesson |
|---|---|---|
| NinjaAI | Dense AI visibility/GEO/AEO/HEO category language, FAQ, case-study surfaces. | Audio Jones should define its own category terms as canonical entities and avoid drifting into generic AI visibility language. |
| Content Allies | B2B podcast production, cost, ROI, top-agency, case-study clusters. | Use cost/ROI/proof structures without copying podcast-agency positioning. |
| Sweet Fish | B2B video/podcast service taxonomy, client proof, AI-search article. | Convert service taxonomy into buyer-readable paths and support with proof. |
| Local competitors | Geo/service pages with quote/contact paths. | Only add local schema if local acquisition is deliberate. |

## Recommended Schema Work

| Priority | Action | Impact | Difficulty | Confidence | Dependency |
|---|---|---:|---:|---:|---|
| P0 | Verify rendered JSON-LD on production pages with a source-based test. | High | Low | High | None |
| P0 | Add `Service` schema helper and use it on `/services`, `/pricing`, ResponseOS, and future offer pages. | High | Medium | High | Route/content inventory |
| P0 | Add `DefinedTerm` schema to all canonical framework/entity pages. | High | Medium | High | Entity naming locked |
| P1 | Add `speakableSpec(['h1', '.tldr-block'])` to canonical entity pages. | Medium | Medium | Medium | TLDR block class exists |
| P1 | Add `BreadcrumbList` to all core commercial pages. | Medium | Low | High | Page inventory |
| P2 | Add vertical/local business schema only if a local go-to-market decision is approved. | Medium | Medium | Medium | Local strategy |

## Verification Checklist

1. Use production-rendered HTML, not only Firecrawl body extraction.
2. Confirm one canonical URL per page.
3. Confirm no deprecated entity names appear in schema.
4. Confirm first visible mention uses the required qualifier where applicable.
5. Confirm schema claims match visible page copy.
