/**
 * Shared diagnostic runtime — top-level definition contract (Phase 4A).
 *
 * `DiagnosticDefinition` is the data-driven description of one diagnostic.
 * Pure type; no behavior. Scoring *functions* are deferred to Phase 4B
 * (declared as `DiagnosticScoringAdapter` in runtime-config).
 *
 * `result` here is the lighter *contract* (DiagnosticResultContract),
 * distinct from a produced result instance (DiagnosticResultDefinition).
 *
 * Types only; no runtime behavior.
 * See docs/diagnostics/PHASE_4A_SHARED_RUNTIME_TYPES_PLAN.md §3.
 */

import type { DiagnosticModuleDefinition } from "./module";
import type { DiagnosticQuestionDefinition } from "./question";
import type { DiagnosticResultContract } from "./result";
import type { DiagnosticRuntimeConfig } from "./runtime-config";
import type { DiagnosticCtaDefinition } from "./cta";

export type DiagnosticId = string;

export type DiagnosticAttribution = {
  acquisitionChannel?: string;
  sourcePage?: string;
  referrer?: string;
  landingPath?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

export type DiagnosticLeadInput = {
  email: string;
  consentToContact: boolean;
  sessionId: string;
  answers: Record<string, string>;
  /** Generic identity fields, e.g. { displayName, entityName }. */
  identity?: Record<string, string>;
  durationSeconds?: number;
  attribution?: DiagnosticAttribution;
  events?: Array<{
    event: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }>;
  /** Honeypot value (field name configured per diagnostic). */
  honeypot?: string;
};

export type DiagnosticDefinition = {
  id: DiagnosticId;
  version: string;
  title: string;
  description?: string;
  modules: DiagnosticModuleDefinition[];
  questions: DiagnosticQuestionDefinition[];
  result: DiagnosticResultContract;
  runtime: DiagnosticRuntimeConfig;
  /** classification label -> CTA. */
  ctas: Record<string, DiagnosticCtaDefinition>;
  /** GTM/asset metadata (asset_type, gtm_motion, …). */
  meta?: Record<string, unknown>;
};
