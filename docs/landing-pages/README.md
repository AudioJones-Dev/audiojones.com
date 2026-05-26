# Localized Landing Pages — Build Briefs

Specs for city-targeted landing pages that feed local-pack ranking and pair
with the Audio Jones GBP listing. Each brief is **Markdown optimized for Git
Spec ingestion** — finalize the content, then build the Next.js route.

## Why these pages exist

The GBP at `audiojones@ajdigital.app` services 14 South Florida / Southwest
Florida areas, but our current site has **zero localized content**. Local
SEO is a function of: GBP presence × NAP citation parity × **localized site
content**. Without city pages, we leave 30-60% of local-pack ranking signal
unclaimed.

## Build order (highest ROI first)

| # | Slug | Target query | Priority | Rationale |
|---|---|---|---|---|
| 1 | `/marketing-consultant-hialeah` | "marketing consultant hialeah" | P0 | GBP is verified at Hialeah; closest geographic signal. |
| 2 | `/ai-consultant-miami` | "AI consultant miami" | P0 | Highest-volume market in service area. |
| 3 | `/ai-services-fort-lauderdale` | "AI services fort lauderdale" | P0 | Strong Broward County coverage; adjacent to Hialeah. |
| 4 | `/ai-services-naples` | "AI services naples fl" | P1 | Underserved SW Florida market; blue-collar wedge per CLAUDE.md. |
| 5 | `/ai-services-fort-myers` | "AI services fort myers" | P1 | Same SW Florida thesis as Naples. |
| 6 | `/service-areas` | "audio jones service areas" | P2 | Hub page linking to all city pages; closes the internal-link loop. |

## Page-template anatomy (every city page follows this)

1. **Hero block** — H1 + city-specific sub-headline + primary CTA
2. **Local proof block** — "Why founders in [City] choose Audio Jones" + 2-3 city-relevant pain points
3. **Services grid** — 3-6 cards of the most relevant services for that city's industry mix
4. **Local context** — paragraph weaving in 2-3 notable local landmarks / business districts / industries
5. **Case study or testimonial** — at least 1 client story relevant to the city or industry (use placeholder until reviews accumulate)
6. **FAQ** — 4-6 questions with FAQ schema markup
7. **NAP block** — name, address (or "service area"), phone, hours — must match GBP byte-for-byte
8. **CTA block** — book a call link, lead form, or strategy session
9. **JSON-LD** — `Service` schema with `areaServed` pointing to the city + `LocalBusiness` reference back to the canonical entity

## SEO requirements (every page)

- **Title tag**: `[Primary service] in [City], FL — Audio Jones` (50-60 chars)
- **Meta description**: 140-160 chars, mentions city + 1-2 services + USP
- **H1**: One per page, includes city name
- **Word count**: 800-1500 words, written for humans first
- **Internal links**: At least 3 links to other site pages (services, about, book) + 1 link to each other city page (cross-link the hub)
- **Image with alt text**: At least 1 city-relevant image with descriptive alt
- **Schema**: `Service` + `FAQPage` + canonical `LocalBusiness` reference

## Anti-pattern: AI-generated city pages

Many sites use a templated city-page generator and end up with **doorway
pages** — thin variants that say the same thing with the city name swapped.
Google penalizes this aggressively. Each page in this folder must contain
genuinely city-specific copy:

- Mention real local industries (Hialeah's manufacturing/import; Miami's
  tech + finance; Fort Lauderdale's marine + hospitality; Naples/Fort
  Myers's HVAC + marine + restoration)
- Reference real city pain points (Hialeah Spanish-language market;
  Miami's competitive professional-services landscape)
- Use the brand's actual positioning (Founder Intelligence Systems, the
  blue-collar AI wedge for SW Florida)

## Build sequence per page

1. PRD-style brief in this folder (`/docs/landing-pages/[slug].md`)
2. Spec review with stakeholder approval
3. Implement the Next.js route at `src/app/[slug]/page.tsx`
4. Run validation contract (`pnpm typecheck && pnpm lint && pnpm build`)
5. Add to sitemap (`src/lib/site.ts` `publicRoutes`)
6. Deploy + submit URL to Search Console for indexing
7. Add link from `/service-areas` hub page after at least 3 city pages exist
