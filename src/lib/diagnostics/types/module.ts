/**
 * Shared diagnostic runtime — module contract (Phase 4A).
 *
 * A "module" is a scored dimension/category. It generalizes a Founder
 * Gravity *layer* (decision/approval/…), an ROI *lever*, or an FI
 * *component*. Types only; no runtime behavior.
 *
 * See docs/diagnostics/PHASE_4A_SHARED_RUNTIME_TYPES_PLAN.md §4.
 */

export type DiagnosticModuleId = string;

export type DiagnosticModuleDefinition = {
  id: DiagnosticModuleId;
  label: string;
  description?: string;
  weight?: number;
  order?: number;
};
