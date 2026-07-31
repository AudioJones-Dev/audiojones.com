# Build Charter: Diagnostic-Led Pricing and Offer Architecture

- Mode: improvement
- Date: 2026-07-31
- Owner: AJ Digital LLC / Audio; implementation by Codex

## Define

### Problem statement

The public AudioJones.com pricing experience and directly connected ResponseOS copy do not yet represent AJ Digital's approved diagnostic-led managed-service model. The current experience risks framing managed implementation as low-cost commodity software, mixing incomplete or unsupported commercial claims with offer copy, and leaving pricing, scope, provider usage, implementation, and recurring-service boundaries unclear for founder-led service-business buyers.

### Scope

In scope:

- Audit the rendered production `/pricing` and `/agents/responseos` routes and their source, including offers, prices, claims, CTAs, metadata, structured data, analytics, forms, links, and responsive behavior.
- Rebuild `/pricing` around the approved ten-offer customer journey and pricing guardrails in the 2026-07-31 execution contract.
- Reconcile directly affected ResponseOS positioning, shared product content, metadata, structured data, CTA destinations, and internal links.
- Add regression coverage for prices, terminology, provider-usage disclosure, diagnostic requirement, ICP wording, CTAs, structured data, and unsupported claims.
- Add the pricing reconciliation record, price-validation ledger, decision-log entry, changelog entry, and testing/evidence notes required by the execution contract.
- Capture desktop and mobile visual evidence for changed public surfaces and validate browser, console, accessibility, and responsive behavior.
- Commit and push the governed branch and open a draft PR if validation and tooling permit.

Out of scope:

- Merging any pull request.
- Promoting a preview deployment beyond the automatic human-QA preview approved by Audio on 2026-07-31.
- Deploying or promoting to production.
- Changing secrets, credentials, provider accounts, or production environment variables.
- Publishing outcome-based, success-fee, recovered-revenue-percentage, guarantee, or SaaS pricing.
- Reintroducing Firebase or deepening legacy portal/admin surfaces.
- Globally rewriting historical documents that are clearly historical or superseded.
- Inventing client evidence, a benchmark, an attribution result, or commercial validation beyond the ratified no-automatic-credit diagnostic policy.
- Replacing an existing CRM or system of record by default.

### Voice of the customer

Founder-led service-business buyers need a clear low-risk path from preliminary orientation to bounded diagnosis, evidence-supported implementation, managed improvement, and controlled expansion. They need to understand what each engagement is, what it is not, which costs are starting figures versus usage costs, why diagnosis precedes implementation, and which outcomes AJ Digital will measure without receiving unsupported guarantees.

### Acceptance criteria

1. `/pricing` presents all ten approved offers in the required journey hierarchy with exact public starting-price language, scope boundaries, and CTA labels.
2. No current public surface in scope presents `Performance Partnership`, outcome/success/recovered-revenue fees, guaranteed ROI, or `AI Receptionist System` as ResponseOS's primary category.
3. ResponseOS is presented as a managed `Revenue Recovery System`; managed pilot and core scopes are visibly distinct; diagnosis and separate provider usage are explicit.
4. Visible prices and structured data agree; application-only offers have no invented numerical structured prices; metadata and canonical URLs use the accepted `www` host.
5. Directly affected CTA destinations resolve, preserve or add offer-specific analytics context, and render as usable keyboard-accessible controls on desktop and mobile.
6. Public ICP language in scope reads directionally as founder-led service businesses typically generating `$500K-$5M+` in annual revenue and is internally classified as a strategic assumption, not proof.
7. Every numerical/commercial claim found in scope is inventoried and classified; unsupported public claims are removed or safely relabeled; no citation is invented or temporary signed URL published.
8. The FAQ covers all fourteen required questions without inventing diagnostic credit, self-service availability, provider inclusion, timing certainty, or outcome guarantees.
9. Automated regression checks prove the new prices and terminology render, stale public pricing/terminology do not render, CTAs and structured data match, and required guardrail language is present.
10. Repository validation passes: frozen-lockfile install, typecheck, lint, no-Firebase guard, production build, relevant tests/checks, secret scan, and `git diff --check`.
11. Browser QA covers desktop, tablet, common mobile widths, keyboard/focus, overflow, console errors, CTA routes, and screenshots for pricing, ResponseOS, FAQ, and each changed offer group.
12. Documentation includes a complete old-to-new reconciliation, a price-validation ledger with all new prices at `Testing`, claim disposition, review triggers, remaining decisions, and no unsupported benchmark or validation language.
13. Git handoff ends at a pushed branch and draft PR; the automatic preview may be used for approved human QA, while merge and production deployment remain not authorized.

