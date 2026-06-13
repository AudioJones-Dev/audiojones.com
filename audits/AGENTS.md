# AGENTS.md - Audits DOX

## Purpose

- Own audit records, generated site inventories, page scorecards, raw captures,
  and audit-derived roadmaps.

## Ownership

- Applies to `audits/`.
- Audit results are records of evidence. Product docs remain owned by `docs/`;
  implementation remains owned by `src/`, `public/`, and related subtrees.

## Local Contracts

- Do not overwrite or delete audit outputs unless the task is an explicit audit
  rerun or cleanup.
- If an audit produces a durable change in site rules, update the owning
  AGENTS.md or canonical doc instead of leaving the rule only in an audit note.

## Work Guidance

- Keep generated records timestamped or clearly tied to the run they came from.
- Distinguish observed facts from recommendations in audit roadmaps.

## Verification

- When modifying audit tooling or rerunning audits, record the command used and
  the target URL or route set.

## Child DOX Index

- No child AGENTS.md files are currently defined under `audits/`.
