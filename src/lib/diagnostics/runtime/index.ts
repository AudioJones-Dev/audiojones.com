/**
 * Shared diagnostic runtime helpers (Phase 4B) — barrel.
 *
 * Generic, behavior-equivalent helpers extracted from Founder Gravity.
 * NOTE: these are NOT yet consumed by the live FounderGravityAuditFlow /
 * FounderGravityReport components — rewiring the live flow is a separate,
 * later-approved step (plan §8 / Gate 3). Importers today: the parity
 * verification script only.
 */

export { createDiagnosticSessionId } from "./session";
export { loadDraft, saveDraft, clearDraft } from "./draft";
export {
  createDiagnosticEvent,
  emitDiagnosticEvent,
  createEventRecorder,
} from "./events";
export type { DiagnosticEvent, DiagnosticEventEmitConfig } from "./events";
export { toDiagnosticResult } from "./result-adapter";
export { founderGravityScoringAdapter } from "./scoring-adapter";
export {
  founderGravityRuntimeConfig,
  FOUNDER_GRAVITY_EVENT_NAMES,
} from "./founder-gravity.runtime";