### Constraints and non-goals

- Preserve unrelated work and keep this branch isolated from dirty or staged worktrees.
- Follow `AGENTS.md`, `CLAUDE.md`, accepted ADRs, the canonical design system, and the 2026-07-31 execution contract.
- Do not add dependencies or touch `pnpm-lock.yaml` unless a separately justified dependency change becomes unavoidable.
- Use existing design tokens and components; avoid commodity SaaS comparison-table styling.
- Treat every listed price as a modeled pilot pricing hypothesis approved only for controlled testing.
- Treat `$500K-$5M+` as a modeled strategic ICP assumption.
- Do not infer facts from the placeholder `.specify` constitution or stale Firebase-era `.specify/context.yaml`.

### Define exit gate

- [x] Problem statement is written without assuming an implementation.
- [x] In-scope and out-of-scope boundaries are explicit.
- [x] Acceptance criteria are observable and testable.
- [x] Improvement mode is recorded.
- [x] No application code has been changed.

## Measure

### Baseline environment

- Source: `origin/main` at `3c420dfd027a0d6a11d563146d8ecf2f01071323`.
- Production: `https://www.audiojones.com`, inspected 2026-07-31.
- Routes: `/pricing` and `/agents/responseos` at 1440×1100 and 390×844.
- Browser: Playwright CLI Chromium with an isolated browser and daemon cache because the default user cache symlink targets a missing `F:` path.

### Reproduction and baseline

The current production and source reproduce the commercial-positioning defect on demand:

1. `/pricing` renders ResponseOS as SaaS tiers at `$397/mo`, `$797/mo`, and `$1,297/mo`.
2. The page renders a `$5,000-$25,000+` Founder Intelligence System range, a `$2,000/mo` Managed Intelligence Retainer, and `Performance Partnership` tied to results.
3. ReKonr, Worksie, ResponseOS implementation prices, provider-usage separation, and the required ten-offer journey are absent.
4. `/agents/responseos` labels ResponseOS as `AI Receptionist System` and renders `+38%` and `<9 min` as achieved proof signals without an evidence source in the inspected repository.
5. Pricing has Breadcrumb and FAQ JSON-LD only; ResponseOS has no JSON-LD; pricing CTAs have no offer-specific event taxonomy.
6. The shared footer renders the conflicting public ICP statement `$250K-$5M ARR` on both routes.
7. Production showed zero console warnings/errors and zero horizontal overflow at 390px; the pre-existing cookie banner occludes lower viewport content until consent is set.

Tracked-repository search counts before implementation:

| Pattern | Baseline count |
| --- | ---: |
| `$397` | 4 |
| `$797` | 2 |
| `$1,297` | 2 |
| `$1,997` | 6 |
| `$2,000` | 3 |
| `$2,500` | 1 |
| `$3,500` | 4 |
| `$5,000` | 3 |
| `$8,500` | 0 |
| `$12,500` | 0 |
| `$15,000` | 0 |
| `$25,000` | 3 |
| `AI Receptionist System` | 7 |
| `Performance Partnership` | 5 |
| `recovered revenue` | 5 |
| `ARR` | 16 |
| `$250K` | 29 |
| `$500K` | 9 |
| `$5M` | 31 |
| `+38%` | 7 |
| `<9 min` | 2 |

### Claim and price baseline classification

- Existing and proposed public prices: pilot pricing hypotheses; no external benchmark or commercial validation was found.
- Paid acceptances for comparable new-price engagements: `0` in the available evidence.
- `$500K-$5M+`: strategic ICP assumption.
- `+38%`, `<9 min`, and related achieved-result wording: unsupported public claims in the inspected evidence.
- `1 inbox`: unlabeled operational target, not verified client proof.
- Diagnostic credit baseline: no approved policy existed before implementation. Audio subsequently ratified no automatic implementation credit, with ReKonr independently deliverable and review after three comparable paid engagements.

### Repeatable measurement methods

```powershell
# Source/public-claim inventory
git grep -n -I -E -- 'AI Receptionist System|Performance Partnership|outcome-based|results-based|success fee|recovered revenue|\+38%|<9 min|25x ROI|200%\+|\$397|\$797|\$1,297|\$1,997|\$2,000|\$2,500|\$3,500|\$5,000|\$8,500|\$12,500|\$15,000|\$25,000' -- 'src/**' ':!src/app/portal/**' ':!src/app/api/admin/**'

# Required regression contract after implementation
pnpm exec tsx --test test/pricing-offers.test.ts

# Code and build gates
pnpm typecheck
pnpm lint
pnpm check:no-firebase
pnpm build

# Browser signal
# Playwright snapshots, console output, overflow checks, CTA navigation, and screenshots
# for /pricing and /agents/responseos at desktop/tablet/mobile widths.
```

