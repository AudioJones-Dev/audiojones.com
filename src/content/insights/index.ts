export type InsightSummary = {
  slug: string;
  title: string;
  excerpt: string;
  pillar: "founder-intelligence" | "signal" | "ai-failure" | "attribution";
};

export const INSIGHTS: InsightSummary[] = [
  {
    slug: "founder-intelligence-systems",
    title: "What is an Founder Intelligence System?",
    excerpt:
      "The category, the seven-layer stack, and why founders should build the system before adopting the tools.",
    pillar: "founder-intelligence",
  },
  {
    slug: "signal-vs-noise-business",
    title: "Signal vs Noise in Business: why more data makes decisions harder",
    excerpt:
      "Most operating dashboards drift toward noise as the business grows. Here's how to extract signal back out.",
    pillar: "signal",
  },
  {
    slug: "why-ai-fails-most-companies",
    title: "Why AI fails most companies (and what to fix first)",
    excerpt:
      "AI projects fail for systemic reasons, not technical ones. The fix is operational, not algorithmic.",
    pillar: "ai-failure",
  },
  {
    slug: "marketing-attribution-causal-identification",
    title:
      "Marketing attribution and causal identification for small businesses",
    excerpt:
      "Founder-led companies can't afford to scale unproven inputs. Causal attribution is how you stop guessing.",
    pillar: "attribution",
  },
];
