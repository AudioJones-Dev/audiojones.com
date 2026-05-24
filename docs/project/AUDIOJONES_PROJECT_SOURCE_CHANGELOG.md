# AudioJones.com — Project Source Changelog

**Status:** report document. Not a substitute for `docs/CHANGELOG.md`.
**Scope:** records the work performed to create
`docs/project/AUDIOJONES_PROJECT_SOURCE.md` and the structural choices
made during synthesis.

---

## 1. Files created or modified

### Created
- `docs/project/AUDIOJONES_PROJECT_SOURCE.md` — the consolidated project
  source document.
- `docs/project/AUDIOJONES_PROJECT_SOURCE_CHANGELOG.md` — this report.
- `docs/project/` — new directory under `docs/`.

### Modified
- None. No canonical doc was edited.
- No app code, route, schema, or configuration was touched.

### Intentionally not modified
- `docs/PRD.md`, `docs/ROADMAP.md`, `docs/DESIGN.md`,
  `docs/DEPLOYMENT.md`, `docs/SECURITY.md`, `docs/DECISIONS.md`,
  `docs/CHANGELOG.md` — canonical docs left untouched.
- `AGENTS.md`, `CLAUDE.md`, `README.md` — agent contract and root docs
  left untouched. Recommendation §24.1 in the source document suggests a
  follow-up reference link but does not perform it.
- `.env.example`, `packages/config/env.schema.ts` — no env keys added or
  removed.
- Any application code in `src/`, `apps/`, `packages/`.

---

## 2. Structural changes made

The source document composes the existing canonical PRD and ROADMAP into
a single GitHub-source-ready file with these structural normalizations:

- Promoted the PRD and ROADMAP content into discrete top-level sections
  (Product Vision, Product Requirement Document, Product Roadmap)
  instead of inlining duplicates.
- Replaced the existing "Now / Next / Later" roadmap framing with a
  numbered Phase 0–11 sequence, so milestones map 1:1 onto Phases.
- Added a Founder Intelligence Stack section as **Phase 9**, with the
  full layer matrix and the dependency-driven implementation order.
- Reframed category language from the legacy "Applied Intelligence
  Systems" public framing to **Founder Intelligence Systems** as the
  category and **ResponseOS** as the wedge, per the task brief. Internal
  route names (e.g. `/api/applied-intelligence/leads`) are preserved
  verbatim because those are code paths and changing them is out of
  scope.
- Normalized headings, removed duplicate phrasing carried over from PRD
  and ROADMAP, and fixed Markdown table column widths.
- No broken code fences were carried into the source document; all
  fenced blocks open and close cleanly.

---

## 3. Phase numbering changes

The phase plan was renumbered to insert the Founder Intelligence Stack
and shift the trailing phases:

| Before                                       | After                                              |
| -------------------------------------------- | -------------------------------------------------- |
| (n/a — implicit "Now/Next/Later" roadmap)    | Phase 0 — Foundations and Docs Readiness           |
| (n/a)                                        | Phase 1 — Stack Hardening and Firebase Removal     |
| (n/a)                                        | Phase 2 — Lead-Capture Hardening                   |
| (n/a)                                        | Phase 3 — Applied Intelligence Surface Polish      |
| (n/a)                                        | Phase 4 — Diagnostic v1 (Linear Path)              |
| (n/a)                                        | Phase 5 — Booking Flow Consolidation               |
| (n/a)                                        | Phase 6 — Sanity Content Cluster Expansion         |
| (n/a)                                        | Phase 7 — AEO and Structured-Data Audit            |
| (n/a)                                        | Phase 8 — Commerce Surface Hardening               |
| **Phase 9 — Client Delivery and Backend Ops Alignment**  | **Phase 9 — Founder Intelligence Stack Implementation** |
| **Phase 10 — Launch Readiness and Governance**            | **Phase 10 — Client Delivery and Backend Ops Alignment** |
| —                                            | **Phase 11 — Launch Readiness and Governance**     |

The inserted Phase 9 carries the full Founder Intelligence Stack layer
matrix and the nine-step implementation order specified in the task.

---

## 4. Assumptions

These assumptions were made during synthesis. Each is reversible by a
future edit and none of them were committed to canonical docs.

1. The user's reference to "the provided roadmap/PRD content" was
   interpreted as the existing `docs/PRD.md` + `docs/ROADMAP.md` plus
   the additional strategic direction supplied in the task prompt.
   No external document was attached.
2. Phases 0–8 were inferred from the canonical PRD, ROADMAP, and
   DECISIONS docs. They reflect a reasonable dependency order, not a
   contractual sequence.
3. The legacy public framing "Applied Intelligence Systems" was kept as
   the **route/code** label (`/api/applied-intelligence/leads`) but the
   public **category** framing in the new source document is
   **Founder Intelligence Systems**, per the task brief. Aligning the
   route name to the new category framing is out of scope for this
   task.
4. ResponseOS is described as the first wedge but no new public surface
   was scoped — the source document leaves "dedicated public page vs.
   tier recommendation" as an open question (§23).
5. Vapi vs. Retell AI is documented as a single layer with both options;
   the pilot choice is left open.
6. Metabase is documented as pointing directly at Neon by default; a
   warehouse intermediary is listed as an open question.
7. Hotjar consent gating is assumed mandatory but not specified in
   detail — the consent UX belongs to a separate task.

---

## 5. Open questions

These map to §23 of the source document. They are repeated here so a
future Codex task can pick them up without re-reading the full source.

- Booking provider: Calendly or Cal.com?
- ResponseOS public surface: dedicated page in v1, or tier
  recommendation only?
- Phase 9 AI intake pilot: Vapi or Retell AI? Under what qualifying
  criteria?
- Threshold lead score for `qualified` in the public dashboards?
- Sunset trigger and date for legacy `/portal/*`?
- Metabase source: Neon direct, or warehouse intermediary first?

---

## 6. Recommended next Codex task

The natural next task — and the one with the highest leverage on
downstream phases — is:

> **Reference `docs/project/AUDIOJONES_PROJECT_SOURCE.md` from
> `AGENTS.md` and `README.md`, and snapshot the Phase 9 baseline
> measurement (server logs, lead records, Vercel analytics) into a new
> `docs/project/PHASE_9_BASELINE.md` file.**

This is the smallest concrete step that:
- Makes the source document discoverable to agents and humans.
- Locks the Phase 9 baseline before any analytics tool is installed,
  per the dependency-driven implementation order in §15.2.
- Does not touch app code, env keys, or canonical docs beyond a
  reference link.

If a different next step is preferred, two alternatives:

1. Open the booking-provider decision (Phase 5) as a
   `docs/DECISIONS.md` entry so Phase 5 can begin.
2. Convert §21 Task Backlog into tracked GitHub issues against the
   milestones in §20, starting with `M2 — Lead-capture hardening` and
   `M4 — Diagnostic v1`.

---

## 7. Validation performed

The task brief restricts validation to safe checks only. The following
were considered the safe checks and will be run by the operator:

- `git diff -- docs/project/AUDIOJONES_PROJECT_SOURCE.md docs/project/AUDIOJONES_PROJECT_SOURCE_CHANGELOG.md`
- `git status --short`

No commits were created. No branches were pushed. No app code was
modified. No env keys were touched. No live secret-dependent integration
was wired.
