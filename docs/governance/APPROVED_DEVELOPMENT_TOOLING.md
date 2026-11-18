# Approved Development Tooling

This record lists development-time tooling approved for use with this repository,
so agents can check a tool's provenance, version and approval status from inside
the repository. Installing, upgrading or widening the use of any tool still needs
human approval under `AGENTS.md`.

## agent-skills (pilot)

- Capability: engineering workflow guidance for coding agents (three skills)
- Upstream repository: `addyosmani/agent-skills`
- Approved version: tag `0.6.9`, commit `84ee50673804b95c287d1e4eb4f1c1dad7c5188a`
- License: MIT (notice in `skills/THIRD_PARTY_NOTICES.md`)
- Approved files, copied unmodified (blob SHAs listed in the notice):
  - `skills/performance-optimization.skill.md`
  - `skills/deprecation-and-migration.skill.md`
  - `skills/source-driven-development.skill.md`
- Why these three: the other 22 agent-skills duplicate workflows already in use
  (superpowers, EGM, code review, security review, frontend design). These three cover
  gaps that fit this repo: Core Web Vitals work, retiring the legacy `/portal/*` and
  `/api/admin/*` routes, and citing official framework docs.
- How agents use them: the same way as the other `skills/*.skill.md` files, when pointed to
  them. They are not auto-loaded (`.claude/` is gitignored here by design).
- Not approved: the rest of agent-skills, its plugin, hooks, slash commands and
  `references/` directory; any dependency a skill suggests (for example `bundlesize`,
  `@lhci/cli`, `web-vitals`) without separate approval.
- Repository dependency: No. Runtime dependency: No.
- Status: **Pilot**, approved by the operator on 2026-11-18. AgentOps run
  `515feb31-dc77-4af9-9145-509ffc74f26f`.
- Pilot exit (2 weeks from merge): compare each skill with existing workflows on real tasks
  in this repo. Keep a skill only if it changed an outcome. Otherwise remove its file and its
  row in the notice, and update this entry.
