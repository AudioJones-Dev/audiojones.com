---
title: "Phase 4A — Shared Diagnostic Runtime Types + Definitions Plan"
status: plan (documentation only — no code)
version: v1.0
date: 2026-06-18
owner: AJ Digital LLC
approver: Audio — approves Phase 4A plan only; no implementation yet
scope: documentation only — no code, no migrations, no API/UI/scoring changes
phase: 4A (types + definitions) of the approved 4A→4E sequence
source-of-truth: docs/strategy/PHASE_3C_FOUNDER_GRAVITY_SHARED_ENGINE_PARITY_REPORT.md
---

# Phase 4A — Shared Diagnostic Runtime Types + Definitions Plan

> **What this is.** A documentation-only implementation plan for **Phase
> 4A**: introduce the *type-level* contracts for a shared diagnostic runtime
> — and nothing else. No runtime, no migration, no API/UI/scoring changes.
> **Types first, runtime second (4B), database third (4C).**

> ⚠️ **Source-document note (no assumptions).** The task referenced seven
> `docs/diagnostics/*` documents
> (`FOUNDER_INTELLIGENCE_ASSESSMENT_ENGINE_ARCHITECTURE.md`,
> `…_ONTOLOGY.md`, `…_SHARED_SCHEMA.md`, `…_SCORING_CONTRACTS.md`,
> `FOUNDER_GRAVITY_SHARED_ENGINE_MIGRATION_PLAN.md`,
> `…_ADAPTER_EXTRACTION_PLAN.md`, `…_RUNTIME_WIRING_PLAN.md`). **None of
> these exist in the repository** (the `docs/diagnostics/` directory did not
> exist before this file). This plan is therefore grounded in the two
> sources that *do* exist: the merged **Phase 3C parity report** and the
> **live Founder Gravity engine source** (`src/lib/founder-gravity-audit/*`).
> If those seven documents exist elsewhere, reconcile this plan against them
> before implementation — but nothing here depends on them, since the
> authoritative substance is the Founder Gravity types already in the repo.

---

## 1. Current shared types inventory

**There are no shared diagnostic types today.** A repo-wide search for
`DiagnosticDefinition | DiagnosticModule | DiagnosticQuestion |
DiagnosticResult | DiagnosticRuntime` returns **zero matches** — this is
greenfield.

Existing `src/types/` holds only unrelated domain types: `admin.ts`,
`capacity.ts`, `incidents.ts`, `env.d.ts`, `firebase-shim.d.ts`.

Each diagnostic owns its own private types (no sharing):

| Diagnostic | Types module | Key exported types |
|---|---|---|
| Founder Gravity | `src/lib/founder-gravity-audit/types.ts` | `FounderGravityQuestion`, `FounderGravityResponseOption`, `FounderGravityResult`, `FounderGravityLeadInput`, `GravityLayerId`, `FounderGravitySegment`, `FounderGravityCta`, `FounderGravityAttribution` |
| ROI / Revenue Leak | `src/lib/roi-calculator/types.ts` | `RoiCalculatorInput`, `RoiCalculatorResult`, `RoiConfidenceTier`, `RoiRecommendation` |
| FI Diagnostic / AI Readiness | `src/lib/leads/lead-schema.ts`, `src/lib/leads/lead-scoring.ts` | `FounderIntelligenceLeadInput`, `LeadScores`, `LeadPriority` |

**Implication:** Phase 4A introduces a **new, additive** type surface under
`src/lib/diagnostics/types/`. It does **not** modify any of the three
existing type modules. The existing engines keep their concrete types
untouched; the new contracts are a layer the engines can be proven
*assignable to* (conformance) without being rewired (that is 4B).

---

## 2. Founder Gravity reusable definition surface

The contracts below are a direct generalization of these **real** Founder
Gravity types (`src/lib/founder-gravity-audit/types.ts`). Each generic
contract names the FG type it abstracts so the mapping is auditable.

