/**
 * Shared diagnostic runtime — type contracts barrel (Phase 4A).
 *
 * Re-exports the Phase 4A type contracts. These types are intentionally
 * INERT: nothing in app/engine/runtime code imports them yet. Runtime
 * consumption begins in Phase 4B.
 */

export type {
  DiagnosticModuleId,
  DiagnosticModuleDefinition,
} from "./module";
export type { DiagnosticCtaDefinition } from "./cta";
export type {
  DiagnosticQuestionRole,
  DiagnosticOptionDefinition,
  DiagnosticQuestionDefinition,
} from "./question";
export type {
  DiagnosticSuppression,
  DiagnosticResultDefinition,
  DiagnosticResultContract,
} from "./result";
export type {
  DiagnosticScoringAdapter,
  DiagnosticRuntimeConfig,
} from "./runtime-config";
export type {
  DiagnosticId,
  DiagnosticAttribution,
  DiagnosticLeadInput,
  DiagnosticDefinition,
} from "./definition";
