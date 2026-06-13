# AGENTS.md - Documentation DOX

## Purpose

- Own canonical documentation, architecture decisions, design guidance,
  deployment and env documentation, specs, strategy notes, amendments, and
  archive stubs.

## Ownership

- Applies to `docs/`.
- Root-level redirect stubs are listed in root AGENTS.md and should remain
  stubs unless explicitly replaced.

## Local Contracts

- Canonical sources of truth include `docs/PRD.md`,
  `docs/design/DESIGN.md`, `docs/ROADMAP.md`, `docs/SECURITY.md`,
  `docs/DEPLOYMENT.md`, `docs/DECISIONS.md`, and `docs/CHANGELOG.md`.
- Architecture decisions go in `docs/DECISIONS.md` as short ADR-style entries.
- Design and brand voice rules live in `docs/design/DESIGN.md`.
- Archived docs are historical; do not make them the active contract without a
  DOX pass.

## Work Guidance

- Markdown should be Git Spec-friendly: structured, explicit, and operational.
- Supersede stale docs with redirects or decision entries instead of duplicating
  sources of truth.
- Keep facts, assumptions, risks, and open questions separated in planning docs.

## Verification

- Docs-only edits usually do not require code gates.
- If a doc change changes a code, env, deploy, or workflow contract, run or
  name the relevant existing verification command.

## Child DOX Index

- No child AGENTS.md files are currently defined under `docs/`.
