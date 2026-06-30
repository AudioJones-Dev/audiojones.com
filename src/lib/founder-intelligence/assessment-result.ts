import type { LeadPriority, LeadScores } from "@/lib/leads/lead-scoring";

export const FOUNDER_INTELLIGENCE_ASSESSMENT_RESULT_KEY =
  "audiojones:fia:last-result";

export type FounderIntelligenceAssessmentResult = {
  leadId: string;
  submittedAt: string;
  scores: LeadScores;
  founder: {
    firstName?: string;
    companyName?: string;
  };
  context: {
    sourcePage: string;
    annualRevenueRange?: string;
    primaryConstraint?: string;
    timeline?: string;
  };
};

export type FounderIntelligenceRecommendation = {
  label: string;
  href: string;
  summary: string;
  rationale: string;
};

export const founderIntelligenceRecommendations: Record<
  LeadPriority,
  FounderIntelligenceRecommendation
> = {
  urgent: {
    label: "Book a diagnostic review",
    href: "/book-a-call?source=founder-intelligence-assessment&priority=urgent",
    summary: "High-fit signal with enough urgency to justify a direct review.",
    rationale:
      "The assessment indicates a near-term operating or revenue constraint. The next useful move is a strategic diagnostic conversation, not more unguided content.",
  },
  high: {
    label: "Book a diagnostic review",
    href: "/book-a-call?source=founder-intelligence-assessment&priority=high",
    summary: "Strong fit for a focused Founder Intelligence review.",
    rationale:
      "Your answers show enough signal, attribution, and implementation context to make a diagnostic review useful.",
  },
  medium: {
    label: "Start the Founder Revenue Leak Diagnostic",
    href: "/diagnostics/founder-revenue-leak-diagnostic?source=founder-intelligence-assessment&priority=medium",
    summary: "There is useful signal, but the revenue leak needs sharper isolation.",
    rationale:
      "Before booking, the next step is to identify where the leak is concentrated: intake, follow-up, CRM memory, attribution, or executive visibility.",
  },
  low: {
    label: "Read the Founder Intelligence Systems framework",
    href: "/frameworks/founder-intelligence-systems?source=founder-intelligence-assessment&priority=low",
    summary: "The pattern is not ready for a direct diagnostic handoff yet.",
    rationale:
      "Start with the framework so the operating language is clear before choosing a paid diagnostic or system build.",
  },
};

