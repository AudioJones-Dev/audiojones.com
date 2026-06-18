/**
 * Shared diagnostic runtime — question/content contract (Phase 4A).
 *
 * Generalizes FounderGravityQuestion + FounderGravityResponseOption:
 *   - question.layer        -> moduleId
 *   - option.layerScores    -> moduleScores
 *   - option.fragilityZone  -> signal
 *   - role "layer_item"     -> "item" (value remap performed by the 4B runtime)
 *
 * Types only; no runtime behavior.
 * See docs/diagnostics/PHASE_4A_SHARED_RUNTIME_TYPES_PLAN.md §5.
 */

import type { DiagnosticModuleId } from "./module";

export type DiagnosticQuestionRole =
  | "firmographic"
  | "self_perception"
  | "item"
  | "scenario";

export type DiagnosticOptionDefinition = {
  value: string;
  label: string;
  score?: number;
  moduleScores?: Partial<Record<DiagnosticModuleId, number>>;
  signal?: string;
  tags?: string[];
};

export type DiagnosticQuestionDefinition = {
  id: string;
  code: string;
  role: DiagnosticQuestionRole;
  stage?: string;
  prompt: string;
  moduleId?: DiagnosticModuleId;
  weight?: number;
  options: DiagnosticOptionDefinition[];
};
