# AJ Digital Pricing and Offer Reconciliation — 2026-07-31

Status: implementation draft; human approval required before preview, merge, or publication
Authority: 2026-07-31 AJ Digital Pricing and Offer Architecture Website Update execution contract
Public source of truth: `src/content/pricing.ts`
Evidence ledger: [`PRICE_VALIDATION_LEDGER.md`](./PRICE_VALIDATION_LEDGER.md)

## Why the commercial anchor changed

Commodity software pricing is not the correct anchor for AJ Digital's managed services. The client is buying diagnosis, workflow design, integration, data and attribution work, operational responsibility, monitoring, support, and managed improvement. Provider usage is a variable input, not the managed-service price. A low monthly software tier obscures those responsibilities and creates an unsupported expectation of instant activation, standardized onboarding, unlimited usage, and bounded support before AJ Digital has the implementation evidence to make those claims.

The public sequence is therefore:

Revenue Leak Snapshot → ReKonr Paid Diagnostic → Evidence-Supported Implementation → ResponseOS Managed Revenue Recovery → Managed Intelligence → Evidence-Supported Expansion

## Old-to-new reconciliation

| Old offer | Old public price | New offer | New public price | Price truth state | Terminology change | Reason | Historical references | Human approval |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AI Readiness Score | Free | AI Readiness Score | Free | Qualification entry | Description clarified | Keep the no-cost orientation path without presenting it as a complete diagnostic | Retained | Required before publication |
| Revenue Leak Diagnostic | $1,997 | Revenue Leak Assessment | $1,997 | Pilot hypothesis | Diagnostic → bounded assessment | Separate one-workflow assessment from the complete ReKonr diagnostic | Superseded in current public source; historical strategy references retained | Required before publication |
| AI Readiness Kaizen Diagnostic | $3,500 | ReKonr Revenue Recovery Diagnostic | From $3,500 | Pilot hypothesis | Kaizen diagnostic → ReKonr | Establish the first complete paid diagnostic engagement and 90-day blueprint | Superseded in current public source; historical strategy references retained | Required before publication |
| AI Readiness Workshop | $2,500–$3,500 | Team AI Readiness Workshop | From $2,500 | Pilot hypothesis | Workshop clarified | Separate education/alignment from the diagnostic progression | Superseded in current public source | Required before publication |
| ResponseOS Starter | $397/month | ResponseOS Managed Pilot | From $8,500 implementation + from $1,500/month + provider usage | Pilot hypothesis | SaaS tier → managed pilot | Price implementation, integration, monitoring, support, and operating responsibility separately from usage | Superseded in current public source; proposal-era references retained as historical | Required before publication |
| ResponseOS Core | $797/month | ResponseOS Core | From $12,500 implementation + from $2,500/month + provider usage | Pilot hypothesis | Subscription tier → managed core deployment | Make multi-channel, multi-workflow, integration, volume, reporting, and support scope explicit | Superseded in current public source; proposal-era references retained as historical | Required before publication |
| ResponseOS Pro | $1,297/month | No direct tier | Superseded by Managed Pilot/Core scope distinction | No current price | Commodity tier removed | Avoid an unsupported third software tier before standardization evidence exists | Historical proposal only | Resolved by execution contract; publication still requires approval |
| Founder Intelligence System Install | Custom; most $5,000–$25,000+ | Founder Intelligence System | From $15,000 | Pilot hypothesis | Install → governed system | Avoid anchoring a complete system at $5,000 and clarify component variability | Superseded in current public source; proposal-era references retained as historical | Required before publication |
| Managed Intelligence Retainer | From $2,000/month | Managed Intelligence | From $2,500/month | Pilot hypothesis | Retainer → recurring service layer | Define monitoring, reporting, optimization, memory maintenance, support, and decision support | Superseded in current public source; proposal-era references retained as historical | Required before publication |
| No current public offer | None | Worksie Reference Pilot | Application only | No public numerical price | New controlled reference | Keep Worksie narrow, workflow-specific, and evidence-gated | New | Required before publication |
| Performance Partnership | Application only; result-based language | Strategic Partnership | Application only | No public numerical price | Performance → strategic | Remove outcome fees, recovered-revenue percentages, performance compensation, and guarantees | Superseded in current public source; proposal-era references retained as historical | Required before publication |

## Pricing evidence state

Every numerical price above is a modeled pilot pricing hypothesis approved only for controlled testing. External benchmark: none. Commercial validation: no. Comparable paid acceptances present in inspected evidence: zero documented. Confidence: low. Full field-level state is maintained in the price-validation ledger.

## ICP evidence state

The directional public wording is:

> Founder-led service businesses, typically generating $500K–$5M+ in annual revenue.

This is a strategic ICP assumption, not a statistically validated segmentation boundary. Revenue-range form options remain broader so the free assessment can remain accessible and applications can capture businesses outside the directional fit range. `ARR` is not used as the generic qualifier because many target service businesses do not operate on recurring revenue.

## Claims disposition