| Founder Gravity (concrete) | Generalizes to (Phase 4A contract) | Generalization move |
|---|---|---|
| `GravityLayerId` (6 string union) | `DiagnosticModuleDefinition.id` | layer → **module** (a scored dimension); union → data-driven id |
| `FounderGravityQuestion` | `DiagnosticQuestionDefinition` | `layer?` → `moduleId?`; keep `role`/`stage`/`weight`/`options` |
| `FounderGravityResponseOption` | `DiagnosticOptionDefinition` | `layerScores?` → `moduleScores?`; `fragilityZone?` → generic `tags?`/`signal?` |
| `FounderGravityResult` | `DiagnosticResultDefinition` | `gravityLoad` → `primaryScore`; `segment` → `classification`; `layerScores` → `moduleScores`; keep `confidence`/`suppression`/`cta` |
| `FounderGravitySegment` (5 union) | `DiagnosticResultDefinition["classification"]` | named segment → generic classification label (+ optional enum per definition) |
| `FounderGravityCta` | `DiagnosticCtaDefinition` | unchanged shape (`label`/`event`/`href`/`pathway`) |
| `FounderGravityLeadInput` | `DiagnosticLeadInput` | `displayName`/`entityName` → generic identity fields; keep `answers`/`attribution`/`events`/honeypot |
| `FounderGravityAttribution` | `DiagnosticAttribution` | unchanged shape |
| flow + session/draft/events (in `FounderGravityAuditFlow.tsx`) | `DiagnosticRuntimeConfig` | promote flow knobs to config (4B consumes; 4A only declares) |

**Reusability already confirmed by Phase 3C:** the parity report measured
the shared engine as **~60% pre-built inside Founder Gravity**. Phase 4A
captures that 60% as *types* without touching the running code.

---

## 3. Proposed `DiagnosticDefinition` contract

> The top-level, data-driven description of one diagnostic. Pure type; no
> behavior.

```ts
// src/lib/diagnostics/types/definition.ts  (PLANNED — not created in this PR)
export type DiagnosticId = string; // e.g. "founder-gravity" | "ai-readiness" | "revenue-leak"

export type DiagnosticDefinition = {
  id: DiagnosticId;
  version: string;                       // semantic version of the definition
  title: string;
  description?: string;
  modules: DiagnosticModuleDefinition[]; // §4 — the scored dimensions
  questions: DiagnosticQuestionDefinition[]; // §5 — the content model
  result: DiagnosticResultContract;      // §6 — the OUTPUT shape this diagnostic emits
  runtime: DiagnosticRuntimeConfig;      // §7 — flow/session/event knobs (declared only)
  ctas: Record<string, DiagnosticCtaDefinition>; // classification -> CTA
  meta?: Record<string, unknown>;        // GTM/asset metadata (asset_type, gtm_motion, …)
};
```

Notes:
- `result` here is the **contract/spec** (`DiagnosticResultContract`),
  distinct from a produced result instance (`DiagnosticResultDefinition`,
  §6). Naming kept explicit to avoid the FG conflation the M.A.P. report
  warned about.
- No functions on the definition in 4A. Scoring *functions* (the
  `compute`/`classify` callables in the Phase 3C sketch) are deferred to
  **4B**, where the runtime is extracted. 4A declares only the **interfaces**
  those functions will satisfy (see §7 `scoringAdapter`).

---

## 4. Proposed `DiagnosticModuleDefinition` contract

> A "module" is a scored dimension/category — the generalization of a
> Founder Gravity **layer** (decision/approval/…), an ROI **lever**
> (manual-labor/revenue/…), or an FI **component** (icpFit/signal/…).

```ts
// src/lib/diagnostics/types/module.ts  (PLANNED)
export type DiagnosticModuleId = string;

export type DiagnosticModuleDefinition = {
  id: DiagnosticModuleId;       // was GravityLayerId
  label: string;                // human label (FG GRAVITY_LAYERS[id])
  description?: string;
  weight?: number;              // optional module-level weight in fusion
  order?: number;               // display order in report
};
```

This is the single change that unlocks reuse: FG hardcodes a 6-member
`GravityLayerId` union; the contract makes the dimension set **data**, so a
diagnostic with 5 levers or 4 components is expressible without new types.

