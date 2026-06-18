/**
 * Type-only conformance assertions (Phase 4A).
 *
 * Proves the LIVE Founder Gravity types satisfy the shared diagnostic
 * contracts, modulo the documented field renames. This file contains NO
 * runtime code and NO value imports — only `import type` and compile-time
 * type assertions. If Founder Gravity drifts from the contracts, or a
 * contract changes incompatibly, `pnpm typecheck` fails HERE.
 *
 * Documented rename deltas (handled by the 4B runtime adapter):
 *   - question.layer        -> moduleId
 *   - option.layerScores    -> moduleScores
 *   - option.fragilityZone  -> signal
 *   - role "layer_item"     -> "item" (runtime value remap, not a shape change)
 *   - result.gravityLoad    -> primaryScore
 *   - result.segment        -> classification
 *   - result.layerScores    -> moduleScores
 *   - result.topLayers      -> topModules
 *   - result.highestLayer   -> highestModule
 *
 * See docs/diagnostics/PHASE_4A_SHARED_RUNTIME_TYPES_PLAN.md §8 (file 8).
 */

import type {
  FounderGravityQuestion,
  FounderGravityResponseOption,
  FounderGravityResult,
  FounderGravityCta,
} from "@/lib/founder-gravity-audit/types";
import type {
  DiagnosticOptionDefinition,
  DiagnosticQuestionDefinition,
} from "../question";
import type { DiagnosticResultDefinition } from "../result";
import type { DiagnosticCtaDefinition } from "../cta";

/** Compile-time assertion helper: errors unless `T` is exactly `true`. */
type Assert<T extends true> = T;

// 1. CTA conforms directly (no rename).
type CtaConforms = Assert<
  FounderGravityCta extends DiagnosticCtaDefinition ? true : false
>;

// 2. Option conforms via layerScores -> moduleScores, fragilityZone -> signal.
type FgOptionAdapted = Omit<
  FounderGravityResponseOption,
  "layerScores" | "fragilityZone"
> & {
  moduleScores?: FounderGravityResponseOption["layerScores"];
  signal?: FounderGravityResponseOption["fragilityZone"];
};
type OptionConforms = Assert<
  FgOptionAdapted extends DiagnosticOptionDefinition ? true : false
>;

// 3. Question conforms via layer -> moduleId (role value remap is a 4B
//    runtime concern; here we adapt the field SHAPE only).
type FgQuestionAdapted = Omit<
  FounderGravityQuestion,
  "layer" | "options" | "role"
> & {
  role: DiagnosticQuestionDefinition["role"];
  moduleId?: FounderGravityQuestion["layer"];
  options: DiagnosticOptionDefinition[];
};
type QuestionConforms = Assert<
  FgQuestionAdapted extends DiagnosticQuestionDefinition ? true : false
>;

// 4. Result conforms via the documented field renames.
type FgResultAdapted = Omit<
  FounderGravityResult,
  "gravityLoad" | "segment" | "layerScores" | "topLayers" | "highestLayer"
> & {
  primaryScore: FounderGravityResult["gravityLoad"];
  classification: FounderGravityResult["segment"];
  moduleScores: FounderGravityResult["layerScores"];
  topModules: FounderGravityResult["topLayers"];
  highestModule: FounderGravityResult["highestLayer"];
};
type ResultConforms = Assert<
  FgResultAdapted extends DiagnosticResultDefinition ? true : false
>;

/**
 * Surfaces the assertions so they are referenced (and so any future
 * regression is reported as a typecheck error on this exported type).
 */
export type FounderGravityContractConformance = {
  cta: CtaConforms;
  option: OptionConforms;
  question: QuestionConforms;
  result: ResultConforms;
};