| Claim | Prior state | Classification | Disposition | Replacement or context |
| --- | --- | --- | --- | --- |
| `+38%` reply-rate/revenue lift | Rendered as achieved proof | Unsupported | Removed from current public source | `Target KPI: first-response time measured against the client baseline` |
| `<9 min` first-response time | Rendered as achieved proof | Unsupported | Removed from current public source | Baseline-relative target language |
| `$214K` recovered revenue / first 90 days | Shared source constant | Unsupported | Removed from current public source | `Tracked outcome: qualified opportunities recovered by source and workflow` |
| `34%`, `+89%`, and `10%` podcast claims | Legacy home component | Unsupported | Removed | Illustrative workflow and evidence-rule language |
| `25x ROI within six months` | Legacy home FAQ | Unsupported | Removed | No guarantee; baseline and measured-outcome answer |
| Two-week / four-to-six-week / 60-to-90-day implementation claims | Public/legacy service copy | Unsupported universal timing | Removed or relabeled | Timing depends on access, data, integrations, workflow, volume, complexity, and approvals |
| `8–15 hours saved` and seven-minute assessment | Javi mock copy | Unsupported | Removed | Baseline-relative usefulness and no fixed completion-time claim |
| `$500K–$5M+` annual revenue | Current directional ICP | Strategic ICP assumption | Retained with modifiers | `Typically` / `best suited for`; not research-proven |
| All new numerical prices | Proposed public figures | Pilot pricing hypothesis | Retained for controlled testing | Starting-price and non-benchmark guardrails |
| ROI calculator outputs | User-input model | Illustrative modeled output | Retained | Must remain calculator output, not achieved client proof |

## Source quality and citation gaps

- No stable primary source or verified AJ Digital evidence register was found for the removed ResponseOS or podcast performance claims.
- No uploaded research URL or temporary signed URL was promoted into public copy, metadata, JSON-LD, durable comments, or this record.
- Proposal and audit documents that quote old public values remain historical evidence of the prior state; they are not current price authority.
- The `.specify` constitution is an unratified placeholder, and `.specify/context.yaml` contains stale Firebase-era references. Neither is treated as current governance.
- Stable-source follow-up: create an evidence register with source owner, source class, permission, date range, sample, method, and publication approval before any numerical result returns to public copy.

## Diagnostic-credit policy

No approved policy was found in current canonical documentation or the separately ratified documentation worktree. Public copy states only that diagnosis is required before implementation. No credit, percentage, expiration period, or eligible implementation is promised.

## Validation and review triggers

- Pricing review: after three comparable paid acceptances for any offer or on 2026-10-31, whichever occurs first.
- Commercial validation: 3–5 comparable clients at approximately the same price, without exceptional discounts, with similar scope, measured delivery/support hours, approved gross margin, credible outcomes, clear client understanding, and one completed review cycle.
- ResponseOS SaaS readiness: approximately 8–10 substantially similar implementations plus standardized onboarding, bounded integrations/support, lower founder dependence, understood usage economics, and retention evidence.

## Affected files

Complete intentional branch file set:

- `.github/workflows/build-and-lint.yml`
- `scripts/validate-local.ts`
- `src/content/pricing.ts`
- `src/components/pricing/PricingCtaLink.tsx`
- `src/components/ui/Button.tsx`
- `src/app/pricing/page.tsx`
- `src/app/agents/responseos/page.tsx`
- `src/app/apply/page.tsx`
- `src/app/resources/page.tsx`
- `src/app/services/page.tsx`
- `src/app/solutions/page.tsx`
- `src/app/globals.css`
- `src/components/Footer.tsx`
- `src/components/founder-intelligence/ICPFilter.tsx`
- `src/components/home/CaseStudySection.tsx`
- `src/components/home/HomeFAQ.tsx`
- `src/components/home/landing/ICPFilterSection.tsx`
- `src/data/audiojones-design.ts`
- `src/lib/javi/mockJaviResponses.ts`
- `test/pricing-offers.test.ts`
- `docs/CHANGELOG.md`
- `docs/DECISIONS.md`
- `docs/PRD.md`
- `docs/audio_jones_structured_schema_layout.md`
- `docs/codex/responseos-v1-brief.md`
- `docs/codex/pricing-offer-architecture/charter.md`
- `docs/codex/pricing-offer-architecture/PR_HANDOFF.md`
- `docs/ops/AUTOMATED_VALIDATION_REVIEW_LOOP.md`
- `docs/strategy/AJ_DIGITAL_CANONICAL_OFFER_RATIFICATION_PROPOSAL.md`
- `docs/strategy/PRICE_VALIDATION_LEDGER.md`
- `docs/strategy/PRICING_OFFER_RECONCILIATION_2026-07-31.md`
- `docs/visual-evidence/pricing-2026-07-31/pricing-desktop-full.png`
- `docs/visual-evidence/pricing-2026-07-31/pricing-mobile-full.png`
- `docs/visual-evidence/pricing-2026-07-31/responseos-desktop-full.png`
- `docs/visual-evidence/pricing-2026-07-31/responseos-mobile-full.png`
- `docs/visual-evidence/pricing-2026-07-31/pricing-faq-section.png`
- `docs/visual-evidence/pricing-2026-07-31/pricing-group-diagnosis.png`
- `docs/visual-evidence/pricing-2026-07-31/pricing-group-workshop.png`
- `docs/visual-evidence/pricing-2026-07-31/pricing-group-implementation.png`
- `docs/visual-evidence/pricing-2026-07-31/pricing-group-managed-intelligence.png`
- `docs/visual-evidence/pricing-2026-07-31/pricing-group-expansion.png`
- `docs/visual-evidence/pricing-2026-07-31/pricing-cta-responseos-pilot-apply.png`

Transient Playwright state and baseline capture files under `.playwright-cli/` and `output/` are not part of the branch file set and must remain unstaged.

## Decisions still requiring Audio

1. Final public starting prices.
2. Whether a diagnostic-credit policy should exist.
3. Final directional ICP wording.
4. Whether detailed ResponseOS pricing remains public.
5. Whether removed performance claims stay removed or return only with approved evidence.
6. Ownership and timing for stable-source/evidence-register gaps.
7. Whether the next review trigger is three paid acceptances, 2026-10-31, or a different approved threshold.
8. Whether every numerical price remains internally marked `Testing`.
9. Whether the preview is publication-ready after human QA.
10. Whether a preview deployment is authorized.

No item above is approved merely because the implementation exists in a branch or draft PR.
