/**
 * Shared diagnostic runtime — Founder Gravity runtime config (Phase 4B).
 *
 * A `DiagnosticRuntimeConfig` instance that captures Founder Gravity's
 * concrete runtime constants (storage keys, session prefix, min answers,
 * honeypot field, event names) and binds its scoring adapter. This is the
 * data the Phase 4B helpers consume; it does NOT rewire the live component
 * (that is a separate, later-approved step — plan §8 / Gate 3).
 *
 * Values are lifted verbatim from FounderGravityAuditFlow.tsx.
 */

import type { DiagnosticRuntimeConfig } from "../types/runtime-config";
import { founderGravityScoringAdapter } from "./scoring-adapter";

export const FOUNDER_GRAVITY_EVENT_NAMES = [
  "diagnostic_started",
  "diagnostic_saved",
  "question_skipped",
  "diagnostic_completed",
  "preview_viewed",
  "email_gate_submitted",
  "report_viewed",
  "cta_clicked",
] as const;

export const founderGravityRuntimeConfig: DiagnosticRuntimeConfig = {
  minAnswers: 12,
  session: { idPrefix: "fga" },
  draft: { storageKey: "audiojones:fga:draft" },
  report: { storageKey: "audiojones:fga:last-report" },
  events: { prefix: "fga", names: FOUNDER_GRAVITY_EVENT_NAMES },
  honeypotField: "website_url",
  verification: "none",
  scoringAdapter: founderGravityScoringAdapter,
};
