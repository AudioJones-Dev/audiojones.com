---
title: AJ Digital — Offer Crosswalk (website → Airtable)
status: active — maps src/content/offers.ts to the Airtable Offer Matrix
date: 2026-11-09
supersedes: the 2026-09-09 pointer to aj-digital-revops (see DECISIONS.md, 2026-11-09)
---

# Offer crosswalk — website → Airtable

The commercial authority is the Airtable base **"AJ Digital Offer Matrix"**
(DECISIONS.md, 2026-11-09). This file maps each record in
`src/content/offers.ts` to its Airtable offer so the two can be compared. The
earlier crosswalk in `aj-digital-revops/docs/commercial/offer-crosswalk-2026-09-08.md`
is a historical snapshot.

## Rules

- Prices and visibility change in Airtable first, with a Commercial Change Log
  entry, and reach `offers.ts` through a reviewed PR.
- Adding, removing or repricing an offer in `offers.ts` updates this table in
  the same change.
- The site may show an offer's price only when its Airtable Public Visibility
  is **Public**, and then only the Airtable public anchor.
- A mismatch is recorded below as an open item, never fixed by a silent edit
  on one side.

## Map (as of 2026-11-09)

| `offers.ts` id | Site price | Airtable offer | Airtable visibility | Status |
| --- | --- | --- | --- | --- |
| `ai-readiness-score` | Free | R0 Online AI Readiness Assessment | Public | Aligned |
| `rekonr-revenue-recovery-diagnostic` | From $3,500 | R2 ReKonr Revenue Leak Diagnostic (pilot $2.5k–$3.5k, standard $4.5k–$6.5k) | Sales-only | **Open** — visibility and name |
| `team-ai-readiness-workshop` | From $2,500 | none | — | **Open** — add to Airtable or retire |
| `founder-intelligence-system` | From $15,000 | BM-C Core AI-Ready Business Knowledge System, or BM-RAG (conflict C-2) | Sales-only / Internal | **Open** — mapping and visibility |
| `managed-intelligence` | From $2,500/month | M5 Managed Business Memory, M8 or M9 (conflict C-3) | Sales-only | **Open** — mapping and visibility |
| `worksie-reference-pilot` | Application only | none | — | **Open** — add to Airtable or retire |
| `strategic-partnership` | Application only | none (nearest M8 / M10) | — | **Open** — mapping |

ResponseOS is sold on responseos.pro and is not in `offers.ts`; its Airtable
records are AR-PILOT, AR-CORE, AR-CUSTOM, M6 and R6.

Delivery components (the A, BM, AR and D series) are never sold individually,
so a component missing from the website is not a gap.

## Open conflicts carried over

- **C-1** ReKonr: a diagnostic (R2) on the site, "ReKonr OS" in `/ecosystem`
  and the SOP.
- **C-2** Founder Intelligence System collapses two matrix offers.
- **C-3** Managed Intelligence has no settled managed-service mapping.

These are decided in Airtable and then reflected here and in `offers.ts`.
