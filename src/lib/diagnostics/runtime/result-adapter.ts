/**
 * Shared diagnostic runtime — result adapter (Phase 4B).
 *
 * The VALUE-level counterpart of the Phase 4A type-conformance proof:
 * re-keys a FounderGravityResult onto the generic DiagnosticResultDefinition
 * via the documented renames. It changes KEY NAMES ONLY — never a value — so
 * the rendered report is unaffected.
 *
 *   gravityLoad   -> primaryScore
 *   segment       -> classification
 *   layerScores   -> moduleScores
 *   topLayers     -> topModules
 *   highestLayer  -> highestModule
 *   topFragilityZone / strongestContradictionSignal / resonanceZone -> signals
 *
 * Pure; no side effects.
 */

import type { FounderGravityResult } from "../../founder-gravity-audit/types";
import type { DiagnosticResultDefinition } from "../types/result";

export function toDiagnosticResult(
  fg: FounderGravityResult,
): DiagnosticResultDefinition {
  return {
    primaryScore: fg.gravityLoad,
    classification: fg.segment,
    moduleScores: fg.layerScores,
    topModules: fg.topLayers,
    highestModule: fg.highestLayer,
    confidenceScore: fg.confidenceScore,
    completedQuestionCount: fg.completedQuestionCount,
    totalQuestionCount: fg.totalQuestionCount,
    suppression: fg.suppression,
    cta: fg.cta,
    signals: {
      topFragilityZone: fg.topFragilityZone,
      strongestContradictionSignal: fg.strongestContradictionSignal,
      resonanceZone: fg.resonanceZone,
    },
  };
}
