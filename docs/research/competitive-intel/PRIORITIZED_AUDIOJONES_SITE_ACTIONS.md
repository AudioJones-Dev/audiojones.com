# Prioritized Audio Jones Site Actions

Generated: 2026-06-29  
Evidence: Firecrawl summaries, local source inspection, and existing Audio Jones SEO/AEO strategy docs.

## Priority Model

Scale: 1 low, 5 high.

| Priority | Action | Impact | Difficulty | Confidence | Dependency | Type |
|---|---|---:|---:|---:|---|---|
| P0 | Verify rendered JSON-LD on production for homepage, services, pricing, diagnostic, and one insight page. | 5 | 1 | 5 | None | Quick win |
| P0 | Add `.firecrawl/` to `.gitignore` so crawl scratch never becomes a commit candidate. | 4 | 1 | 5 | None | Done in this run |
| P0 | Add a "which path fits you?" decision block to `/pricing`. | 4 | 2 | 4 | Existing pricing data | Quick win |
| P0 | Add related-link blocks to insight/framework pages. | 4 | 2 | 4 | Page inventory | Quick win |
| P0 | Create canonical Founder Revenue Leak Diagnostic page. | 5 | 3 | 5 | Route approval | Strategic |
| P0 | Add `Service` schema helper and apply to core offer pages. | 5 | 3 | 4 | Schema verification | Strategic |
| P1 | Publish "What does a Revenue Leak Diagnostic cost?" article. | 4 | 2 | 4 | Pricing approved | Quick win |
| P1 | Publish "AI readiness for founder-led service businesses" page. | 4 | 2 | 4 | Diagnostic copy approved | Quick win |
| P1 | Create consent-safe proof cards on `/case-studies`. | 5 | 3 | 4 | Proof inputs | Strategic |
| P1 | Create Founder Revenue System page. | 5 | 3 | 4 | Naming/route approval | Strategic |
| P1 | Add direct-answer FAQ sections to `/founder-intelligence`, `/case-studies`, and `/blog`. | 4 | 2 | 4 | Copy review | Quick win |
| P2 | Build podcast/content bridge cluster. | 3 | 3 | 3 | Strategy approval | Strategic |
| P2 | Build accessibility-contractor vertical page. | 4 | 4 | 3 | Vertical go-to-market approval | Strategic |
| P2 | Add monthly AEO retrieval probe workflow outside this repo. | 4 | 4 | 3 | Measurement repo | Strategic |

## 30-Day Implementation Plan

### Week 1: Verification And Low-Risk Structure

- Verify rendered JSON-LD on production source for key routes.
- Confirm which existing pages emit `Organization`, `Person`, `WebSite`, `FAQPage`, `BreadcrumbList`, `Article`, and `DefinedTerm`.
- Add decision block spec for `/pricing`.
- Draft related-link module spec for insights/frameworks.
- Do not add new routes until route names are approved.

### Week 2: Quick-Win Content And Internal Links

- Add related-link blocks to high-value pages: `/insights/revenue-leak-diagnostic`, `/frameworks/founder-intelligence-systems`, `/founder-intelligence`, `/services`, `/pricing`.
- Add direct-answer FAQ sections where missing.
- Draft and review the "Revenue Leak Diagnostic cost" article.
- Draft and review the "AI readiness for founder-led service businesses" page.

### Week 3: Entity And Schema Buildout

- Implement `Service` schema helper after production schema verification.
- Add Service schema to `/services`, `/pricing`, and ResponseOS-related surfaces.
- Build the Founder Revenue Leak Diagnostic canonical page after route approval.
- Add `DefinedTerm` and `FAQPage` schema to the diagnostic page.

### Week 4: Proof And Strategic Cluster

- Update `/case-studies` with consent-safe proof cards.
- Decide route for Founder Revenue System and scaffold page if approved.
- Create internal link paths from diagnostic -> pricing -> ResponseOS -> Founder Revenue System.
- Prepare next-month backlog for Founder Operator Under Cognitive Load, business memory, attribution, and vertical page.

## Human Approval Gates

Use `proceed` before implementation that changes public routes, public copy, schema strategy, or offer naming.

Required decisions:

- Approve route for Founder Revenue Leak Diagnostic.
- Approve route for Founder Revenue System.
- Confirm whether local/Miami/Florida pages are part of the current sales strategy.
- Confirm proof/case-study claims that can be public, anonymized, or withheld.

## Not Recommended

- Do not copy competitor podcast-agency copy or service package framing.
- Do not pivot Audio Jones back into generic podcast production.
- Do not claim ranking gaps without verified SERP or keyword data.
- Do not add local SEO pages unless they match the sales motion.
- Do not ship schema claims that are not visible on the page.
