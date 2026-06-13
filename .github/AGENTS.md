# AGENTS.md - GitHub automation DOX

## Purpose

- Own repository-level GitHub configuration: workflows, Copilot instructions,
  reusable prompts, and CI/deploy automation metadata.

## Ownership

- Applies to `.github/`, including `workflows/`, `prompts/`, and
  `copilot-instructions.md`.
- Parent root AGENTS.md owns repo-wide safety, branch, Firebase, and validation
  rules.

## Local Contracts

- Workflow changes must preserve `pnpm check:no-firebase` and the existing code
  gates unless the root contract is explicitly updated.
- Deploy or production-affecting workflow changes require explicit operator
  approval before execution.
- Prompt files must not weaken AGENTS.md, DOX, security, or route-protection
  rules.

## Work Guidance

- Keep CI/deploy edits narrow and name the affected job, trigger, and command.
- Do not add secrets to workflow YAML or prompts.
- When modifying prompts, keep them consistent with root AGENTS.md and the
  canonical docs under `docs/`.

## Verification

- For workflow syntax changes, inspect the YAML and run any available local
  validation before handoff.
- For code-gate command changes, run the affected command locally when
  practical.

## Child DOX Index

- No child AGENTS.md files are currently defined under `.github/`.
