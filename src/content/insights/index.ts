export type InsightSummary = {
  slug: string;
  title: string;
  excerpt: string;
  pillar: "founder-intelligence" | "signal" | "ai-failure" | "attribution" | "industry";
};

export const INSIGHTS: InsightSummary[] = [
  {
    slug: "founder-intelligence-systems",
    title: "What is a Founder Intelligence System?",
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
  {
    slug: "revenue-leak-diagnostic",
    title: "What is a Revenue Leak Diagnostic?",
    excerpt:
      "A structured review that finds where a business loses revenue it already earned — and ranks the fixes.",
    pillar: "attribution",
  },
  {
    slug: "follow-up-intelligence",
    title: "What is Follow-Up Intelligence?",
    excerpt:
      "The system that knows which leads to contact, when, and why — so no opportunity goes cold.",
    pillar: "founder-intelligence",
  },
  {
    slug: "business-memory",
    title: "What is Business Memory?",
    excerpt:
      "The system that retains what your business knows, so knowledge doesn't live only in people's heads.",
    pillar: "founder-intelligence",
  },
  {
    slug: "missed-quote-requests-ramp-lift-companies",
    title: "Why ramp and lift companies lose quote requests (and how to stop it)",
    excerpt:
      "The owner is on installs when the phone rings. What missed quotes cost, and how to capture and follow up on every request.",
    pillar: "industry",
  },
  {
    slug: "ai-call-transcription-home-service-business",
    title: "AI call transcription for home service businesses",
    excerpt:
      "What it captures, how it feeds your CRM and follow-up, where a person should stay involved, and when it pays off.",
    pillar: "industry",
  },
];
