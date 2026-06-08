export type FrameworkSummary = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
};

export const FRAMEWORKS: FrameworkSummary[] = [
  {
    slug: "founder-intelligence-systems",
    title: "Founder Intelligence Systems",
    shortTitle: "AIS",
    tagline: "The category — business OS for the AI era.",
    description:
      "A seven-layer operating model that combines human judgment, data signals, AI tools, attribution, and feedback loops to improve decisions and execution.",
  },
  {
    slug: "map-attribution",
    title: "M.A.P Attribution Framework",
    shortTitle: "M.A.P",
    tagline: "Meaningful. Actionable. Profitable.",
    description:
      "A filter that decides whether a metric earns the right to drive business strategy — before it gets a budget line or a dashboard tile.",
  },
  {
    slug: "niche-framework",
    title: "N.I.C.H.E Framework",
    shortTitle: "N.I.C.H.E",
    tagline: "Position around the highest-signal market.",
    description:
      "A positioning system for identifying high-signal markets and engineering business engines around causal clarity, human leverage, and Founder Intelligence System.",
  },
  {
    slug: "signal-vs-noise",
    title: "Signal vs Noise",
    shortTitle: "Signal vs Noise",
    tagline: "The philosophical anchor.",
    description:
      "Signal is causal information that improves judgment. Noise is the activity, data, and complexity that obscures what actually matters.",
  },
];
