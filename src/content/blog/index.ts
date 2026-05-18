import type { PostStub } from "@/lib/sanity/types";

export type StaticBlogPost = PostStub & {
  seoTitle: string;
  seoDescription: string;
  answerSummary: string;
  readingTime: string;
  updatedAt?: string;
  focusKeyword?: string;
  body: Array<
    { type: "paragraph"; text: string } | { type: "list"; items: string[] }
  >;
};

const AI_READINESS_CLUSTER = {
  _id: "static-topic-ai-readiness",
  title: "AI Readiness for Founder-Led Businesses",
  slug: { current: "ai-readiness" },
};

export const STATIC_BLOG_POSTS: StaticBlogPost[] = [
  {
    _id: "static-most-businesses-cannot-actually-scale-ai",
    title: "Most Businesses Cannot Actually Scale AI",
    slug: { current: "most-businesses-cannot-actually-scale-ai" },
    excerpt:
      "AI does not automatically create operational scale. It scales whatever operational condition already exists.",
    publishedAt: "2026-05-18",
    updatedAt: "2026-05-18",
    topicCluster: AI_READINESS_CLUSTER,
    focusKeyword: "operational coherence gap",
    seoTitle: "Most Businesses Cannot Actually Scale AI | Audio Jones",
    seoDescription:
      "Why AI exposes operational clarity problems, widens the operational coherence gap, and amplifies fragmentation when the business system is not ready.",
    answerSummary:
      "Most businesses cannot scale AI because their workflows, data ownership, attribution, and decision systems are not coherent enough for automation to amplify safely.",
    readingTime: "6 min read",
    body: [
      { type: "paragraph", text: "Most businesses do not have an AI problem." },
      {
        type: "paragraph",
        text: "They have an operational clarity problem that AI is exposing at scale.",
      },
      {
        type: "paragraph",
        text: "A founder installs five AI tools in thirty days.",
      },
      {
        type: "paragraph",
        text: "The company starts producing more: content, dashboards, automations, summaries, outbound campaigns, internal documentation.",
      },
      { type: "paragraph", text: "Everything feels faster." },
      { type: "paragraph", text: "But somehow the business feels heavier." },
      {
        type: "paragraph",
        text: "Nobody fully trusts the outputs. The CRM becomes noisier. Teams duplicate work. Three different systems claim ownership over the same customer interaction. AI-generated reports contradict each other. The founder spends midnight reviewing work that was supposed to save time.",
      },
      {
        type: "paragraph",
        text: "The business appears more sophisticated from the outside.",
      },
      {
        type: "paragraph",
        text: "Internally, nobody is completely certain which system is telling the truth.",
      },
      {
        type: "paragraph",
        text: "This is the part of the AI conversation almost nobody wants to talk about.",
      },
      {
        type: "paragraph",
        text: "AI does not automatically create operational scale.",
      },
      {
        type: "paragraph",
        text: "It scales whatever operational condition already exists.",
      },
      {
        type: "paragraph",
        text: "If the business is coherent, AI becomes leverage.",
      },
      {
        type: "paragraph",
        text: "If the business is fragmented, AI accelerates fragmentation.",
      },
      {
        type: "paragraph",
        text: "And most businesses are far more fragmented than they realize.",
      },
      {
        type: "paragraph",
        text: "There is a name for the gap between how a business appears to function and how it actually functions underneath.",
      },
      { type: "paragraph", text: "It is the operational coherence gap." },
      {
        type: "paragraph",
        text: "It is the distance between the workflows a company believes it has and the workflows that are actually producing outcomes.",
      },
      {
        type: "paragraph",
        text: "For years, that gap remained hidden — absorbed by human judgment, manual correction, institutional memory, and informal coordination.",
      },
      { type: "paragraph", text: "AI removes the absorption layer." },
      { type: "paragraph", text: "The gap becomes visible." },
      {
        type: "paragraph",
        text: "And in most businesses, it is much larger than the founder assumed.",
      },
      {
        type: "paragraph",
        text: "The modern business stack already resembles an unstable nervous system.",
      },
      {
        type: "paragraph",
        text: "CRM, marketing automation, scheduling, analytics, communication, reporting, documentation, fulfillment.",
      },
      {
        type: "paragraph",
        text: "Then AI gets layered across all of them simultaneously.",
      },
      {
        type: "list",
        items: [
          "operational redesign",
          "governance",
          "attribution clarity",
          "system ownership",
          "institutional memory",
          "a clear understanding of where revenue actually comes from",
        ],
      },
      { type: "paragraph", text: "The result is not intelligence." },
      { type: "paragraph", text: "It is amplification." },
      {
        type: "paragraph",
        text: "The dangerous assumption behind most AI adoption is that output equals scale.",
      },
      { type: "paragraph", text: "It does not." },
      {
        type: "paragraph",
        text: "A business can produce ten times more content while becoming less operationally intelligent.",
      },
      {
        type: "paragraph",
        text: "A company can automate follow-up while simultaneously losing visibility into lead quality.",
      },
      {
        type: "paragraph",
        text: "A team can generate more reports while understanding the business less clearly than before.",
      },
      {
        type: "paragraph",
        text: "Because most organizations are measuring AI throughput instead of operational coherence.",
      },
      { type: "paragraph", text: "Activity scaled." },
      { type: "paragraph", text: "Clarity did not." },
      {
        type: "paragraph",
        text: "In many businesses, humans were quietly functioning as workflow glue.",
      },
      {
        type: "paragraph",
        text: "They corrected CRM records. Resolved contradictions between systems. Interpreted context. Validated customer intent. Filled operational gaps that were never formally documented.",
      },
      {
        type: "paragraph",
        text: "AI removes friction before organizations redesign the systems underneath that friction.",
      },
      {
        type: "paragraph",
        text: "That is why many AI implementations initially feel productive while quietly creating operational debt.",
      },
      {
        type: "paragraph",
        text: "The organization becomes busier without becoming clearer.",
      },
      { type: "paragraph", text: "This is where the illusion begins." },
      {
        type: "paragraph",
        text: "Because AI is extremely good at creating the appearance of operational progress.",
      },
      {
        type: "paragraph",
        text: "Dashboards update automatically. Meetings are summarized. Content is generated instantly. Tasks are routed. Reports are delivered.",
      },
      {
        type: "paragraph",
        text: "From the outside, the company appears to be scaling.",
      },
      {
        type: "paragraph",
        text: "Internally, something else starts happening.",
      },
      {
        type: "paragraph",
        text: "Teams stop knowing which system contains the source of truth.",
      },
      { type: "paragraph", text: "Founders lose visibility into causality." },
      {
        type: "list",
        items: [
          "what generated the lead",
          "what improved conversion",
          "where the customer dropped off",
          "which workflow failed",
          "which automation actually increased revenue",
        ],
      },
      {
        type: "paragraph",
        text: "The business generates more outputs while losing visibility into why outcomes are happening.",
      },
      {
        type: "paragraph",
        text: "This is the hidden operational cost of premature AI adoption.",
      },
      {
        type: "paragraph",
        text: "The operational coherence gap widens faster than the organization can close it.",
      },
      { type: "paragraph", text: "That gap is where chaos enters." },
      {
        type: "paragraph",
        text: "And this is why so many companies are quietly experiencing a strange contradiction:",
      },
      {
        type: "paragraph",
        text: "They have more automation than ever before.",
      },
      {
        type: "paragraph",
        text: "Yet the founder still feels like the bottleneck.",
      },
      {
        type: "paragraph",
        text: "Because the real bottleneck was often never labor.",
      },
      {
        type: "list",
        items: [
          "decision clarity",
          "workflow ownership",
          "data integrity",
          "operational structure",
          "attribution visibility",
          "coordination",
          "governance",
        ],
      },
      { type: "paragraph", text: "AI did not remove those problems." },
      { type: "paragraph", text: "It exposed them." },
      {
        type: "paragraph",
        text: "The businesses that benefit most from AI over the next decade will probably not be the businesses with the most tools.",
      },
      {
        type: "paragraph",
        text: "They will be the businesses with the smallest operational coherence gap.",
      },
      {
        type: "list",
        items: [
          "where information lives",
          "how decisions are made",
          "how workflows connect",
          "how attribution is measured",
          "how institutional knowledge is retained",
          "how operational truth is maintained at scale",
        ],
      },
      {
        type: "paragraph",
        text: "Because AI does not eliminate organizational reality.",
      },
      { type: "paragraph", text: "It amplifies it." },
      {
        type: "paragraph",
        text: "When deployed into a coherent system, AI becomes leverage.",
      },
      {
        type: "paragraph",
        text: "When deployed into fragmentation, it becomes amplification.",
      },
      { type: "paragraph", text: "Not of intelligence." },
      { type: "paragraph", text: "Of instability." },
      {
        type: "paragraph",
        text: "So the real question is not whether your business is using AI.",
      },
      {
        type: "paragraph",
        text: "The real question is whether your business could survive being measured by it.",
      },
      {
        type: "paragraph",
        text: "Because AI does not ask whether the system is ready.",
      },
      { type: "paragraph", text: "It simply reveals whether it is." },
      {
        type: "paragraph",
        text: "Most founders will not realize the size of the operational coherence gap until the gap is already producing damage.",
      },
      {
        type: "paragraph",
        text: "The businesses that move first will not be the ones that adopted the most tools.",
      },
      {
        type: "paragraph",
        text: "They will be the ones that measured the gap before AI measured it for them.",
      },
    ],
  },
];

export function getStaticBlogPost(slug: string) {
  return STATIC_BLOG_POSTS.find((post) => post.slug.current === slug);
}

export function getStaticBlogPostsByTopic(topicSlug: string) {
  return STATIC_BLOG_POSTS.filter(
    (post) => post.topicCluster?.slug.current === topicSlug,
  );
}
