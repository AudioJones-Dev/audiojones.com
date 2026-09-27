import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { FRAMEWORKS } from "@/content/frameworks";
import { INSIGHTS } from "@/content/insights";

import { metadata as home } from "@/app/page";
import { metadata as solutions } from "@/app/solutions/page";
import { metadata as services } from "@/app/services/page";
import { metadata as agents } from "@/app/agents/page";
import { metadata as responseos } from "@/app/agents/responseos/page";
import { metadata as pricing } from "@/app/pricing/page";
import { metadata as caseStudies } from "@/app/case-studies/page";
import { metadata as about } from "@/app/about/page";
import { metadata as aiReadiness } from "@/app/ai-readiness-diagnostic/page";
import { metadata as founderIntelligence } from "@/app/founder-intelligence/page";
import { metadata as gravityAudit } from "@/app/founder-gravity-audit/page";
import { metadata as roiCalculator } from "@/app/roi-calculator/page";
import { metadata as bookACall } from "@/app/book-a-call/page";
import { metadata as apply } from "@/app/apply/page";
import { metadata as resources } from "@/app/resources/page";
import { metadata as workshops } from "@/app/workshops/page";
import { metadata as frameworks } from "@/app/frameworks/page";
import { metadata as insights } from "@/app/insights/page";
import { metadata as blog } from "@/app/blog/page";

type PageEntry = { path: string; metadata: Metadata };

// Descriptions come from each page's own metadata export, so this file
// never carries copy of its own and cannot drift from what the page says.
const SECTIONS: Array<{ heading: string; pages: PageEntry[] }> = [
  {
    heading: "Start here",
    pages: [
      { path: "/", metadata: home },
      { path: "/solutions", metadata: solutions },
      { path: "/services", metadata: services },
      { path: "/agents", metadata: agents },
      { path: "/agents/responseos", metadata: responseos },
      { path: "/pricing", metadata: pricing },
      { path: "/case-studies", metadata: caseStudies },
      { path: "/about", metadata: about },
    ],
  },
  {
    heading: "Diagnostics and next steps",
    pages: [
      { path: "/ai-readiness-diagnostic", metadata: aiReadiness },
      { path: "/founder-intelligence", metadata: founderIntelligence },
      { path: "/founder-gravity-audit", metadata: gravityAudit },
      { path: "/roi-calculator", metadata: roiCalculator },
      { path: "/book-a-call", metadata: bookACall },
      { path: "/apply", metadata: apply },
    ],
  },
];

const OPTIONAL: PageEntry[] = [
  { path: "/resources", metadata: resources },
  { path: "/workshops", metadata: workshops },
  { path: "/frameworks", metadata: frameworks },
  { path: "/insights", metadata: insights },
  { path: "/blog", metadata: blog },
];

function titleOf({ title }: Metadata, fallback: string): string {
  if (typeof title === "string") return title;
  if (title && "absolute" in title && title.absolute) return title.absolute;
  if (title && "default" in title && title.default) return title.default;
  return fallback;
}

function link(title: string, url: string, note?: string | null): string {
  return note ? `- [${title}](${url}): ${note}` : `- [${title}](${url})`;
}

function pageLink({ path, metadata }: PageEntry): string {
  return link(titleOf(metadata, path), `${siteConfig.url}${path}`, metadata.description);
}

export function buildLlmsTxt(): string {
  const base = siteConfig.url;
  const blocks = [
    `# ${siteConfig.name}`,
    `> ${siteConfig.description}`,
    ...SECTIONS.map(({ heading, pages }) => [`## ${heading}`, ...pages.map(pageLink)].join("\n")),
    [
      "## Frameworks",
      ...FRAMEWORKS.map((f) => link(f.title, `${base}/frameworks/${f.slug}`, f.description)),
    ].join("\n"),
    [
      "## Insights",
      ...INSIGHTS.map((i) => link(i.title, `${base}/insights/${i.slug}`, i.excerpt)),
    ].join("\n"),
    [
      "## Optional",
      ...OPTIONAL.map(pageLink),
      link("Sitemap", `${base}/sitemap.xml`, "Every crawlable URL, including blog posts."),
    ].join("\n"),
  ];
  return `${blocks.join("\n\n")}\n`;
}
