/**
 * Shared diagnostic runtime — Founder Gravity scoring adapter (Phase 4B).
 *
 * Thin implementation of the Phase 4A `DiagnosticScoringAdapter` interface.
 * It calls the unchanged, pure `scoreFounderGravityAudit` and re-keys the
 * output through the result adapter. The scoring MATH is untouched.
 *
 * Pure; no side effects.
 */

import { scoreFounderGravityAudit } from "../../founder-gravity-audit/scoring";
import type { DiagnosticScoringAdapter } from "../types/runtime-config";
import { toDiagnosticResult } from "./result-adapter";

export const founderGravityScoringAdapter: DiagnosticScoringAdapter = {
  score(answers, opts) {
    return toDiagnosticResult(scoreFounderGravityAudit(answers, opts));
  },
};
