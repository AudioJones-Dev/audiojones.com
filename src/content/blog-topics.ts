/**
 * Static blog topic clusters.
 *
 * These render even without Sanity, so they are real, statically-generated
 * routes. They live here rather than inside the route file because the sitemap
 * needs the slugs and must not pull the page module — and its Sanity client —
 * into its build graph.
 *
 * Sanity may define additional clusters at runtime; those are merged in by
 * `generateStaticParams` in the route and are not listed here.
 */

export type BlogTopicCluster = {
  label: string;
  description: string;
  accent: string;
};

export const BLOG_TOPIC_CLUSTERS: Record<string, BlogTopicCluster> = {
  "founder-intelligence-systems": {
    label: "Founder Intelligence Systems",
    description:
      "How to identify signal, build operating leverage, and create systems that compound. The full Founder Intelligence Systems framework documented.",
    accent: "#4DACFF",
  },
  "signal-vs-noise": {
    label: "Signal vs Noise",
    description:
      "Causal vs vanity metrics. Separating what actually creates revenue from what consumes attention and budget without producing outcomes.",
    accent: "#E8FF5A",
  },
  "map-attribution": {
    label: "M.A.P. Attribution",
    description:
      "Meaningful. Actionable. Profitable. The Audio Jones attribution framework for identifying exactly what drives growth in your business.",
    accent: "#E8FF5A",
  },
  "why-ai-fails": {
    label: "Why AI Fails",
    description:
      "AI fails before it starts — when automation precedes systems, processes, and signal clarity. Everything founder-led businesses need to know before adopting AI.",
    accent: "#666666",
  },
  "ai-readiness": {
    label: "AI Readiness for Founder-Led Businesses",
    description:
      "The diagnostic framework for knowing whether your business is ready for AI. Processes, attribution, data hygiene, and operating model — all before the tools.",
    accent: "#3DFFB0",
  },
};