---

## 5. Proposed `DiagnosticQuestionDefinition` contract

> Generalizes `FounderGravityQuestion` + `FounderGravityResponseOption`.

```ts
// src/lib/diagnostics/types/question.ts  (PLANNED)
export type DiagnosticQuestionRole =
  | "firmographic" | "self_perception" | "item" | "scenario"; // FG "layer_item" -> "item"

export type DiagnosticOptionDefinition = {
  value: string;
  label: string;
  score?: number;                                   // was option.score
  moduleScores?: Partial<Record<DiagnosticModuleId, number>>; // was layerScores
  signal?: string;                                  // was fragilityZone (generalized)
  tags?: string[];
};

export type DiagnosticQuestionDefinition = {
  id: string;
  code: string;
  role: DiagnosticQuestionRole;
  stage?: string;            // FG stages become free-form per definition
  prompt: string;
  moduleId?: DiagnosticModuleId;  // was question.layer
  weight?: number;
  options: DiagnosticOptionDefinition[];
};
```

Backwards-compatibility check (informs the §10 conformance test): every
field on `FounderGravityQuestion`/`FounderGravityResponseOption` maps onto a
field here with the same runtime meaning, so FG's `FOUNDER_GRAVITY_QUESTIONS`
array is **structurally assignable** to `DiagnosticQuestionDefinition[]`
(modulo the `layer`→`moduleId` and `layerScores`→`moduleScores` renames,
which the conformance test documents as the only deltas).

---

## 6. Proposed `DiagnosticResultDefinition` contract

> The shape of a **produced, scored result** — generalizes
> `FounderGravityResult`. (`DiagnosticResultContract`, referenced by §3, is
> the lighter spec that declares which of these fields a diagnostic
> guarantees.)

```ts
// src/lib/diagnostics/types/result.ts  (PLANNED)
export type DiagnosticSuppression = {
  suppressed: boolean;
  reason:
    | "low_confidence_score" | "speedrun_completion" | "consent_withdrawn"
    | "internal_test_traffic" | "self_perception_noise" | string | null;
};

export type DiagnosticResultDefinition = {
  primaryScore: number;                 // was gravityLoad
  classification: string;               // was segment (FG union allowed via generic param)
  moduleScores: Record<DiagnosticModuleId, number>; // was layerScores
  topModules: DiagnosticModuleId[];     // was topLayers
  highestModule: DiagnosticModuleId;    // was highestLayer
  confidenceScore: number;
  completedQuestionCount: number;
  totalQuestionCount: number;
  suppression: DiagnosticSuppression;
  cta: DiagnosticCtaDefinition;
  signals?: Record<string, string>;     // FG topFragilityZone / strongestContradictionSignal
  derived?: Record<string, number | string>; // ROI payback/readiness, FI sub-scores
};

export type DiagnosticResultContract = {
  classifications: string[];            // allowed classification labels
  emitsClientResult: boolean;           // does the user see a result? (ROI/FG yes, FI no today)
  emitsReport: boolean;                 // is a full report rendered?
};
```

This is where the Phase 3C parity gaps become *typed*: `emitsClientResult`
makes "the user sees something" a first-class, non-optional property of a
definition — the exact gap FI/AI-Readiness has today.

---

## 7. Proposed `DiagnosticRuntimeConfig` contract

> Declares the flow/session/event/scoring knobs the 4B runtime will consume.
> **4A only declares the interface; 4B implements the runtime.**

```ts
// src/lib/diagnostics/types/runtime-config.ts  (PLANNED)
export type DiagnosticRuntimeConfig = {
  minAnswers: number;                 // FG = 12
  session: { idPrefix: string };      // FG "fga-"
  draft: { storageKey: string };      // FG "audiojones:fga:draft"
  report: { storageKey: string };     // FG "audiojones:fga:last-report"
  events: { prefix: string; names: readonly string[] }; // FG "fga", 7 names
  honeypotField: string;              // FG/FI "website_url", ROI "hp" -> standardize
  verification?: "none" | "recompute"; // ROI = "recompute"
  // Interface only — the callable extracted in 4B must satisfy this:
  scoringAdapter: DiagnosticScoringAdapter;
};

// Declared in 4A, implemented in 4B. No function bodies in 4A.
export type DiagnosticScoringAdapter = {
  /** Pure scoring: answers -> result. Implemented by extracting FG's
   *  scoreFounderGravityAudit in Phase 4B. */
  score(
    answers: Record<string, string>,
    opts: { durationSeconds?: number; consentToContact?: boolean },
  ): DiagnosticResultDefinition;
};
```

