# AGENTS.md - Data DOX

## Purpose

- Own durable structured data files used by the site, such as catalogs and
  configuration-adjacent JSON.

## Ownership

- Applies to `data/`.
- Runtime config in `src/config/` is owned by `src/config/AGENTS.md`.

## Local Contracts

- Data files must not contain secrets, private client records, or live payment
  details.
- Changes to pricing, offer names, or public catalog content are public-copy
  changes and require explicit approval when the user has not already scoped
  them.

## Work Guidance

- Preserve machine-readable shape. Prefer schema-aware edits over ad hoc text
  edits.
- Keep catalog changes synchronized with any public pages that consume them.

## Verification

- Validate JSON syntax after edits.
- Run root code gates when data changes affect typed imports or build output.

## Child DOX Index

- No child AGENTS.md files are currently defined under `data/`.
