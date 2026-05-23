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

### Fixed
- Agents index (`/agents`): five placeholder agent cards (SignalOS,
  ContentOS, PodcastOS, ClientOS, SalesOS) no longer link to `/agents`
  itself. They render as static cards until per-system detail pages
  exist. Only ResponseOS retains its detail link.
- Homepage process section H2 now reads
  "Diagnose. Attribute. Design. Deploy." to match the four rendered
  step cards (was missing "Attribute").
- Services hero body: dropped decorative `text-aj-orange` on the
  "force multiplier on a working system" phrase per DESIGN.md §4
  ("orange is a signal, not a fill").

### Design
- Replaced hardcoded V1 hex literals (`#0088cc`, `#4b5563`) on
  `/agents`, `/agents/responseos`, and `/ai-readiness-diagnostic`
  light-section copy with the V2 semantic tokens `--accent-blue` and
  `--ink-muted`.
- `SectionIntro` eyebrow swapped from `--aj-amber` (warning) to
  `--aj-gold` (categorical label) so section eyebrows no longer render
  as a warning hue.
- `SignalConsole` recolored: REVENUE LEAK uses `--accent-red`
  (critical), AGENT LAYER uses `--accent-blue`, RECOVERY PATH uses
  `--accent-amber`. Previously REVENUE LEAK shared the success/CTA
  yellow.
- Replaced misapplied `--aj-orange` on the Featured System eyebrow
  (`/agents`), ResponseOS step numerals, and Diagnostic Entry label
  with `--aj-gold` per the eyebrow / numeral conventions in
  DESIGN.md §4.

### Documentation
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