`scoringAdapter` is an **interface**, not an implementation — its presence
in 4A lets `DiagnosticDefinition` be fully typed while the actual extraction
of Founder Gravity's scoring happens in 4B without re-opening 4A's contracts.

---

## 8. File-by-file implementation plan (for the 4A code PR — not this PR)

> This plan PR is docs-only. The **subsequent 4A implementation PR** will add
> only the following — all additive, no edits to existing engine code:

| # | File | Contents | Touches existing code? |
|---|---|---|---|
| 1 | `src/lib/diagnostics/types/module.ts` | `DiagnosticModuleId`, `DiagnosticModuleDefinition` | No |
| 2 | `src/lib/diagnostics/types/question.ts` | roles, `DiagnosticOptionDefinition`, `DiagnosticQuestionDefinition` | No |
| 3 | `src/lib/diagnostics/types/result.ts` | suppression, `DiagnosticResultDefinition`, `DiagnosticResultContract` | No |
| 4 | `src/lib/diagnostics/types/cta.ts` | `DiagnosticCtaDefinition` (from `FounderGravityCta`) | No |
| 5 | `src/lib/diagnostics/types/runtime-config.ts` | `DiagnosticRuntimeConfig`, `DiagnosticScoringAdapter` | No |
| 6 | `src/lib/diagnostics/types/definition.ts` | `DiagnosticId`, `DiagnosticLeadInput`, `DiagnosticAttribution`, `DiagnosticDefinition` | No |
| 7 | `src/lib/diagnostics/types/index.ts` | barrel re-export of all contracts | No |
| 8 | `src/lib/diagnostics/types/__conformance__/founder-gravity.contract.ts` | **type-only** assignability assertions proving FG's real types satisfy the contracts (imports FG types read-only; no runtime code) | Reads FG types; modifies nothing |

- **No barrel is imported by app/engine code in 4A** — the types are inert
  until 4B consumes them. This guarantees zero behavior change.
- File 8 is the validation artifact (see §10/§14): it makes `pnpm typecheck`
  fail if a contract drifts from the real Founder Gravity shape.

---

## 9. Explicit non-goals

Phase 4A will **not**:
- Create or alter any **database migration** or table (that is 4C).
- Replace or wire any **runtime** / flow / hook (that is 4B).
- Change any **API route** (`/api/founder-gravity-audit/leads`, etc.).
- Change any **UI**, page, or component.
- Change any **scoring** logic, weights, thresholds, or suppression rules.
- Modify the existing engine type modules (`founder-gravity-audit/types.ts`,
  `roi-calculator/types.ts`, `leads/*`).
- Touch **CRM, PostHog, n8n, or Metabase** integrations.
- Alter Founder Gravity behavior in any observable way.
- Introduce the unified `diagnostic_leads` model (that is 4C).

---

## 10. Validation commands

For the 4A implementation PR (this docs PR needs none beyond markdown
review):

```bash
pnpm typecheck        # MUST pass — incl. the §8 file-8 conformance assertions
pnpm lint             # 0 errors
pnpm check:no-firebase
pnpm build            # must still succeed; types are inert so build is unaffected
```

Conformance expectation: with file 8 present, `pnpm typecheck` is the proof
that the new contracts model the **real** Founder Gravity engine. If FG's
types and the contracts disagree, typecheck fails — exactly the guardrail we
want before any runtime extraction in 4B.

---