### Measure exit gate

- [x] The defect reproduces on current production and source.
- [x] Baseline values and tracked-repository counts are recorded.
- [x] Repeatable source, test, build, and browser signals are defined.
- [x] Every Define acceptance criterion maps to search, test, build, documentation, or browser evidence.

## Analyze

### Hypotheses tested

1. **The production mismatch is caused by CMS or deployment drift.** Rejected. Production rendering matches the hard-coded `src/app/pricing/page.tsx` and `src/app/agents/responseos/page.tsx` content at current `origin/main`.
2. **A shared canonical pricing source exists but the page is not consuming it.** Rejected. The pricing values, FAQ, CTAs, and offer names are defined directly inside the pricing page; no shared public pricing source or price-validation ledger exists.
3. **Unsupported ResponseOS proof is isolated to one page.** Rejected. `proofSignals` in `src/data/audiojones-design.ts` is reused by `/agents`, `/agents/responseos`, and `/case-studies`, so the unsupported `+38%` and `<9 min` claims propagate across public routes.
4. **The current CTA layer already preserves offer-level analytics context.** Rejected. Pricing links contain neither event names nor offer parameters; the application form can retain UTM parameters, but the pricing page does not send them.

### Confirmed root cause

The public commercial model is encoded as scattered, hard-coded page copy and shared proof constants without an evidence-governed offer source, offer-level CTA instrumentation, pricing/claim regression test, or price-validation ledger. That structure allowed an older SaaS-tier model, conflicting ICP language, and unsupported proof signals to remain authoritative after strategy matured. The cause is not a rendering defect; it is missing commercial-content governance at the source and control layers.

Evidence:

- `src/app/pricing/page.tsx` directly defines all offers, prices, FAQ answers, and the result-based partnership.
- `src/data/audiojones-design.ts` provides unsupported shared proof signals to three public routes.
- `src/app/agents/responseos/page.tsx`, `src/app/solutions/page.tsx`, and `src/app/resources/page.tsx` repeat the `AI Receptionist System` category.
- No pricing-focused test, offer event taxonomy, Service/Offer JSON-LD, diagnostic-credit policy, reconciliation record, or price-validation ledger exists.
- The shared footer and application surfaces publish a conflicting `$250K-$5M ARR` ICP statement.

### Design options considered

1. **Replace only the pricing page's inline copy.** Smallest initial diff, but keeps visible prices, JSON-LD, CTA tracking, tests, and future changes disconnected. High recurrence risk.
2. **Create a typed pricing content source and render page, schema, CTA events, and tests from it.** Slightly larger diff, but one source controls offer names, starting-price display, scope, guardrails, CTA context, and schema eligibility. Best fit for the evidence and regression requirements without a dependency.
3. **Move pricing into Sanity CMS.** Offers editorial flexibility but adds content-model, migration, preview-data, and environment complexity to a pricing correction. It also does not by itself provide evidence-state governance or code-level regression controls.

### Chosen design

Use option 2:

- Add a typed `src/content/pricing.ts` source for the ten offers, five journey groups, fourteen FAQs, pricing factors, provider-usage policy, and conservative ItemList/Service JSON-LD.
- Render `/pricing` as grouped editorial sections rather than a SaaS comparison grid.
- Add a small client-side tracked CTA wrapper that emits the approved event taxonomy to both `dataLayer` and `gtag` when available, while preserving UTM/offer context in destinations.
- Reposition ResponseOS and directly affected shared product surfaces, and replace shared unsupported proof metrics with explicitly labeled targets/tracked outcomes.
- Reconcile current public ICP copy without changing form revenue options or historical documents.
- Add a focused source-contract test and documentation controls: reconciliation record, price-validation ledger, ADR, changelog, and completed DMAIC charter.

Main risk: a ten-offer page can become dense on small screens. Mitigation: use journey-group sections, one to three cards per group, concise summary copy, semantic headings/lists, 44px CTA targets, and required desktop/tablet/mobile screenshot review.

### Analyze exit gate

- [x] A single root cause is confirmed by source and production evidence.
- [x] Three viable designs were compared.
- [x] The chosen design addresses the cause, not only the stale strings.
- [x] Primary implementation and control risks are named with mitigations.

## Improve

### Changes implemented

