/**
 * Case study registry.
 *
 * Source of truth for both the /case-studies index card grid and the
 * individual /case-studies/[slug] pages. The `published` flag controls
 * whether a study renders on the index; unpublished entries stay here so
 * draft content remains version-controlled without leaking to the site.
 */

export type CaseStudyMetric = {
  /** Display value, e.g. "↓37%" or "4 min". */
  value: string;
  /** Short label, e.g. "Customer Acquisition Cost". */
  label: string;
  /** Context tag, e.g. "over 14 months". */
  context: string;
};

export type CaseStudy = {
  slug: string;
  published: boolean;
  industry: string;
  engagement: string;
  duration: string;
  headline: string;
  /** One-sentence summary for index cards and metadata. */
  summary: string;
  problem: {
    body: string;
    symptoms: readonly string[];
  };
  diagnostic: {
    body: string;
    findings: readonly string[];
  };
  solution: {
    body: string;
    bullets: readonly string[];
  };
  results: readonly CaseStudyMetric[];
  methodologyNote: string;
};

export const caseStudyRegistry: readonly CaseStudy[] = [
  {
    slug: "scattered-activity-to-signal-system",
    published: true,
    industry: "Professional Services",
    engagement: "Applied Intelligence Engagement",
    duration: "14-month engagement",
    headline: "From scattered activity to a compounding signal system",
    summary:
      "A founder-led B2B services firm couldn't tell which activity created pipeline. The Signal Audit replaced activity with attribution and cut CAC by 37%.",
    problem: {
      body:
        "The business was generating consistent lead volume but couldn't identify which channels, messages, or follow-up sequences were creating qualified pipeline. Every activity looked equally important. Scaling spend only amplified the noise. CAC was climbing with no clear lever to pull.",
      symptoms: [
        "Lead volume rising while close rate flattened",
        "Marketing and sales disagreed on which channels were working",
        "Activity dashboards were full; revenue causality was not",
      ],
    },
    diagnostic: {
      body:
        "The Signal Audit separated activity that correlated with closed revenue from activity that only correlated with itself. Two findings reframed the entire growth model.",
      findings: [
        "73% of marketing spend was creating activity with no pipeline correlation",
        "Lead response latency averaging 4.2 hours was the primary conversion killer — not messaging or offer quality",
        "One channel (referral + follow-up sequence) was generating 68% of closed revenue while receiving 12% of total attention",
      ],
    },
    solution: {
      body:
        "We installed a signal-first operating layer: every input is mapped to a revenue outcome, response is automated, and the operating cadence is reviewed monthly against the signal map rather than weekly activity reports.",
      bullets: [
        "Signal attribution layer mapping every input to revenue outcomes",
        "ResponseOS deployment: automated lead response under 4 minutes",
        "Monthly signal review cadence replacing weekly activity reporting",
        "CAC attribution model tied to actual closed revenue, not leads",
      ],
    },
    results: [
      {
        value: "↓37%",
        label: "Customer Acquisition Cost",
        context: "over 14 months",
      },
      {
        value: "↑28%",
        label: "Qualified Pipeline",
        context: "same period",
      },
      {
        value: "↑42%",
        label: "Lead-to-Meeting Conversion",
        context: "post ResponseOS deployment",
      },
      {
        value: "4 min",
        label: "Average Lead Response Time",
        context: "down from 4.2 hours",
      },
      {
        value: "1",
        label: "Signal Map",
        context: "governing all growth decisions",
      },
    ],
    methodologyNote:
      "Client name withheld by mutual agreement. Industry vertical and engagement metrics are accurate. Numbers from in-flight engagements — publication consent pending.",
  },
];

export const publishedCaseStudies = caseStudyRegistry.filter((c) => c.published);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudyRegistry.find((c) => c.slug === slug);
}
