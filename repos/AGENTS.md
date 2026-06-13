# AGENTS.md - Nested repos DOX

## Purpose

- Own nested or linked external repositories stored under `repos/`.

## Ownership

- Applies to `repos/`.
- Each nested repo may have its own AGENTS.md. When working inside one, read
  that repo's contract after this file.

## Local Contracts

- Treat nested repos as separate projects. Do not assume root AudioJones.com
  rules are sufficient for their internals.
- Do not vendor, delete, or mass-edit nested repo contents without explicit
  scope.

## Work Guidance

- Verify the nested repo's `git status`, branch, and remote before changes.
- Keep cross-repo references explicit and avoid hidden coupling.

## Verification

- Use the nested repo's own verification commands when available.

## Child DOX Index

- No child AGENTS.md files are currently defined under `repos/`.
