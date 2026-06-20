/**
 * Shared diagnostic runtime — CTA contract (Phase 4A).
 *
 * Generalizes FounderGravityCta unchanged. Types only.
 *
 * See docs/diagnostics/PHASE_4A_SHARED_RUNTIME_TYPES_PLAN.md §2.
 */

export type DiagnosticCtaDefinition = {
  label: string;
  event: string;
  href: string;
  pathway: string;
};
