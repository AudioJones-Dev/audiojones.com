# DECISIONS.md — AudioJones.com decision log

A lightweight architecture decision record (ADR) log. Each entry is
short, dated, and immutable once accepted. Supersede with a new entry
rather than rewriting an old one.

Format:

```
## YYYY-MM-DD — short title
Status: proposed | accepted | superseded | rejected
Decision: …
Rationale: …
Consequences: …
```

---

## 2026-04-29 — Drop Firebase from AudioJones.com

**Status:** accepted
**Decision:** AudioJones.com runs on Cloudflare → Vercel/Next.js →
Sanity → NeonDB → Resend → n8n, with Supabase added only when auth /
storage / realtime is genuinely required. Firebase (and any
`FIREBASE_*` / `NEXT_PUBLIC_FIREBASE_*` env keys) is intentionally
excluded.

**Rationale:** the site's responsibilities — marketing pages, SEO/AEO,
lead capture, transactional email, lightweight automation — are fully
covered by the stack above without overlap. Firebase added duplicate
hosting, duplicate functions, duplicate storage, and duplicate
Postgres-class storage without adding capability for this specific
site. Firebase Studio is also being sunset on 2027-03-22, which made
the dependency strictly worse over time.

**Consequences:**
- A `pnpm check:no-firebase` guardrail fails CI if Firebase imports,
  packages, or env keys are reintroduced.
- The legacy `/portal/*` and `/api/admin/*` routes that depended on
  Firebase Admin remain in the codebase as a phase-out queue, not as a
  development surface. New admin needs go to a separate application.
- A typed shim (`src/lib/legacy-stubs.ts`) keeps unmigrated tooling
  type-checking until it is removed.

Full context: [`docs/architecture/stack-decision.md`](./architecture/stack-decision.md).

---

## 2026-04-29 — NeonDB as the lead store

**Status:** accepted
**Decision:** Founder Intelligence diagnostic leads and other
structured marketing data persist to NeonDB (Postgres). Sanity remains
the CMS for unstructured/long-form content.

**Rationale:** Neon gives us a real Postgres with branching for
preview environments, low operational overhead, and clean separation
from the CMS surface.

**Consequences:**
- Schema lives in `db/migrations/` (canonical:
  `db/migrations/001_applied_intelligence_leads.sql`).
- Lead capture handlers must persist to Neon **before** firing
  optional integrations (Resend, n8n) so we never lose a lead to a
  downstream outage.

---

## 2026-04-29 — Resend for transactional email; n8n is optional

**Status:** accepted
**Decision:** Internal lead notifications go through Resend
(`RESEND_API_KEY` + `LEAD_NOTIFICATION_EMAIL`). The n8n webhook is
optional and best-effort.

**Rationale:** keeps the critical path short and observable. Email
delivery is a Resend dashboard problem; workflow orchestration is an
n8n problem. They don't block each other.

**Consequences:** lead capture handlers must not let n8n failures
short-circuit the response.

---

## 2026-05-15 — Documentation readiness bootstrap

**Status:** accepted
**Decision:** Establish `AGENTS.md`, `CLAUDE.md`, and a canonical
`docs/` hierarchy (`PRD.md`, `DESIGN.md`, `ROADMAP.md`,
`SECURITY.md`, `DEPLOYMENT.md`, `DECISIONS.md`, `CHANGELOG.md`).
Older root-level and duplicated docs become one-line redirect stubs
pointing at the canonical files.

**Rationale:** the repo accumulated parallel documents
(`AUDIOJONES_DESIGN.md` + `docs/design.md`, root `DEPLOYMENT.md` +
`VERCEL_ENV_SETUP.md` + `docs/VERCEL_ENV_SOP.md`, `docs/env.example` +
`docs/env/env-template.md`). Without one source of truth, AI agents
and humans both end up reading stale material.

**Consequences:**
- New work updates the canonical docs only.
- Stub files remain so existing inbound links don't 404 in editors,
  but they carry no content beyond a redirect line.
- Future docs follow the same pattern: one canonical home, stubs
  elsewhere if needed.

---

## 2026-06-07 — Canonical design system path

**Status:** accepted
**Decision:** `docs/design/DESIGN.md` is the canonical design-system and
brand-voice source of truth. `docs/DESIGN.md` remains as a redirect stub for
older links. The tracked lowercase `docs/design.md` duplicate is removed from
Git because it case-collides with `docs/DESIGN.md` on Windows checkouts.

**Rationale:** newer implementation briefs already depend on
`docs/design/DESIGN.md`, and that file contains the current v2 design system.
Keeping both `docs/DESIGN.md` and `docs/design.md` tracked as separate files
creates an unstable working tree on case-insensitive filesystems.

**Consequences:**
- Agents should read `docs/design/DESIGN.md` before UI or voice work.
- Existing `docs/DESIGN.md` links still resolve to a redirect stub.
- Do not re-add `docs/design.md`; use `docs/DESIGN.md` only as the legacy
  redirect path.

---

## 2026-06-08 — Canonical public host is www.audiojones.com

**Status:** accepted
**Decision:** Default public SEO URLs use `https://www.audiojones.com`.
Sitemap, robots, page metadata, and JSON-LD should resolve through the shared
site URL helpers instead of hardcoded non-www URLs. A legacy exact
`https://audiojones.com` `NEXT_PUBLIC_SITE_URL` value is normalized to the
www host.

**Rationale:** the site audit found sitemap URLs resolving through the
non-www to www redirect path. Canonical URLs should match the final production
destination to avoid avoidable redirect hops and mixed host signals.

**Consequences:**
- `NEXT_PUBLIC_SITE_URL` can still override the host per environment, except
  the exact non-www production host is normalized to the final www host.
- The default fallback host is now `https://www.audiojones.com`.
- Retired `/book` remains handled by the existing permanent redirect to
  `/book-a-call`; robots must not block the live `/book-a-call` path.

---

## 2026-08-17 — Founder Intelligence Diagnostic is the primary GTM CTA

**Status:** accepted
**Decision:** The paid-entry CTA on the primary marketing and ResponseOS
surfaces is **Start the Founder Intelligence Diagnostic** at
`/founder-intelligence/diagnostic`. The AI Readiness Scorecard remains a free
secondary entry. ResponseOS is supporting proof and links secondarily to its
controlled sandbox walkthrough.

**Rationale:** A diagnostic-first path keeps the recommendation tied to the
founder's actual operating constraint and prevents a planned system or demo
from being presented as an already-proven customer implementation.

**Consequences:** Public CTA changes preserve the existing diagnostic form,
Neon persistence, and two-business-day response SLA. Pricing is not changed.
The ResponseOS demo must disclose fictional persisted data, no live providers,
no CRM/calendar mutation, and no verified-revenue result.

---

## How to add an entry

1. Append to the bottom of this file with today's date.
2. Use the four-field format above.
3. If the new decision supersedes an older one, mark the older entry
   `superseded by YYYY-MM-DD — short title` instead of deleting it.
4. Keep entries to a screen or less. Link out for detail.
