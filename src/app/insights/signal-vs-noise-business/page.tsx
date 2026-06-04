import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/applied-intelligence/Breadcrumbs";
import InsightArticle from "@/components/applied-intelligence/InsightArticle";
import { H2, P, UL } from "@/components/applied-intelligence/FrameworkArticle";
import FAQ from "@/components/applied-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo/schema";

const PATH = "/insights/signal-vs-noise-business";
const TITLE = "Signal vs Noise in Business: why more data makes decisions harder";
const DESCRIPTION =
  "Most operating dashboards drift toward noise as the business grows. Here's how to extract signal back out — and what founders should actually track.";

const FAQS = [
  {
    question: "What is signal vs noise in business data?",
    answer:
      "Signal is information that improves a decision. Noise is information that occupies attention without improving decisions. Most dashboards accumulate noise faster than they accumulate signal.",
  },
  {
    question: "Why does more data make decisions harder?",
    answer:
      "Each new data source adds variance and competes for attention. Without a filter that retires informational metrics, dashboards get heavier and the founder's time-to-decision gets longer.",
  },
  {
    question: "What metrics should founders track?",
    answer:
      "A short list of metrics that pass three filters: meaningful to strategy, capable of changing a decision, and tied to revenue, margin, or efficiency. Everything else is informational at best.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: `${TITLE} | Audio Jones`,
  description: DESCRIPTION,
  path: PATH,
  type: "article",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Insights", url: "/insights" },
          { name: TITLE, url: PATH },
        ])}
      />
      <JsonLd
        data={articleJsonLd({ title: TITLE, description: DESCRIPTION, url: PATH })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights" },
          { name: "Signal vs Noise" },
        ]}
      />

      <InsightArticle
        eyebrow="Pillar essay"
        title={TITLE}
        intro="The fastest answer: more data only helps when it changes a decision. The rest is noise — and noise scales faster than signal."
      >
        <P>
          Signal is causal information that improves judgment. Noise is
          everything else: vanity metrics, fragmented dashboards, reports
          nobody decides from. Founders accumulate noise because measurement
          is cheap and pruning is expensive — every quarter adds tools, and
          almost nothing gets retired.
        </P>

        <P>
          For the philosophical anchor and the extraction process, see the{" "}
          <Link
            href="/frameworks/signal-vs-noise"
            className="text-accent-blue hover:text-accent-blue"
          >
            Signal vs Noise framework
          </Link>
          .
        </P>

        <H2>Why founders track too much</H2>
        <UL
          items={[
            "Each tool ships with its own dashboard nobody asked for.",
            "Marketing teams default to surface metrics because they're easy to chart.",
            "Operating reviews reward 'we measured it' over 'we decided from it'.",
          ]}
        />

        <H2>What to actually track</H2>
        <P>
          A short list of metrics that pass M.A.P: Meaningful to strategy,
          Actionable in a decision, and Profitable in a way you can
          demonstrate. Three to five of those beat thirty informational
          metrics every time. See{" "}
          <Link
            href="/frameworks/map-attribution"
            className="text-accent-blue hover:text-accent-blue"
          >
            M.A.P Attribution
          </Link>{" "}
          for the filter.
        </P>

        <H2>Business implication</H2>
        <P>
          Cutting your dashboard in half usually accelerates decisions.
          Doubling your dashboard almost always slows them down. The
          asymmetry is the entire point.
        </P>

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </InsightArticle>
    </>
  );
}
