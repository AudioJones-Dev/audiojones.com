import type { RecommendationState } from "./types";

export type RecommendationCopy = {
  state: RecommendationState;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

const DIAGNOSTIC_HREF = "/applied-intelligence/diagnostic";

export const RECOMMENDATION_COPY: Record<RecommendationState, RecommendationCopy> = {
  "Automate Now": {
    state: "Automate Now",
    description:
      "Your workflow shows strong ROI potential and enough operational readiness to justify implementation. The next best step is to scope a focused automation build with clear success metrics.",
    ctaLabel: "Book Your Diagnostic",
    ctaHref: DIAGNOSTIC_HREF,
  },
  "Pilot First": {
    state: "Pilot First",
    description:
      "The ROI opportunity is real, but your readiness score suggests you should begin with a controlled pilot before committing to a full implementation.",
    ctaLabel: "Plan a 30-Day Pilot",
    ctaHref: DIAGNOSTIC_HREF,
  },
  "Fix Operations First": {
    state: "Fix Operations First",
    description:
      "The financial upside is strong, but your operational foundation is not ready yet. AI may create more friction unless your SOPs, data, and workflow clarity are improved first.",
    ctaLabel: "Take the Signal Diagnostic",
    ctaHref: DIAGNOSTIC_HREF,
  },
  "Redesign Workflow First": {
    state: "Redesign Workflow First",
    description:
      "Your business is close, but the current workflow likely needs redesign before automation will produce reliable ROI.",
    ctaLabel: "Diagnose the Workflow",
    ctaHref: DIAGNOSTIC_HREF,
  },
  "Use Off-the-Shelf AI Tools": {
    state: "Use Off-the-Shelf AI Tools",
    description:
      "This workflow does not appear to justify a custom AI system yet. Start with lightweight off-the-shelf tools and revisit custom automation once volume or complexity increases.",
    ctaLabel: "Talk Through Your Stack",
    ctaHref: DIAGNOSTIC_HREF,
  },
  "Avoid Automation for Now": {
    state: "Avoid Automation for Now",
    description:
      "This does not look like a strong AI automation opportunity yet. Focus on business fundamentals, workflow clarity, and measurement before investing in AI.",
    ctaLabel: "Fix the System First",
    ctaHref: DIAGNOSTIC_HREF,
  },
};

export function getRecommendationCopy(
  state: RecommendationState,
): RecommendationCopy {
  return RECOMMENDATION_COPY[state];
}
