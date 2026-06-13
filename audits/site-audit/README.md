# AudioJones.com Site Audit

Generated: 2026-06-08T04:45:21.425Z

## Executive Summary
This is a live, read-only SEO/AEO/CRO/messaging audit of AudioJones.com based on sitemap discovery plus internal-link crawling. The site is generally crawlable and the core marketing pages render as HTML, but the audit found high-impact gaps: sitemap URLs resolve through the non-www to www redirect path, the `Disallow: /book` robots rule also blocks `/book-a-call`, crawl-discovered topic links return 404, AEO direct-answer/FAQ/schema coverage is uneven, and several conversion pages need sharper first-screen ICP/problem/outcome/CTA framing.

## Totals
- Sitemap URLs found: 27
- Internal URLs discovered after crawl: 39
- Pages audited: 30
- URLs skipped with reasons: 9
- Raw page JSON files: 30
- Markdown page reports: 30
- Scorecard rows: 30

## Major Outputs
- [URL inventory](url-inventory.csv)
- [Page scorecard](page-scorecard.csv)
- [Raw page extracts](raw-pages/)
- [Page reports](page-reports/)
- [Fix roadmap](fix-roadmap.md)

## Skipped URLs With Reasons
- https://www.audiojones.com/blog/topic/ai-readiness — error page: HTTP 404
- https://www.audiojones.com/blog/topic/applied-intelligence-systems — error page: HTTP 404
- https://www.audiojones.com/blog/topic/map-attribution — error page: HTTP 404
- https://www.audiojones.com/blog/topic/signal-vs-noise — error page: HTTP 404
- https://www.audiojones.com/blog/topic/why-ai-fails — error page: HTTP 404
- https://www.audiojones.com/book — intentionally blocked by robots.txt
- https://www.audiojones.com/book-a-call — intentionally blocked by robots.txt
- https://www.audiojones.com/sitemap.xml — non-HTML asset discovered via internal link
- https://www.audiojones.com/step-2 — intentionally noindex

## Top 10 Highest-Impact Fixes
1. Fix `robots.txt`: `Disallow: /book` currently blocks `/book-a-call`; change the legacy booking rule so the live booking CTA is crawlable.
2. Repair or remove the five internally linked `/blog/topic/*` URLs returning 404.
3. Align sitemap/canonical host behavior so sitemap URLs match the final `https://www.audiojones.com` destination.
4. Add FAQ/direct-answer blocks and FAQPage JSON-LD on diagnostic, services, pricing, workshops, and agent pages.
5. Fix title-tag duplication/overlong patterns on priority pages such as `/apply`, `/roi-calculator`, and `/insights/why-ai-fails-most-companies`.
6. Rewrite `/apply` around explicit ICP, current-state pain, outcome, and one primary conversion action.
7. Add Service/Offer schema to commercial pages where the offer is the page purpose.
8. Strengthen proof: add permitted metrics, case context, screenshots, or testimonial snippets near conversion CTAs.
9. Tighten CTA hierarchy so each page has one obvious primary next step above the fold.
10. Improve internal links from insights/frameworks into the diagnostic, services, ResponseOS, and booking paths.

## Top 10 SEO Fixes
1. https://www.audiojones.com/agents: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
2. https://www.audiojones.com/ai-readiness-diagnostic: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
3. https://www.audiojones.com/apply: Rewrite the title tag around the exact page intent, primary entity, and Audio Jones brand without duplicating the brand suffix.
4. https://www.audiojones.com/insights/why-ai-fails-most-companies: Rewrite the title tag around the exact page intent, primary entity, and Audio Jones brand without duplicating the brand suffix.
5. https://www.audiojones.com/roi-calculator: Rewrite the title tag around the exact page intent, primary entity, and Audio Jones brand without duplicating the brand suffix.
6. https://www.audiojones.com/workshops: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
7. https://www.audiojones.com/services: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
8. https://www.audiojones.com/applied-intelligence/diagnostic: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
9. https://www.audiojones.com/founder-gravity-audit: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
10. https://www.audiojones.com/founder-gravity-audit/diagnostic: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.

## Top 10 AEO Fixes
1. https://www.audiojones.com/applied-intelligence/diagnostic: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
2. https://www.audiojones.com/apply: Rewrite the title tag around the exact page intent, primary entity, and Audio Jones brand without duplicating the brand suffix.
3. https://www.audiojones.com/founder-gravity-audit: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
4. https://www.audiojones.com/founder-gravity-audit/diagnostic: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
5. https://www.audiojones.com/roi-calculator: Rewrite the title tag around the exact page intent, primary entity, and Audio Jones brand without duplicating the brand suffix.
6. https://www.audiojones.com/ai-readiness-diagnostic: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
7. https://www.audiojones.com/pricing: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
8. https://www.audiojones.com/agents: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
9. https://www.audiojones.com/workshops: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
10. https://www.audiojones.com/services: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.

