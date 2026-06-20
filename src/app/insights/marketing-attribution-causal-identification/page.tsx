import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import InsightArticle from "@/components/founder-intelligence/InsightArticle";
import { H2, P, UL } from "@/components/founder-intelligence/FrameworkArticle";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo/schema";

const PATH = "/insights/marketing-attribution-causal-identification";
const TITLE = "Marketing attribution and causal identification for small businesses";
const DESCRIPTION =
  "Founder-led companies can't afford to scale unproven inputs. Causal attribution is how you stop guessing and start compounding.";

const FAQS = [
  {
    question: "What is marketing attribution?",
    answer:
      "Marketing attribution is the practice of linking outcomes — revenue, pipeline, conversions — back to the inputs that produced them, so spend and effort can be directed at what actually works.",
  },
  {
    question: "What is causal attribution?",
    answer:
      "Causal attribution goes beyond correlation. It identifies which inputs actually cause outcomes, controlling for the other inputs that happened nearby in time. It's the difference between 'this channel was touched' and 'this channel made the deal'.",
  },
  {
    question: "How do small businesses know which marketing works?",
    answer:
      "Run every metric through three filters — Meaningful, Actionable, Profitable. Then compare cohorts that received an input against cohorts that didn't. If you can't construct the comparison, the metric isn't yet ready to drive spend.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: TITLE,
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
          { name: "Marketing attribution" },
        ]}
      />

      <InsightArticle
        eyebrow="Pillar essay"
        title={TITLE}
        intro="The fastest answer: most marketing dashboards report which channel was touched, not which channel caused the outcome. Causal attribution is how you fix that."
      >
        <P>
          The mechanism is straightforward. Last-touch and first-touch
          attribution are bookkeeping conventions; they assign credit by
          rule, not by reality. Causal attribution asks a different question:
          would this outcome have happened anyway? The answer is what makes
          spend rational.
        </P>

        <H2>The three failure patterns</H2>
        <UL
          items={[
            "Channel theatre: dashboards full of channel reports nobody decides from.",
            "Vanity ROAS: returns calculated against a baseline that was never controlled.",
            "Attribution blind spot: word-of-mouth and brand effects misclassified as 'direct'.",
          ]}
        />

        <H2>How to do this for a small business</H2>
        <P>
          Start with three to five inputs you can construct a clean
          comparison around — geography, list segment, time window, or
          campaign on/off. Run them through the{" "}
          <Link
            href="/frameworks/map-attribution"
            className="text-accent-blue hover:text-accent-blue"
          >
            M.A.P. filter
          </Link>
          . The ones that survive are the inputs you scale.
        </P>

        <H2>Business implication</H2>
        <P>
          Founder-led companies can’t outspend mistakes the way large
          enterprises can. Causal attribution is how a $1M business avoids
          scaling a marketing channel that was always going to plateau.
        </P>

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </InsightArticle>
    </>
  );
}