- Added `src/content/pricing.ts` as the typed public source for the ten-offer ladder, prices, scope, guardrails, CTA context, FAQ, pricing factors, provider usage, and conservative structured data.
- Rebuilt `/pricing` around diagnosis, implementation, management, and controlled expansion rather than subscription tiers.
- Repositioned `/agents/responseos` as a diagnostic-led managed Revenue Recovery System and separated Managed Pilot from Core.
- Added a tracked CTA wrapper with offer-specific events and destination context; ResponseOS-page UTMs identify `responseos` rather than `pricing` as their source.
- Replaced unsupported public proof figures with explicitly labeled target, tracked-outcome, and operational-goal language.
- Reconciled directly affected ICP, services, solutions, resources, FAQ, application, and shared product copy.
- Added the reconciliation record, price-validation ledger, ADR, changelog entry, historical-authority notices, visual evidence, and focused contract tests.
- Repaired the Windows execution path in `scripts/validate-local.ts`, which previously failed with `spawn pnpm ENOENT`, then added the pricing contract to the wrapper.

### Result signals

| Signal | Baseline | Result |
| --- | --- | --- |
| Approved offers represented | Partial, stale ladder | 10 of 10 |
| Old SaaS price/retired-term hits in current public source | Present | 0 |
| Unsupported `+38%`, `<9 min`, `$214K`, and `25x ROI` hits in current public source | Present | 0 |
| Pricing CTA taxonomy | None | 9 named offer events |
| Pricing JSON-LD types | Breadcrumb + FAQ | Breadcrumb + FAQ + ItemList/Service |
| ResponseOS JSON-LD types | None | Breadcrumb + FAQ + Service |
| Pricing contract tests | None | 7 focused assertions passing; 9 total repository tests passing |
| Mobile/tablet horizontal overflow | 0 baseline | 0 after change |
| Browser console errors/warnings on changed routes | 0 baseline | 0 after change |
| Canonical validation wrapper | Windows `ENOENT` | Pass: typecheck, lint, no-Firebase, pricing contract, build |

### Improve exit gate

- [x] The chosen design was implemented without a dependency or lockfile change.
- [x] All Define acceptance criteria have code, test, documentation, or browser evidence.
- [x] The complete current-public-source stale-term scan returns zero hits.
- [x] Desktop, tablet, mobile, focus, target-size, console, structured-data, and CTA-route checks pass.
- [x] No merge, preview promotion, or production deployment was performed.

## Control

### Regression guard

`test/pricing-offers.test.ts` is the named standing guard for the original failure. It asserts exact prices, retired terminology removal, safe claim disposition, routable/contextual CTAs, structured-price alignment, application-only omissions, provider usage, diagnosis, FAQ boundaries, and directional ICP wording.

### CI and local wiring

- `.github/workflows/build-and-lint.yml` runs the focused pricing contract on push and pull request.
- `pnpm validate` runs the same focused contract in addition to typecheck, lint, the no-Firebase guard, and the production build.
- `scripts/validate-local.ts` explicitly invokes the Windows command shell only to resolve the fixed `pnpm` commands, with no user-controlled command input.

### Drift control

- Public content drift: blocked by the pricing contract and current-public-source search before handoff.
- Pricing evidence drift: controlled by `docs/strategy/PRICE_VALIDATION_LEDGER.md`; all figures remain `Testing` with low confidence and zero documented comparable acceptances.
- Commercial monitoring threshold: review after three comparable paid acceptances for an offer or on 2026-10-31, whichever occurs first. No production alert is applicable before publication and transaction instrumentation.
- ResponseOS SaaS threshold: approximately 8–10 substantially similar implementations plus the standardization, support, margin, usage-economics, founder-dependence, and retention evidence recorded in the ledger.

### Runbook and owner

If old price tiers, retired categories, unsupported proof, mismatched schema, or lost CTA context recur, run `pnpm exec tsx --test test/pricing-offers.test.ts`, inspect `src/content/pricing.ts`, then compare the public surfaces with the reconciliation and ledger before changing copy. Audio / AJ Digital LLC owns claim and publication approval. AJ Digital Ops owns evidence-register maintenance, and repository maintainers own the automated guard. Audio ratified the commercial decisions and automatic preview for human QA on 2026-07-31; merge and production remain separately gated.

### Control exit gate

- [x] A named regression guard reproduces the original failure class.
- [x] The guard runs in CI and the local validation contract.
- [x] Drift-prone commercial metrics have a ledger and explicit review trigger; runtime alerting is not yet applicable.
- [x] The recurrence runbook and owners are named.
- [x] Final signals are recorded baseline to result.

Charter status: complete for branch implementation and final preview review. Commercial decisions and automatic preview QA are approved. Merge and production publication remain separate `proceed` gates.
