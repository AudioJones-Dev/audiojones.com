import type { Metadata } from "next";
import Breadcrumbs from "@/components/applied-intelligence/Breadcrumbs";
import FrameworkArticle, {
  H2,
  P,
  UL,
} from "@/components/applied-intelligence/FrameworkArticle";
import FAQ from "@/components/applied-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  definedTermJsonLd,
  faqJsonLd,
} from "@/lib/seo/schema";

const PATH = "/frameworks/map-attribution";
const TITLE = "M.A.P Attribution Framework";
const DEFINITION =
  "M.A.P Attribution is an Audio Jones methodology for evaluating whether a metric or data point is Meaningful, Actionable, and Profitable before it drives business strategy.";

const FAQS = [
  {
    question: "What is the M.A.P Attribution Framework?",
    answer:
      "M.A.P is a three-question filter — Meaningful, Actionable, Profitable — that every metric must pass before it earns the right to drive a business decision. It separates causal signal from vanity activity.",
  },
  {
    question: "How is M.A.P different from marketing analytics?",
    answer:
      "Marketing analytics typically measures activity. M.A.P measures decision quality. A click-through rate may be tracked, but if it can't move a decision and can't be tied to profit, M.A.P retires it from the dashboard.",
  },
  {
    question: "Why does attribution matter for small businesses?",
    answer:
      "Founder-led businesses can't afford to scale unproven inputs. Without causal attribution, every dollar of growth spend is a guess, and every AI automation is built on top of a hypothesis the team has never validated.",
  },
  {
    question: "How do I know if a metric is profitable?",
    answer:
      "A metric is profitable when changes in it produce changes in revenue, margin, or efficiency that you can demonstrate. If you can't draw that line, the metric is informational at best and theatre at worst.",
  },
  {
    question: "What is a high-signal metric?",
    answer:
      "A high-signal metric passes all three M.A.P filters: it matters to the business, it can change a decision, and it ties to profit. Most dashboards contain two or three of these surrounded by noise.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: `${TITLE} Framework`,
  description:
    "M.A.P Attribution: a three-filter framework that decides which metrics earn the right to drive your strategy.",
  path: PATH,
  type: "article",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Frameworks", url: "/frameworks" },
          { name: TITLE, url: PATH },
        ])}
      />
      <JsonLd
        data={articleJsonLd({ title: TITLE, description: DEFINITION, url: PATH })}
      />
      <JsonLd
        data={definedTermJsonLd({ name: TITLE, description: DEFINITION, url: PATH })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Frameworks", href: "/frameworks" },
          { name: TITLE },
        ]}
      />

      <FrameworkArticle
        eyebrow="Framework"
        title="M.A.P Attribution: the filter every metric must earn its way through."
        intro="Most dashboards are confidence theatre. M.A.P is the filter that strips them down to the data that actually moves the business."
        definition={DEFINITION}
      >
        <H2>Why most attribution is wrong</H2>
        <P>
          Most attribution models track which channel a lead touched last —
          not which channel caused the lead. They reward whichever surface had
          the cookie when conversion happened, regardless of where the
          intent was actually formed. M.A.P forces a different question: did
          this metric move a decision, and did the decision move profit?
        </P>

        <H2>M = Meaningful</H2>
        <P>
          A metric is Meaningful when it represents something the business
          cares about at the strategy level. Page views are not meaningful.
          Pipeline revenue from a specific source is. Meaning is the first
          gate because measurable doesn’t imply important.
        </P>

        <H2>A = Actionable</H2>
        <P>
          A metric is Actionable when a change in it would change a decision.
          If the number moves and nothing about how the team operates would
          change, the metric is informational, not operational. Most
          dashboards are full of informational metrics dressed up as KPIs.
        </P>

        <H2>P = Profitable</H2>
        <P>
          A metric is Profitable when improving it improves revenue, margin,
          or efficiency in a way you can demonstrate. This is where
          attribution earns its name: a Profitable metric carries a causal
          link to outcome, not just a correlation.
        </P>

        <H2>Signal vs noise scoring</H2>
        <UL
          items={[
            "Score every dashboard tile against M, A, and P (0 or 1 each).",
            "0–1: noise — remove or relegate to diagnostics.",
            "2: borderline — keep, but instrument for the missing dimension.",
            "3: signal — protect, automate, and tie to a named decision owner.",
          ]}
        />

        <H2>Use cases</H2>
        <UL
          items={[
            "Pruning marketing dashboards before AI reporting layers are added.",
            "Selecting which lead source to scale spend against.",
            "Deciding which automation deserves engineering investment.",
            "Killing reports that nobody decides from.",
          ]}
        />

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </FrameworkArticle>
    </>
  );
}
