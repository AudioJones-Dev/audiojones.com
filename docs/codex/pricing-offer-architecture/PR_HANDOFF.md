# Draft PR Handoff — Diagnostic-Led Pricing and Offer Architecture

> **Superseded on one point (2026-08-31).** The `$500K–$5M+` annual-revenue
> ICP wording ratified on 2026-07-31 and referenced below did not ship.
> `AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md` §5 retires hard ARR bands
> from public copy — the persona is qualified on signal-maturity criteria —
> and that retirement shipped in #228. Public copy on this branch now
> carries no revenue band. The references below are kept as the record of
> the earlier decision.

## Strategic rationale

AJ Digital sells diagnosis, evidence-supported implementation, integration, operational responsibility, monitoring, and managed improvement. The former low-cost subscription grid misrepresented that delivery model. This change presents a customer journey from preliminary assessment through ReKonr, managed ResponseOS implementation, Managed Intelligence, and controlled expansion.

## What changed

- Replaced the stale SaaS-style pricing grid with the approved ten-offer journey and exact modeled starting prices.
- Made `src/content/pricing.ts` the typed source for offer copy, prices, scope, guardrails, CTAs, FAQ, provider usage, and structured-data eligibility.
- Repositioned ResponseOS as a managed Revenue Recovery System; separated Managed Pilot and Core.
- Added offer-level CTA events and UTM context, with page-correct source attribution.
- Removed or relabeled unsupported numerical proof and universal implementation-time claims in directly affected public surfaces.
- Added conservative Breadcrumb, FAQ, Service, and ItemList JSON-LD without fake application-only or mixed implementation/recurring prices.
- Added the price-validation ledger, old-to-new reconciliation, DMAIC charter, visual evidence, decision/changelog updates, and historical-authority notices.
- Added a pricing-offer contract test to local validation and the Build & Lint workflow; repaired the Windows validation runner.

## What was intentionally not changed

- No merge, preview promotion, production deployment, secret, credential, provider, or production environment change.
- No outcome fee, recovered-revenue percentage, guarantee, or SaaS tier was invented. The ratified diagnostic policy is no automatic implementation credit; ReKonr remains independently deliverable.
- No dependency, package script, lockfile, route name, CRM, legacy portal/admin surface, or historical document was broadly rewritten.
- Application revenue-range options remain broader than the directional public ICP so qualification data and free-access paths are not narrowed prematurely.

## Pricing evidence status

All numerical figures are modeled pilot pricing hypotheses for controlled testing. External benchmark: none. Commercial validation: no. Comparable paid acceptances in inspected evidence: zero documented. Confidence: low. Internal status: `Testing`.

The complete old-versus-new table and claim disposition are in [`PRICING_OFFER_RECONCILIATION_2026-07-31.md`](../../strategy/PRICING_OFFER_RECONCILIATION_2026-07-31.md). Field-level price evidence is in [`PRICE_VALIDATION_LEDGER.md`](../../strategy/PRICE_VALIDATION_LEDGER.md).

## Terminology and claim changes

- `AI Receptionist System` primary category → `Revenue Recovery System`; receptionist/voice remains a conditional capability.
- `Performance Partnership` → `Strategic Partnership`; no public performance compensation.
- ResponseOS Starter/Core/Pro subscription tiers → Managed Pilot/Core implementation scopes.
- Unsupported `+38%`, `<9 min`, `$214K`, `25x ROI`, podcast result figures, and universal timing claims → removed or replaced with target/baseline/illustrative language.
- `$250K–$5M ARR` generic ICP → founder-led service businesses, typically generating `$500K–$5M+` in annual revenue; classified as a strategic assumption.

## Validation results

- `pnpm install --frozen-lockfile` — pass; no lockfile change.
- `pnpm exec tsx --test test/check_tsconfig.test.ts test/fetchJsonErrorMessage.test.ts test/pricing-offers.test.ts` — pass, 9/9.
- `pnpm validate` — pass: typecheck, lint, no-Firebase, pricing-offer contract, production build.
- Lint — 0 errors; 1,068 pre-existing repository warnings.
- `pnpm check:no-firebase` — clean.
- Current-public-source stale-price/term scan — zero hits.
- Browser QA — pricing and ResponseOS desktop/mobile, pricing tablet, keyboard sequence, reduced motion, 44px pricing CTAs, no overflow/clipped cards, correct metadata/canonical/JSON-LD, correct CTA route/context/event, 0 console errors/warnings.
- `git diff --check` and staged secret scan — pass for the commercial-decision ratification commit.

Build notes: the isolated worktree does not contain deployment `NEXT_PUBLIC_SITE_URL`; build mode reported it and continued successfully. Existing `/status` dynamic-render and removed-Firebase legacy portal diagnostics also logged without failing the build. These are deployment/legacy gates, not defects introduced here.

## Visual evidence

See [`docs/visual-evidence/pricing-2026-07-31`](../../visual-evidence/pricing-2026-07-31/) for full desktop/mobile pricing and ResponseOS pages, the FAQ, all changed offer groups, and the managed-pilot application CTA flow.

## Commercial decisions ratified by Audio

1. The displayed starting prices are approved for controlled testing, not commercially validated.
2. ReKonr is independently deliverable and receives no automatic implementation credit; revisit after three comparable paid engagements.
3. The directional `$500K–$5M+` annual-revenue ICP wording is approved as a strategic assumption.
4. Detailed ResponseOS Managed Pilot and Core prices remain public during testing.
5. Unsupported performance claims remain removed unless verified and explicitly approved for publication.
6. Audio owns claim/publication approval; AJ Digital Ops maintains the evidence register.
7. Review occurs after three comparable paid acceptances or on 2026-10-31, whichever occurs first.
8. Every numerical price remains internally `Testing`.
9. The change is ready for final preview review, not production publication.
10. The existing automatic preview is approved for human QA only.

## Pricing review trigger

Approved: after three comparable paid acceptances for an offer or on 2026-10-31, whichever occurs first. Commercial validation still requires 3–5 comparable clients plus measured scope, delivery/support hours, margin, outcomes, discounting, client understanding, and one review cycle.

## Deployment gate

The automatic preview is approved for human QA only. The PR remains draft. Merge and production deployment are not authorized and require separate `proceed` gates.
