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
- Added `docs/reviews/` holding the redlined corrections to the Offer Map
  plan and the Search Implementation Spec v1.1. Both were authored against
  an earlier reading of the repository and reproduced the same two critical
  defects: a `robots.txt` block that replaces rather than merges — dropping
  13 of the 16 live disallow lines, including `/uploader`, `/env`, and
  `/portal/admin/` — and a Phase 0 gate covering roughly three of the ten
  commercial decisions the Master Pricing Matrix itself lists as blocking
  publication. The redlines also add a proof gate: the plan's own
  qualification rule requires original proof per indexed page, and
  `/case-studies` currently has no named clients and no `[slug]` routes, so
  the seven family hubs cannot all clear it. Claims marked *build-verified*
  were confirmed against generated `robots.txt` and `sitemap.xml` output
  rather than source reading — including that all 32 sitemap URLs share one
  `lastmod` equal to the build timestamp.
- Recorded the rejection of a nine-file QuestionFinder research corpus in
  `data/search-intelligence/raw/rejected/questionfinder-2026-08-31/`. Six of
  the files are one generic home-services FAQ template with the seed string
  substituted in — 102 of 102 questions identical, in identical row order,
  across all six, with volumes jittered 17–27% around a shared base. The
  remaining three are all zero-volume with the seed's qualifiers absent from
  most rows. Substitution produced 84 category-alien questions carrying
  confident volume, such as "does medicare cover ai receptionist" at
  1,175/mo. The operative risk was an inversion: the genuine Miami data
  showed almost nothing while the synthetic Miami data showed strong local
  demand, so an unaudited read made the local wedge look validated. Files
  are retained unmodified with SHA-256 recorded and a `verify-rejection.cjs`
  that reproduces the finding, because the rejection is itself evidence of a
  failure mode worth recognising again. Zero rows from this batch are
  admissible in the Query Opportunity Register.
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
