/**
 * Shared diagnostic runtime — runtime configuration contract (Phase 4A).
 *
 * Declares the flow/session/event/scoring knobs the Phase 4B runtime will
 * consume. 4A declares the interface only — there are NO function bodies
 * here. The scoring adapter is an interface the 4B extraction of Founder
 * Gravity's scoring must satisfy.
 *
 * Types only; no runtime behavior.
 * See docs/diagnostics/PHASE_4A_SHARED_RUNTIME_TYPES_PLAN.md §7.
 */

import type { DiagnosticResultDefinition } from "./result";

export type DiagnosticScoringAdapter = {
  /**
   * Pure scoring: answers -> result. Implemented in Phase 4B by extracting
   * Founder Gravity's `scoreFounderGravityAudit`. Declared here as an
   * interface only.
   */
  score(
    answers: Record<string, string>,
    opts: { durationSeconds?: number; consentToContact?: boolean },
  ): DiagnosticResultDefinition;
};

export type DiagnosticRuntimeConfig = {
  minAnswers: number;
  session: { idPrefix: string };
  draft: { storageKey: string };
  report: { storageKey: string };
  events: { prefix: string; names: readonly string[] };
  honeypotField: string;
  verification?: "none" | "recompute";
  scoringAdapter: DiagnosticScoringAdapter;
};
