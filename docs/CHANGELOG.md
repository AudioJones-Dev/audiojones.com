# CHANGELOG.md — AudioJones.com

Notable repository-level changes. Routine code changes belong in PRs
and commit history, not here. Use this file for:

- Architecture changes (stack, deploy targets).
- Documentation reorganizations.
- Security incidents and rotations (no secret values).
- Decommissions and route removals.

Entries are reverse chronological. Format follows
[Keep a Changelog](https://keepachangelog.com/) loosely.

---

## Unreleased

### Changed
- Introduced `src/content/offers.ts` as the canonical offer registry and made
  `src/content/pricing.ts` a projection of it. No commercial change: the ten
  records mirror the live site verbatim, and the seven pre-existing assertions
  in `test/pricing-offers.test.ts` pass unchanged, which is what makes the
  migration behaviour-preserving rather than merely intended. `/pricing`,
  `/agents/responseos`, `PricingCtaLink`, and `apply-schema` are untouched.
  Fields that depend on the unfinished pricing reconciliation — `family` for
  the seven contested offers, `displayConvention`, offer relationships — are
  left undefined with a comment naming the open question, rather than filled
  with placeholders that would quietly become the decision. Every record
  carries `evidenceStatus: "unratified"`.
- Added `src/lib/offers/public-view.ts`, the only path by which registry
  records reach a machine-readable surface. The projection is an allowlist by
  construction, so a field added to the registry later is withheld until
  someone publishes it deliberately; the asymmetry is that a missing public
  field gets reported, while a leaked internal one is silent and already
  distributed. Enforced by three tests rather than left as an intention — a
  key check on the output, a triage check on the registry input, and a
  serialization scan asserting no internal metadata survives.

### Removed
- Deleted the `agentsProofStrip` export from
  `src/data/audiojones-design.ts`. It held `$214K` "recovered revenue",
  a `+38%` reply-rate lift, a `<9 min` response time, and a testimonial
  attributed only to "Founder, professional services, $1.2M run-rate" —
  no named client, no consent on record. Nothing imported it, so none of
  it was ever published. Annotating it was not enough: dead data holding
  an unattributable endorsement is a trap for whoever wires it up next.
  Git history keeps the content if a consented version ever exists.

### Documentation
- Amended §1 of `AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md` (v1.0 → v1.1)
  after running its own rule 1 against three rows marked SAFE. The
  9.3 hrs/week context-switching figure does not appear in Asana's index
  at all and is now **REMOVE**; the MIT NANDA 95% figure has no openable
  primary URL and is now **BLOCKED** pending one; the 62% missed-calls
  claim keeps SAFE but must now carry its **2016** date, which the
  approved wording omitted. The verification rule now points at the
  citations file and states that a SAFE verdict is not evidence anyone
  checked. No other section changed.

### Changed
- Removed the remaining unsourced performance figures from `/agents`,
  `/agents/responseos`, and `/case-studies`. The shared `proofSignals`
  hero stats published a `+38%` reply-rate lift and a `<9 min` median
  first response as measured outcomes; neither has a source. They now
  describe how the installed system behaves, matching the treatment the
  homepage `ProofStats` section received. `agentsProofStrip` — unused by
  any surface, and holding `$214K` plus an unattributable testimonial —
  is annotated in place as not publishable rather than wired up.
  Recorded in `docs/strategy/CLAIM_VERIFICATION_LOG.md`.

### Fixed
- The validation-summary circuit breaker never worked. It counted runs
  via `workflow_id: context.workflow` — a display name where the Actions
  API wants an ID or filename — so the workflow filter matched nothing
  and every run on the PR was counted. It tripped after roughly two
  pushes and suppressed the summary on essentially every PR. The count
  now lives in the sticky comment, keyed to the commit being summarised,
  because a `workflow_run`-triggered run carries no PR identity of its
  own. Notice text and `docs/ops/AUTOMATED_VALIDATION_REVIEW_LOOP.md`
  §9.11 corrected to match.

### Changed
- Removed the unsourced performance figures from the homepage. The hero's
  ↓37% / ↑28% / ↑42% chip and the `ProofStats` tiles presented numbers
  that were never measured — the doctrine audit had already recorded that
  there is "effectively no hard proof on doctrine terms." The hero now
  carries one third-party claim verified at its primary source, with its
  qualifier and a `<cite>` link; `ProofStats` keeps its before/after
  structure but describes what the system does instead of asserting
  outcomes.

### Documentation
- Added `docs/strategy/CLAIM_VERIFICATION_LOG.md`, the citations file
  required by `AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md` §1. Records
  primary-source checks and, notably, two claims the corrections table
  marks SAFE that did **not** verify — the 9.3 hrs/week context-switching
  figure is absent from Asana's index, and the MIT NANDA 95% figure has
  no openable primary URL. Both are blocked from publication pending an
  amendment to §1.

### Changed
- Rebuilt `/pricing` around diagnosis, evidence-supported managed
  implementation, Managed Intelligence, and controlled expansion; replaced
  commodity ResponseOS tiers and unsupported performance proof with scoped
  starting prices, evidence guardrails, conservative structured data, tracked
  CTAs, and a price-validation ledger. Audio ratified the commercial testing
  decisions and automatic preview QA on 2026-07-31; merge and production
  publication remain separately gated.

### Tooling
- Added `.github/workflows/validation-summary.yml` (Phase 1 of
  `docs/ops/AUTOMATED_VALIDATION_REVIEW_LOOP.md`): aggregates `CI`,
  `Build & Lint`, and `Smoke Test (Preview)` check results into a
  single sticky PR comment + `validation-summary.json` artifact, and
  classifies the next actor (`codex-fix` / `claude-review` /
  `human-approval` / `none`). Local mirror via `pnpm validate` and
  `pnpm validate:summary`. No new secrets; Phase 2 webhook deferred.

### Changed
- Reordered the homepage narrative to pain → economic cost → diagnosis →
  proof → system → architecture (`src/app/page.tsx`). No section component
  was added, removed, or moved on disk, and the barrel is untouched.
- Repointed the hero's dead `#system-model` link — no such id exists on
  the homepage — to `#process`, and gave that section a scroll offset so
  the anchor clears the fixed header.
- Qualified the hero's category eyebrow as "Founder Intelligence Systems
  for founder-led service businesses" per the entity plan's
  first-mention rule, in both responsive blocks.
- Dropped the ROI section's forward references to ResponseOS, which now
  appears later in the page than the ROI section does.
- Corrected the process headline, which named three steps while
  rendering four.

### Documentation
- Added `docs/strategy/AJ_DIGITAL_S_CURVE_POSITIONING.md`: separates the
  commercial, research, and platform theses, and adds the portfolio
  filter used to decide whether a new product idea compounds. Recorded
  as an ADR in `docs/DECISIONS.md` (2026-08-12). Does not resolve the
  open offer-ladder ratification.
- Promoted `docs/design/DESIGN.md` as the canonical design-system file,
  kept `docs/DESIGN.md` as a redirect stub, and removed the tracked
  lowercase `docs/design.md` duplicate that cannot coexist cleanly on
  Windows.
- Established the canonical `docs/` hierarchy: `PRD.md`, `DESIGN.md`,
  `ROADMAP.md`, `SECURITY.md`, `DEPLOYMENT.md`, `DECISIONS.md`,
  `CHANGELOG.md`.
- Added `AGENTS.md` (root) as the durable contract for any AI coding
  agent operating in this repository, and `CLAUDE.md` (root) as the
  Claude-specific addendum.
- Stubbed superseded docs to single-line redirects without deleting:
  `AUDIOJONES_DESIGN.md`, `docs/design.md`, root `DEPLOYMENT.md`,
  `VERCEL_ENV_SETUP.md`, `docs/VERCEL_ENV_SOP.md`, root `secrets.md`,
  `docs/env.example`, `docs/env/env-template.md`.
- Rewrote `README.md` and `.github/copilot-instructions.md` to reflect
  the actual stack (Cloudflare → Vercel/Next.js → Sanity → NeonDB →
  Resend → n8n; Firebase intentionally excluded).
- Updated `package.json` `description` field to a one-line product
  summary.

---

## 2026-04-29 — Firebase removed from AudioJones.com

### Changed
- Migrated lead persistence to NeonDB
  (`applied_intelligence_leads`).
- Sanity confirmed as the only CMS.
- Resend wired for internal lead notifications; n8n moved to
  optional/best-effort.

### Removed
- Firebase Admin / Firestore / Storage code paths from the marketing
  surface.
- `FIREBASE_*` and `NEXT_PUBLIC_FIREBASE_*` env keys.

### Security
- Added `pnpm check:no-firebase` guardrail to fail CI on
  reintroduction of any Firebase import, package, or env key.

### Notes
Full context: [`docs/DECISIONS.md`](./DECISIONS.md) and
[`docs/architecture/stack-decision.md`](./architecture/stack-decision.md).

---

## How to add an entry

1. Add a section under **Unreleased** while the change is in flight.
2. When a release is cut (or at a logical milestone), promote the
   `Unreleased` section to a dated heading and start a fresh
   `Unreleased`.
3. Keep entries concise — one or two lines per bullet. Link to PRs or
   decision entries for detail.
4. **Never paste secret values** into a security entry, even as
   context. Reference only the rotation steps and affected systems.
