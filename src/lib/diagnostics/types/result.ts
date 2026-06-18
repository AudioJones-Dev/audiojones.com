/**
 * Shared diagnostic runtime — result contracts (Phase 4A).
 *
 * Two distinct types, kept separate by design (approved):
 *   - DiagnosticResultDefinition: the shape of a *produced, scored result*
 *     (generalizes FounderGravityResult).
 *   - DiagnosticResultContract: the lighter *spec* a definition guarantees
 *     (which classifications it can emit; whether the user sees a result).
 *
 * Generalization of FounderGravityResult:
 *   - gravityLoad   -> primaryScore
 *   - segment       -> classification
 *   - layerScores   -> moduleScores
 *   - topLayers     -> topModules
 *   - highestLayer  -> highestModule
 *
 * Types only; no runtime behavior.
 * See docs/diagnostics/PHASE_4A_SHARED_RUNTIME_TYPES_PLAN.md §6.
 */

import type { DiagnosticModuleId } from "./module";
import type { DiagnosticCtaDefinition } from "./cta";

export type DiagnosticSuppression = {
  suppressed: boolean;
  reason:
    | "low_confidence_score"
    | "speedrun_completion"
    | "consent_withdrawn"
    | "internal_test_traffic"
    | "self_perception_noise"
    | string
    | null;
};

export type DiagnosticResultDefinition = {
  primaryScore: number;
  classification: string;
  moduleScores: Record<DiagnosticModuleId, number>;
  topModules: DiagnosticModuleId[];
  highestModule: DiagnosticModuleId;
  confidenceScore: number;
  completedQuestionCount: number;
  totalQuestionCount: number;
  suppression: DiagnosticSuppression;
  cta: DiagnosticCtaDefinition;
  /** Named qualitative signals (e.g. FG topFragilityZone, contradiction). */
  signals?: Record<string, string>;
  /** Diagnostic-specific derived values (e.g. ROI payback, FI sub-scores). */
  derived?: Record<string, number | string>;
};

export type DiagnosticResultContract = {
  /** Allowed classification labels this diagnostic can emit. */
  classifications: string[];
  /** Does the user see a result at all? (ROI/FG: true; FI today: false.) */
  emitsClientResult: boolean;
  /** Is a full report rendered? */
  emitsReport: boolean;
};
