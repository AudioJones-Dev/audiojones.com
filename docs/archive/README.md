# docs/archive

Historical and project-tracking documents that were produced during past
phases of work on AudioJones.com.

## Purpose

This folder preserves point-in-time reports — phase completion notes,
hardening summaries, status snapshots, early IA drafts, and other
project-tracking artifacts — so that the institutional knowledge they
captured is not lost.

## Rule

Files under `docs/archive/` are **historical / reference only**.

- Do not treat them as current truth about the system.
- Do not update them in place to reflect new work.
- Do not link to them from product UI or runtime code.
- If a topic still matters, capture it in the canonical doc instead and
  leave the archive copy untouched.

## Canonical docs

The authoritative operational and product documentation now lives
directly under [`docs/`](../). Start with:

- [`docs/PRD.md`](../PRD.md) — product requirements
- [`docs/design/DESIGN.md`](../design/DESIGN.md) — visual + voice contract
- [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md) — environment + Vercel rules
- [`docs/SECURITY.md`](../SECURITY.md) — what must never leak
- [`docs/DECISIONS.md`](../DECISIONS.md) — stack decisions
- [`docs/CHANGELOG.md`](../CHANGELOG.md) — change log

If something here looks like it conflicts with the canonical docs above,
the canonical docs win.
