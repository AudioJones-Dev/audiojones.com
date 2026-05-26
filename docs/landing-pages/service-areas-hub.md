# /service-areas (hub page)

**Status:** Draft brief — not yet built
**Priority:** P2 (build AFTER at least 3 city pages exist)
**Target queries:** "audio jones service areas", "where is audio jones based"
**Word count target:** 600-900

## Purpose

A hub page that:
1. Lists all service areas covered by Audio Jones
2. Links to the localized landing pages
3. Closes the internal-linking loop (every city page links back here; this page links to every city page)
4. Provides Google with a clear `Service` schema across multiple `areaServed` entries

This page is also the canonical answer to "where does Audio Jones operate"
for AEO purposes — when ChatGPT / Claude / Perplexity get asked "what
markets does Audio Jones serve", this page is the source of record.

## SEO metadata

| Field | Value |
|---|---|
| Title tag | `Service Areas — Where Audio Jones Operates in Florida` |
| Meta description | `Audio Jones serves founder-led businesses across South Florida (Miami-Dade, Broward) and Southwest Florida (Naples, Fort Myers). See all 14 service areas.` |
| Canonical URL | `https://www.audiojones.com/service-areas` |
| H1 | `Service Areas` |

## Page structure

### Hero block

**Headline:** Where Audio Jones Operates

**Sub-headline:** Founder-led businesses across South Florida and Southwest
Florida. In-person sessions when geographically practical, remote delivery
everywhere. Bilingual (English/Spanish) across all services.

### Primary metro section — South Florida

Linked card layout for each city:

**Miami-Dade County**
- [Hialeah](/marketing-consultant-hialeah) — HQ
- [Miami](/ai-consultant-miami) — primary metro
- *(future)* Miami Beach, Coral Gables, Doral

**Broward County**
- [Fort Lauderdale](/ai-services-fort-lauderdale)
- *(future)* Hollywood, Pembroke Pines, Miramar, Davie

### Secondary metro section — Southwest Florida

**Collier + Lee Counties**
- [Naples](/ai-services-naples)
- [Fort Myers](/ai-services-fort-myers)
- *(future)* Bonita Springs, Cape Coral, Estero

### "How we deliver" section

A short paragraph explaining the delivery model:
- In-person sessions for Miami-Dade and Broward clients
- Remote delivery for all clients (video calls, async docs, shared dashboards)
- Quarterly on-site sessions for Naples/Fort Myers engagements
- All system implementation work is delivered remotely

### "Industries we serve" section

Brief mention of vertical depth:
- Professional services (legal, accounting, consulting)
- Healthcare (private practices, allied health)
- Home services (HVAC, plumbing, roofing, restoration) — SW Florida wedge
- Marine services (Fort Lauderdale, Naples)
- Real estate and hospitality
- Creative and personal-brand businesses

### NAP block

Standard NAP — exact-match to GBP.

### CTA

**Not sure which page applies to you?** Book a 30-minute Strategy Session
and we'll help you find the right entry point.
→ `/book-a-call?source=service-areas`

## JSON-LD for this page

```ts
// Multi-area Service schema — one Service entity, many areaServed entries.
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Applied Intelligence Systems",
  "provider": { "@id": "https://www.audiojones.com/#localbusiness" },
  "areaServed": [
    // 14 entries from aiLocalBusiness.areaServed
  ]
}
```

Plus `BreadcrumbList` and a top-level reference to the canonical
`LocalBusiness` schema via `@id`.

## Internal linking

- Receives links from every city landing page (each city page links back to /service-areas)
- Outbound to: every city landing page, /about, /services, /book-a-call

## Open questions for stakeholder

- Confirm we want a centralized hub vs. just inter-linking the city pages
- Verticals to feature in "Industries we serve" — what's the actual revenue split?
- Should this be a top-nav link or footer-only?
