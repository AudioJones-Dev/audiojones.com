# AGENTS.md - Specs DOX

## Purpose

- Own Git Spec-ready specs, plans, research, tasks, contracts, data models, and
  quickstarts under `specs/`.

## Ownership

- Applies to `specs/`.
- Canonical docs remain owned by `docs/`; Specify tool artifacts remain owned
  by `.specify/`.

## Local Contracts

- Specs define intended work. They do not override root approval gates or
  nearest source-code AGENTS.md files.
- Keep public marketing-site specs separate from admin/portal monolith scope.
- API contracts must stay aligned with actual route handlers before being used
  as implementation truth.

## Work Guidance

- Use clear sections for problem, desired outcome, success criteria, scope,
  constraints, risks, and open questions.
- Update tasks when implementation reality changes the plan.

## Verification

- Specs-only edits usually need no code gate.
- If generated contracts change, validate them with the relevant parser or
  consumer when available.

## Child DOX Index

- No child AGENTS.md files are currently defined under `specs/`.
