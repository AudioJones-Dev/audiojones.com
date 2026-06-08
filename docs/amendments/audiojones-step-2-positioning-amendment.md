---
title: "AudioJones.com Step 2 Positioning Amendment"
version: "1.0"
status: "ready-for-implementation"
owner: "Audio Jones / AJ Digital"
site: "AudioJones.com"
category: "brand-positioning, site-architecture, aeo-seo, conversion"
last_updated: "2026-04-27"
---

# AudioJones.com Step 2 Positioning Amendment

## 0. Purpose

Amend the current AudioJones.com website build to include **Step 2** as a core
positioning pillar. The site should communicate that Audio Jones helps
businesses solve the missing operational layer between AI hype and measurable
business outcomes. This amendment should be treated as a strategic website
layer, not just a blog post.

## 1. Core Thesis

Most businesses currently understand AI in this broken sequence:

```
Step 1: Buy or access powerful AI tools
Step 2: ???
Step 3: Profit, transformation, leverage, scale
```

Audio Jones owns the missing middle:

> Step 2 = the operating layer between AI capability and measurable profit.

## 2. Primary Positioning Statement

> Audio Jones builds Step 2: the missing operating layer between AI hype and
> measurable business outcomes.

## 3. Route Substitutions

This implementation references several routes that do not exist in the
current build. Substitutions used:

| Amendment route   | Implemented as                          | Reason |
| ----------------- | --------------------------------------- | ------ |
| `/step-2`         | `/step-2`                               | New    |
| `/founder-intelligence` | `/founder-intelligence`           | Exists |
| `/attribution`    | `/frameworks/map-attribution`           | Closest existing IP page |
| `/ai-readiness`   | `/founder-intelligence/diagnostic`      | Closest existing readiness funnel |
| `/work-with-me`   | `/founder-intelligence/diagnostic`      | Single conversion endpoint today |

## 4. Implementation summary

- New `/step-2` route with hero, definition, S.T.E.P. 2 framework,
  three-stage diagram, FAQ, and CTAs.
- Homepage Step 2 callout section linking to `/step-2`.
- Sitemap updated to include `/step-2`.
- FAQPage and BreadcrumbList JSON-LD on `/step-2`.
- Internal links from `/step-2` and `/founder-intelligence` to the
  substituted routes above.

## 5. Acceptance criteria

- Visitor learns within 10 seconds that Audio Jones builds the missing
  operational layer between AI tools and measurable outcomes.
- `/step-2` exists, has metadata, canonical URL, FAQPage + BreadcrumbList
  JSON-LD, and links to founder intelligence, attribution, AI readiness,
  and the conversion endpoint.
- TypeScript and lint pass; sitemap includes `/step-2`.
