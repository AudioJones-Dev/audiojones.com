import type { DiagnosticResult, RecommendationState } from "./types";

export const RECOMMENDATIONS: Record<RecommendationState, { title: string; summary: string; nextStep: string }> = {
  "automate-now": {
    title: "Automate Now",
    summary: "The economics and operating foundation are both strong enough to justify a focused automation build.",
    nextStep: "Prioritize the highest-friction workflow and scope the first production system.",
  },
  "pilot-first": {
    title: "Pilot First",
    summary: "There is meaningful upside, but a narrow pilot will de-risk adoption and implementation before a larger rollout.",
    nextStep: "Run a contained pilot with success metrics, QA rules, and a clear owner.",
  },
  "fix-foundation": {
    title: "Fix the Foundation",
    summary: "The workflow has automation potential, but SOPs, data quality, or process clarity could turn AI into expensive noise.",
    nextStep: "Document the workflow, clean the inputs, and define the measurement system before automating.",
  },
  "measure-first": {
    title: "Measure First",
    summary: "The opportunity needs cleaner measurement before the ROI case is strong enough for confident investment.",
    nextStep: "Instrument volume, cycle time, errors, and owner accountability for 30 days.",
  },
  "take-signal-diagnostic": {
    title: "Take the Signal Diagnostic",
    summary: "The scores suggest the bigger question is where AI belongs in the operating system, not which tool to buy.",
    nextStep: "Use the Signal Diagnostic to separate causal leverage from automation theater.",
  },
  "not-yet": {
    title: "Not Yet",
    summary: "The likely near-term return is limited. Fix the workflow constraints first, then revisit automation.",
    nextStep: "Reduce handoffs and clarify the process before investing in AI implementation.",
  },
};

export function getRecommendation(result: Pick<DiagnosticResult, "recommendation">) {
  return RECOMMENDATIONS[result.recommendation];
}