## 11. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Contracts drift from the real FG engine | Medium | §8 file-8 type-conformance assertions fail `typecheck` on drift |
| Over-generalization (contracts too loose to be useful) | Medium | Keep contracts grounded 1:1 in FG fields (§2 mapping table); avoid speculative fields |
| Premature scoring abstraction | Medium | 4A declares `DiagnosticScoringAdapter` as an **interface only**; no extraction until 4B |
| Naming collision / result-vs-spec confusion | Low | Explicit `DiagnosticResultDefinition` (instance) vs `DiagnosticResultContract` (spec) split |
| Honeypot field divergence (`website_url` vs `hp`) | Low | Declared as a config field now; standardized later in 4B/4C, not forced in 4A |
| Reviewer assumes types change behavior | Low | §9 non-goals + "types are inert / unimported" note; build proves no behavior change |
| Missing referenced `docs/diagnostics/*` sources contain conflicting decisions | Medium | Flagged at top; plan grounded in live code; reconcile before 4A implementation if those docs surface |

---

## 12. Rollback plan

- **This plan PR**: docs-only; revert = delete the file / `git revert`.
- **The 4A implementation PR**: all files are **new and unimported**, so
  rollback = delete `src/lib/diagnostics/types/` and revert the one commit.
  Because nothing imports the types, removal cannot break app, API, build,
  or runtime. Zero data risk (no DB involved).

---

## 13. Human approval gates

- **Gate 1 (now):** Audio approves *this* Phase 4A plan. No code yet.
- **Gate 2:** Audio approves the 4A **implementation PR** (the type files +
  conformance test) before merge.
- **Gate 3:** Audio explicitly authorizes **Phase 4B** (runtime extraction)
  — 4A does not imply 4B. Each phase is its own approved PR.
- No migration is proposed or approved until **Phase 4C**, after the runtime
  contract has stabilized through 4B.

---

## 14. Definition of done (for the 4A implementation PR)

1. The seven type files (§8 files 1–7) exist under
   `src/lib/diagnostics/types/`, additive only.
2. The §8 file-8 conformance assertion compiles, proving Founder Gravity's
   real `FOUNDER_GRAVITY_QUESTIONS` and `FounderGravityResult` are
   assignable to `DiagnosticQuestionDefinition[]` / `DiagnosticResultDefinition`
   (with the documented `layer→moduleId` / `layerScores→moduleScores`
   adapter deltas).
3. `pnpm typecheck && pnpm lint && pnpm check:no-firebase && pnpm build` all
   pass.
4. No existing file is modified; no route/UI/scoring/migration touched
   (verified by `git diff --stat` showing only new files under
   `src/lib/diagnostics/types/`).
5. Founder Gravity behavior is unchanged (types are unimported by runtime).

---

## 15. Next implementation prompt

> Use after Audio approves this plan (Gate 1).

```
Review/Diagnosis owner: Claude
Actionable AI Assistant Task owner: Claude
Execution location/tool: audiojones.com repository
Human/operator role: Audio approves the Phase 4A implementation PR before merge
Task:
Implement Phase 4A — Shared Diagnostic Runtime Types + Definitions, exactly
as scoped in docs/diagnostics/PHASE_4A_SHARED_RUNTIME_TYPES_PLAN.md §8.
Create only these additive, unimported type files under
src/lib/diagnostics/types/: module.ts, question.ts, result.ts, cta.ts,
runtime-config.ts, definition.ts, index.ts, and the
__conformance__/founder-gravity.contract.ts type-only assertion.
Constraints:
- Types/definitions only. No runtime, no migration, no API/UI/scoring change.
- Do not modify any existing engine type module or any other file.
- Do not import the new types from any app/engine/runtime code.
- Preserve Founder Gravity behavior; types must be inert.
- Do not touch CRM, PostHog, n8n, or Metabase.
Validation: pnpm typecheck && pnpm lint && pnpm check:no-firebase && pnpm build.
Definition of done: plan §14. Open as a draft PR.
```

---

*Phase 4A is types only. Runtime extraction (4B), the unified
`diagnostic_leads` migration (4C), AI Readiness visible-result experience
(4D), and Revenue Leak runtime adaptation (4E) are separate, separately
approved phases. Types first, runtime second, database third.*
