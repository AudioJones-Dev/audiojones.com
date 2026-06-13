# AGENTS.md - Test DOX

## Purpose

- Own repository tests and test fixtures.

## Ownership

- Applies to `test/`.
- Implementation code remains owned by its source subtree.

## Local Contracts

- Tests should verify behavior rather than locking in incidental implementation
  details.
- Do not weaken guards such as `check:no-firebase` tests to make unrelated work
  pass.

## Work Guidance

- Add focused tests for shared logic, bug fixes, and guardrails with meaningful
  failure risk.
- Keep fixtures free of secrets and real client data.

## Verification

- Run the targeted test command when available.
- Run root code gates when tests are added or changed:
  `pnpm typecheck`, `pnpm lint`, `pnpm check:no-firebase`, and `pnpm build`.

## Child DOX Index

- No child AGENTS.md files are currently defined under `test/`.
