---
title: AJ Digital — Offer Crosswalk (pointer)
status: pointer — the crosswalk itself lives in aj-digital-revops
date: 2026-09-09
supersedes: the full crosswalk previously at this path (merged in #240)
---

# Offer crosswalk — pointer

The crosswalk mapping this repository's public offer registry to the AJ Digital
Master Pricing Matrix is maintained in the RevOps repository:

> `aj-digital-revops` → `docs/commercial/offer-crosswalk-2026-09-08.md`

## Why it moved

A full crosswalk was merged at this path in #240. Work resolving the same
problem was already underway in `aj-digital-revops`, unknown to that PR, and had
gone further: it is built on **Master Pricing Matrix v1.3**, which propagates the
2026-07-31 ResponseOS decision into the matrix and retires the three productized
tiers. It also draws the distinction the website copy missed — the matrix has
sellable engagements *and* delivery components (A, BM, AR and D series), and a
component absent from the website is not a gap, because components are never
sold individually.

Keeping both would have produced exactly the drift the crosswalk exists to
prevent, so the RevOps document is canonical and this file is the pointer. Three
things from the website-side audit were folded into it: the mapping rule, a
correction to conflict C-2, and a scope-limits section.

## What it means from this side

`src/content/offers.ts` is the website half of that map. Two rules follow:

- Adding, removing or repricing an offer in `offers.ts` requires the
  corresponding row in the crosswalk **in the same change**.
- A divergence between the two sides is recorded as a `C-` conflict entry in the
  crosswalk, never resolved by a silent edit on one side.

The ten records in `offers.ts` still carry `evidenceStatus: "unratified"`. The
crosswalk's open conflicts — the ReKonr anchor, the Founder Intelligence mapping
and floor, the Managed Intelligence mapping, the R1/R2 collapse, and the homeless
`revenue-leak-assessment` — are commercial decisions, and populating the
`family`, `evidenceStatus` and `displayConvention` fields is downstream of them.

## Register of record

For commercial pricing and offer decisions, the register of record is this
repository's [`docs/DECISIONS.md`](../DECISIONS.md). The RevOps decision register
covers HubSpot catalog provisioning only and claims no authority over pricing.
