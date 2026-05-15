# ROADMAP.md — AudioJones.com

**Status:** living document. Sequence is suggestive, not contractual.

This roadmap is intentionally short. Detail lives in PRs, decision
entries ([`DECISIONS.md`](./DECISIONS.md)), and the changelog
([`CHANGELOG.md`](./CHANGELOG.md)).

---

## Now (in flight)

- **Docs readiness bootstrap.** Establish AGENTS.md, CLAUDE.md, and the
  canonical `docs/` hierarchy. Stub legacy/duplicated docs to a single
  source of truth. *(this PR)*
- **Applied Intelligence surface polish.** Continue migrating legacy
  marketing pages onto the canonical AI surface. Track open visual debt
  in PR descriptions, not here.
- **Lead-capture hardening.** Continue ensuring all forms route through
  `src/app/api/applied-intelligence/leads/route.ts` and persist to Neon
  before any optional integrations fire.

## Next (queued, not started)

- **Sanity content cluster expansion.** Topic clusters per persona
  (founder, creator, operator). Schema lives in
  [`docs/sanity-blog-content-model.md`](./sanity-blog-content-model.md).
- **AEO structured-data audit.** Verify `JSON-LD`, `OpenGraph`, and
  sitemap completeness across the canonical surface.
- **Booking flow consolidation.** Single source of truth for the
  `Book a Call` provider/URL; remove ad-hoc links.
- **Legacy `/portal/*` decommission plan.** Identify which routes are
  still serving real traffic and define a sunset path.

## Later (directional, not committed)

- **AI Readiness Diagnostic v2** — adaptive question paths driven by
  scoring rather than linear forms.
- **ROI Calculator v2** — tie outputs to the Whop product catalog so
  the recommended package is one click away.
- **Self-serve case-study pipeline** — Sanity-driven, gated previews.
- **Edge-rendered personalization** — per-persona hero variants via
  Cloudflare Workers, behind a feature flag.

## Explicitly out of scope

- Reintroducing Firebase (see [`DECISIONS.md`](./DECISIONS.md)).
- Building admin/portal CRUD on this codebase.
- Multi-tenant or white-label modes.
- A native mobile app.

---

## Tracking

Roadmap items become real when:

1. A linked decision exists in [`DECISIONS.md`](./DECISIONS.md), and
2. There is a tracked issue or PR with an owner.

Items that don't meet both bars are **directional**, not committed —
treat them as research prompts.