## Top 10 CRO Fixes
1. https://www.audiojones.com/apply: Rewrite the title tag around the exact page intent, primary entity, and Audio Jones brand without duplicating the brand suffix.
2. https://www.audiojones.com/pricing: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
3. https://www.audiojones.com/services: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
4. https://www.audiojones.com/applied-intelligence/diagnostic: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
5. https://www.audiojones.com/founder-gravity-audit: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
6. https://www.audiojones.com/founder-gravity-audit/diagnostic: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
7. https://www.audiojones.com/ai-readiness-diagnostic: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
8. https://www.audiojones.com/insights/why-ai-fails-most-companies: Rewrite the title tag around the exact page intent, primary entity, and Audio Jones brand without duplicating the brand suffix.
9. https://www.audiojones.com/roi-calculator: Rewrite the title tag around the exact page intent, primary entity, and Audio Jones brand without duplicating the brand suffix.
10. https://www.audiojones.com/workshops: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.

## Top 10 Messaging Fixes
1. https://www.audiojones.com/apply: Rewrite the title tag around the exact page intent, primary entity, and Audio Jones brand without duplicating the brand suffix.
2. https://www.audiojones.com/applied-intelligence/diagnostic: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
3. https://www.audiojones.com/founder-gravity-audit/diagnostic: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
4. https://www.audiojones.com/insights/why-ai-fails-most-companies: Rewrite the title tag around the exact page intent, primary entity, and Audio Jones brand without duplicating the brand suffix.
5. https://www.audiojones.com/founder-gravity-audit: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
6. https://www.audiojones.com/ai-readiness-diagnostic: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
7. https://www.audiojones.com/pricing: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
8. https://www.audiojones.com/roi-calculator: Rewrite the title tag around the exact page intent, primary entity, and Audio Jones brand without duplicating the brand suffix.
9. https://www.audiojones.com/workshops: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.
10. https://www.audiojones.com/services: Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.

## Page Reports
- [https://www.audiojones.com](page-reports/home.md)
- [https://www.audiojones.com/about](page-reports/about.md)
- [https://www.audiojones.com/agents](page-reports/agents.md)
- [https://www.audiojones.com/agents/responseos](page-reports/agents-responseos.md)
- [https://www.audiojones.com/ai-readiness-diagnostic](page-reports/ai-readiness-diagnostic.md)
- [https://www.audiojones.com/applied-intelligence](page-reports/applied-intelligence.md)
- [https://www.audiojones.com/applied-intelligence/diagnostic](page-reports/applied-intelligence-diagnostic.md)
- [https://www.audiojones.com/apply](page-reports/apply.md)
- [https://www.audiojones.com/blog](page-reports/blog.md)
- [https://www.audiojones.com/cancellation-policy](page-reports/cancellation-policy.md)
- [https://www.audiojones.com/case-studies](page-reports/case-studies.md)
- [https://www.audiojones.com/cookie-policy](page-reports/cookie-policy.md)
- [https://www.audiojones.com/founder-gravity-audit](page-reports/founder-gravity-audit.md)
- [https://www.audiojones.com/founder-gravity-audit/diagnostic](page-reports/founder-gravity-audit-diagnostic.md)
- [https://www.audiojones.com/frameworks](page-reports/frameworks.md)
- [https://www.audiojones.com/frameworks/applied-intelligence-systems](page-reports/frameworks-applied-intelligence-systems.md)
- [https://www.audiojones.com/frameworks/map-attribution](page-reports/frameworks-map-attribution.md)
- [https://www.audiojones.com/frameworks/niche-framework](page-reports/frameworks-niche-framework.md)
- [https://www.audiojones.com/frameworks/signal-vs-noise](page-reports/frameworks-signal-vs-noise.md)
- [https://www.audiojones.com/insights](page-reports/insights.md)
- [https://www.audiojones.com/insights/applied-intelligence-systems](page-reports/insights-applied-intelligence-systems.md)
- [https://www.audiojones.com/insights/marketing-attribution-causal-identification](page-reports/insights-marketing-attribution-causal-identification.md)
- [https://www.audiojones.com/insights/signal-vs-noise-business](page-reports/insights-signal-vs-noise-business.md)
- [https://www.audiojones.com/insights/why-ai-fails-most-companies](page-reports/insights-why-ai-fails-most-companies.md)
- [https://www.audiojones.com/pricing](page-reports/pricing.md)
- [https://www.audiojones.com/privacy-policy](page-reports/privacy-policy.md)
- [https://www.audiojones.com/roi-calculator](page-reports/roi-calculator.md)
- [https://www.audiojones.com/services](page-reports/services.md)
- [https://www.audiojones.com/terms-of-service](page-reports/terms-of-service.md)
- [https://www.audiojones.com/workshops](page-reports/workshops.md)

## Quality Control
- Sitemap URLs vs audited URLs confirmed: 27 sitemap URLs, 30 audited pages after crawl expansion and skip classification.
- No discovered HTML page was skipped without a reason: confirmed.
- Every audited page has a scorecard row: confirmed.
- Every audited page has a markdown report: confirmed.
- README links to major outputs: confirmed.
