# Draft PR Handoff — Diagnostic-Led Pricing and Offer Architecture

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
- No diagnostic credit, outcome fee, recovered-revenue percentage, guarantee, or SaaS tier was invented.
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
- `git diff --check` and staged secret scan — required immediately before commit.

Build notes: the isolated worktree does not contain deployment `NEXT_PUBLIC_SITE_URL`; build mode reported it and continued successfully. Existing `/status` dynamic-render and removed-Firebase legacy portal diagnostics also logged without failing the build. These are deployment/legacy gates, not defects introduced here.

## Visual evidence

See [`docs/visual-evidence/pricing-2026-07-31`](../../visual-evidence/pricing-2026-07-31/) for full desktop/mobile pricing and ResponseOS pages, the FAQ, all changed offer groups, and the managed-pilot application CTA flow.

## Remaining uncertainties and human gates

1. Final public starting prices.
2. Diagnostic-credit policy.
3. Final directional ICP wording.
4. Whether detailed ResponseOS prices remain public.
5. Whether removed performance claims remain removed unless verified evidence is approved.
6. Stable-source/evidence-register ownership and timing.
7. Final pricing-review trigger.
8. Confirmation that all prices remain internally `Testing`.
9. Human visual/copy approval for publication readiness.
10. Whether a preview deployment is authorized.

## Pricing review trigger

Proposed: after three comparable paid acceptances for an offer or on 2026-10-31, whichever occurs first. Commercial validation still requires 3–5 comparable clients plus measured scope, delivery/support hours, margin, outcomes, discounting, client understanding, and one review cycle.

## Deployment gate

Draft review only. Merge and production deployment are not authorized. No new pricing is approved for publication by this branch or PR.
