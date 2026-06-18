---
title: "Phase 4B — Generic Diagnostic Runtime Helpers Plan"
status: plan (documentation only — no code)
version: v1.0
date: 2026-06-18
owner: AJ Digital LLC
approver: Audio — approves Phase 4B plan only; no implementation yet
scope: documentation only — no code, no migrations, no API/UI/scoring/DB changes
phase: 4B (runtime helpers) of the approved 4A→4E sequence
binding-sources:
  - docs/diagnostics/PHASE_4A_SHARED_RUNTIME_TYPES_PLAN.md
  - docs/strategy/PHASE_3C_FOUNDER_GRAVITY_SHARED_ENGINE_PARITY_REPORT.md
  - src/lib/diagnostics/types/** (Phase 4A contracts, merged)
  - live Founder Gravity source
---

# Phase 4B — Generic Diagnostic Runtime Helpers Plan

> **What this is.** A documentation-only implementation plan for **Phase
> 4B**: extract Founder Gravity's runtime helpers (session, draft, events,
> scoring adapter, result adapter, runtime mapping) into a generic,
> framework-light layer that satisfies the Phase 4A contracts — **without
> changing any runtime behavior** and **without any database work**.

> **Discipline:** types (4A, done) → **helpers (4B)** → database (4C).
> 4B builds the helpers as **additive, behavior-equivalent** modules and
> proves equivalence to the live engine. It does **not** rewire the live
> `FounderGravityAuditFlow` component (that is a separately-approved step).

---

## 1. Current Founder Gravity runtime helper inventory

All runtime logic lives in two client components plus the pure scoring lib.
Helpers are currently **inline** (module-level functions + in-component
closures), not shared.

**`src/components/founder-gravity-audit/FounderGravityAuditFlow.tsx`** (496 lines):

| Helper | Location | Kind | Behavior |
|---|---|---|---|
| `STORAGE_DRAFT_KEY` / `STORAGE_REPORT_KEY` | 20–21 | const | `"audiojones:fga:draft"` / `"audiojones:fga:last-report"` |
| `createSessionId()` | 56–61 | module fn | `crypto.randomUUID()` else `fga-${Date.now()}-${rand}` |
| `getAttribution()` | 70–84 | module fn | reads `window.location`/UTMs → `FounderGravityAttribution` |
| `emitBrowserEvent(event)` | 86–95 | module fn | `dataLayer.push({ event: \`fga_${name}\`, ...metadata })` + `CustomEvent("audiojones:fga_event")` |
| `recordEvent(name, metadata)` | 145–154 | in-component | builds `{event,timestamp,metadata}`, appends to capped-50 `events` state, calls `emitBrowserEvent` |
| `saveDraft()` | 156–166 | in-component | writes `{answers, questionIndex, savedAt}` to localStorage; records `diagnostic_saved` |
| mount effect | 120–143 | in-component | session id + `startedAt` + attribution + **load draft** + `diagnostic_started` |
| scoring `useMemo` | 111–118 | in-component | `scoreFounderGravityAudit(answers, { consentToContact, durationSeconds })` |
| `submitGate()` | 193–255 | in-component | POST `/api/founder-gravity-audit/leads` → store report (sessionStorage) → clear draft → `report_viewed` → navigate |

**`src/components/founder-gravity-audit/FounderGravityReport.tsx`** (203 lines):
rehydrates `StoredReport` from `sessionStorage[STORAGE_REPORT_KEY]`, renders
the result, emits `fga_cta_clicked` on CTA click.

**`src/lib/founder-gravity-audit/scoring.ts`**: pure
`scoreFounderGravityAudit(answers, opts)` → `FounderGravityResult` (already
pure and side-effect-free; the cleanest extraction target).

**Observation:** the *pure* pieces (scoring, session id, draft
serialization, event-object construction, attribution read) are trivially
extractable; the *orchestration* (`submitGate`) is React/route-coupled and
stays in the component.

---

## 2. Existing session / draft behavior

- **Session id**: created once on mount (`createSessionId`), stored in state,
  sent in the lead POST. Prefix `fga-` only in the non-crypto fallback.
- **Draft**: `localStorage["audiojones:fga:draft"] = { answers, questionIndex,
  savedAt }`. Loaded on mount (clamps `questionIndex` to range; removes the
  key on parse error). Saved via `saveDraft()`. **Cleared** after a
  successful gate submit (`localStorage.removeItem`).
- **Report handoff**: `sessionStorage["audiojones:fga:last-report"] =
  StoredReport` written on submit, read by the report page.

Generic-target shape: key-addressed `load/save/clear` helpers + a session-id
factory taking a prefix — behavior identical.

---

## 3. Existing event behavior

- **7 funnel events**: `diagnostic_started`, `diagnostic_saved`,
  `question_skipped`, `diagnostic_completed`, `preview_viewed`,
  `email_gate_submitted`, `report_viewed` (+ `fga_cta_clicked` from the
  report component).
- **Event object**: `{ event, timestamp: ISO, metadata? }`.
- **State buffer**: appended to `events`, **capped at last 50**, sent with the
  lead POST.
- **Emission**: `dataLayer.push({ event: \`fga_${name}\`, ...metadata })`
  **and** `window.dispatchEvent(new CustomEvent("audiojones:fga_event"))`.

Generic-target shape: `createDiagnosticEvent(name, metadata)` +
`emitDiagnosticEvent({ prefix, customEventName }, event)` + a recorder
factory that owns the capped buffer — prefix/customEventName parameterized
(FG passes `"fga"` / `"audiojones:fga_event"`), behavior identical.

---

## 4. Existing scoring adapter behavior

- `scoreFounderGravityAudit(answers, { consentToContact?, durationSeconds? })`
  → `FounderGravityResult`. **Pure**, deterministic, no I/O.
- Called in two places with identical inputs: the live `useMemo` (preview)
  and server-side in the API route (authoritative). The function is already
  the de-facto "scoring adapter."

Generic-target shape: a `DiagnosticScoringAdapter` (interface already
declared in Phase 4A `runtime-config.ts`) implemented by a thin
`founderGravityScoringAdapter` that calls `scoreFounderGravityAudit` and runs
the result through the §5 result adapter — **no change to the scoring math**.

---

## 5. Existing result / report behavior

- **Result type**: `FounderGravityResult` (gravityLoad, segment, layerScores,
  topLayers, highestLayer, confidence, suppression, cta, …).
- **Phase 4A mapped this to `DiagnosticResultDefinition`** via the documented
  renames (gravityLoad→primaryScore, segment→classification,
  layerScores→moduleScores, topLayers→topModules, highestLayer→highestModule),
  already type-proven by the merged conformance assertion.
- **Report rendering** consumes the FG result shape directly from
  sessionStorage.

Generic-target shape: a pure `toDiagnosticResult(fgResult)` adapter that
performs exactly those renames at the *value* level (the runtime counterpart
of the 4A type-level proof). It does **not** alter any field value — only key
names — so the rendered report is unaffected.

---

## 6. Proposed generic runtime helper boundaries

All helpers are **pure or browser-guarded**, framework-agnostic (no React),
and **behavior-identical** to the inline FG logic. They satisfy the Phase 4A
contracts.

| Helper | Signature (proposed) | Extracted from |
|---|---|---|
| Session | `createDiagnosticSessionId(prefix: string): string` | `createSessionId` |
| Draft | `loadDraft<T>(key): T \| null` · `saveDraft<T>(key, value): void` · `clearDraft(key): void` | mount effect + `saveDraft` |
| Events | `createDiagnosticEvent(name, metadata?): DiagnosticEvent` · `emitDiagnosticEvent(cfg, event): void` · `createEventRecorder(cfg, push): (name, metadata?) => DiagnosticEvent` | `recordEvent` + `emitBrowserEvent` |
| Result adapter | `toDiagnosticResult(fg: FounderGravityResult): DiagnosticResultDefinition` | §5 renames |
| Scoring adapter | `founderGravityScoringAdapter: DiagnosticScoringAdapter` | `scoreFounderGravityAudit` + result adapter |
| Runtime mapping | `founderGravityRuntimeConfig: DiagnosticRuntimeConfig` (keys, prefixes, minAnswers=12, honeypot field, event names) | constants + `getAttribution` knobs |

**Boundary rules:**
- Helpers are **side-effect-free except** the explicitly browser-touching ones
  (draft/events), which guard `typeof window === "undefined"` exactly as FG
  does today.
- **No React, no `fetch`, no routing** inside helpers — orchestration
  (`submitGate`) stays in the component.
- Helpers **import the Phase 4A types**, becoming the first real consumers of
  that contract surface (4A was inert; 4B activates it — but only inside the
  new `runtime/` layer, not in the live flow).

---

## 7. Proposed file structure (for the 4B code PR — not this PR)

```
src/lib/diagnostics/runtime/
  session.ts                      createDiagnosticSessionId
  draft.ts                        loadDraft / saveDraft / clearDraft
  events.ts                       createDiagnosticEvent / emitDiagnosticEvent / createEventRecorder
  result-adapter.ts               toDiagnosticResult (FounderGravityResult -> DiagnosticResultDefinition)
  scoring-adapter.ts              founderGravityScoringAdapter (impl of DiagnosticScoringAdapter)
  founder-gravity.runtime.ts      founderGravityRuntimeConfig (DiagnosticRuntimeConfig instance)
  index.ts                        barrel
scripts/
  verify-diagnostics-runtime.ts   parity check (mirrors existing scripts/verify-founder-gravity-audit.ts)
```

- **Additive only.** No edits to `FounderGravityAuditFlow.tsx`,
  `FounderGravityReport.tsx`, the scoring lib, routes, or the existing types.
- `scripts/verify-diagnostics-runtime.ts` follows the **existing precedent**
  `scripts/verify-founder-gravity-audit.ts`: feed sample answer sets through
  both `scoreFounderGravityAudit` and `founderGravityScoringAdapter` and
  assert the adapter's output maps 1:1 (proves behavior equivalence without a
  test runner — the repo has no Vitest/Jest, per AGENTS/CLAUDE notes).

---

## 8. Non-goals

Phase 4B will **not**:
- **Rewire the live `FounderGravityAuditFlow`** to consume the helpers (a
  separately-approved follow-up; see §12 Gate 3). 4B proves equivalence; it
  does not swap the running code.
- Create or alter any **database migration** or table (that is 4C).
- Change any **API route**, **UI**, page, or component.
- Change any **scoring** math, weights, thresholds, or suppression rules.
- Touch the **AI Readiness / Revenue Leak** implementations (4D/4E).
- Touch **CRM, PostHog, n8n, or Metabase**.
- Alter Founder Gravity behavior in any observable way.

---

## 9. Validation commands

For the 4B implementation PR:

```bash
pnpm typecheck            # helpers must satisfy the 4A contracts
pnpm lint                 # 0 errors
pnpm check:no-firebase
pnpm tsx scripts/verify-diagnostics-runtime.ts   # parity: adapter == live FG scoring
pnpm build                # must still succeed (live flow untouched)
```

Parity expectation: `verify-diagnostics-runtime.ts` exits non-zero if the
generic scoring/result adapter output diverges from the live
`scoreFounderGravityAudit` for any sample — the behavioral guardrail
equivalent to 4A's type-conformance guardrail.

---

## 10. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Helper drifts from FG behavior | Medium | §9 parity script asserts adapter == live scoring on samples |
| Accidental behavior change via "tidy-up" during extraction | Medium | Move logic **verbatim**; no refactors of math/guards; live flow untouched |
| Helpers leak React/route coupling | Low | Boundary rule: no React/fetch/routing in `runtime/`; orchestration stays in component |
| Event/dataLayer regression | Medium | Keep `fga_` prefix + `audiojones:fga_event` exactly; parameterize but default to FG values |
| Result-adapter renames a value, not just a key | Medium | Adapter only re-keys; parity script compares values field-by-field |
| Premature rewire of live flow | Medium | Explicit non-goal (§8) + Gate 3 approval before any rewire |
| 4A types insufficient for a helper | Low | Surface as a 4A follow-up; do not expand scope silently in 4B |

---

## 11. Rollback plan

- **This plan PR**: docs-only; revert = delete file / `git revert`.
- **The 4B implementation PR**: all files are **new and unimported by the
  live flow** (`runtime/` + one script). Rollback = delete
  `src/lib/diagnostics/runtime/` + the script and revert the commit. Because
  the live `FounderGravityAuditFlow` is untouched, removal cannot affect app,
  API, build, UI, or data. Zero data risk (no DB).

---

## 12. Human approval gates

- **Gate 1 (now):** Audio approves *this* Phase 4B plan. No code yet.
- **Gate 2:** Audio approves the 4B **implementation PR** (helpers + parity
  script) before merge.
- **Gate 3 (separate, later):** Audio explicitly authorizes **rewiring the
  live `FounderGravityAuditFlow`** to consume the helpers. 4B does not imply
  this; it is its own behavior-preserving PR with the parity script as proof.
- **No migration** is proposed or approved until **Phase 4C**.

---

## 13. Definition of done (for the 4B implementation PR)

1. The `src/lib/diagnostics/runtime/` modules (§7) exist, additive only,
   satisfying the Phase 4A contracts.
2. `founderGravityScoringAdapter` + `toDiagnosticResult` reproduce
   `scoreFounderGravityAudit` output 1:1 (verified by
   `scripts/verify-diagnostics-runtime.ts`).
3. `pnpm typecheck && pnpm lint && pnpm check:no-firebase && pnpm build` pass,
   and the parity script exits 0.
4. No existing file is modified (verified by `git diff --stat` showing only
   new files under `src/lib/diagnostics/runtime/` + the new script).
5. The live `FounderGravityAuditFlow` / `FounderGravityReport` are untouched;
   Founder Gravity behavior is unchanged.

---

## 14. Next implementation prompt

> Use after Audio approves this plan (Gate 1).

```
Review/Diagnosis owner: Claude
Actionable AI Assistant Task owner: Claude
Execution location/tool: audiojones.com repository
Human/operator role: Audio approves the Phase 4B implementation PR before merge
Task:
Implement Phase 4B — Generic Diagnostic Runtime Helpers, exactly as scoped in
docs/diagnostics/PHASE_4B_GENERIC_RUNTIME_HELPERS_PLAN.md §6–§7.
Create only these additive files: src/lib/diagnostics/runtime/{session,draft,
events,result-adapter,scoring-adapter,founder-gravity.runtime,index}.ts and
scripts/verify-diagnostics-runtime.ts.
Constraints:
- Runtime HELPERS only. No migration, no route/UI/scoring change.
- Move Founder Gravity logic verbatim; preserve behavior exactly.
- Do NOT rewire the live FounderGravityAuditFlow/Report components.
- No React/fetch/routing inside src/lib/diagnostics/runtime/.
- Do not touch CRM, PostHog, n8n, or Metabase.
Validation: pnpm typecheck && pnpm lint && pnpm check:no-firebase &&
pnpm tsx scripts/verify-diagnostics-runtime.ts && pnpm build.
Definition of done: plan §13. Open as a draft PR.
```

---

*Phase 4B is helpers only. Rewiring the live flow (Gate 3), the unified
`diagnostic_leads` migration (4C), AI Readiness visible-result experience
(4D), and Revenue Leak runtime adaptation (4E) are separate, separately
approved steps. Types → helpers → database, not all at once.*
