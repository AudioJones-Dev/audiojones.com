import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import InsightArticle from "@/components/founder-intelligence/InsightArticle";
import { H2, P, UL } from "@/components/founder-intelligence/FrameworkArticle";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { ctaLinks } from "@/config/links";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  definedTermJsonLd,
  faqJsonLd,
} from "@/lib/seo/schema";

const PATH = "/insights/revenue-leak-diagnostic";
const TITLE = "What is a Founder Revenue Leak Diagnostic?";
const DEFINITION =
  "A Founder Revenue Leak Diagnostic is a structured entry point into Founder Intelligence Systems that checks where earned demand may be lost across response time, follow-up, qualification, attribution, and reporting.";
const DESCRIPTION =
  "A Founder Revenue Leak Diagnostic checks where a service business may be losing earned demand — missed calls, slow follow-up, weak qualification, and broken attribution.";

const FAQS = [
  {
    question: "What is a Founder Revenue Leak Diagnostic?",
    answer: DEFINITION,
  },
  {
    question: "How is it different from a marketing audit?",
    answer:
      "A marketing audit looks at campaigns and ad spend. A Founder Revenue Leak Diagnostic looks at what happens after leads arrive — response time, follow-up, qualification, and attribution — as the entry point into the right Founder Intelligence System.",
  },
  {
    question: "What do I get at the end?",
    answer:
      "A prioritized action plan: likely leaks, ranked by expected leverage, difficulty, confidence, and dependency.",
  },
  {
    question: "Who is it for?",
    answer:
      "Founder-led service businesses, usually doing $500K to $5M or more, that spend money getting leads but are not sure how many turn into booked work.",
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
      <JsonLd data={articleJsonLd({ title: TITLE, description: DESCRIPTION, url: PATH })} />
      <JsonLd data={definedTermJsonLd({ name: "Founder Revenue Leak Diagnostic", description: DEFINITION, url: PATH })} />
      <JsonLd data={faqJsonLd(FAQS)} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights" },
          { name: "Founder Revenue Leak Diagnostic" },
        ]}
      />

      <InsightArticle
        eyebrow="Definition"
        title={TITLE}
        intro="The fastest answer: a Founder Revenue Leak Diagnostic checks where a service business may be losing earned demand, then routes the next fix into the right Founder Intelligence System."
      >
        <P>
          Most owners think they have a lead problem. More often they have a
          leak problem: leads arrive, then slip out in the gap between the phone
          ringing and the deal closing. A Founder Revenue Leak Diagnostic checks
          that gap and separates facts from inference before any build is scoped.
        </P>

        <H2>Where revenue leaks</H2>
        <UL
          items={[
            "Missed and unreturned calls.",
            "Slow or inconsistent follow-up.",
            "Leads that are never properly qualified.",
            "Attribution so unclear you scale the wrong channel.",
            "Reporting gaps that hide the loss entirely.",
          ]}
        />

        <H2>How the diagnostic works</H2>
        <P>
          It is not a generic marketing audit. It is a structured read of how leads enter,
          how fast they are answered, how follow-up happens, and where the
          handoffs may break — ending in a decision-ready Founder Intelligence
          plan.
        </P>

        <H2>Example</H2>
        <P>
          A home-services business spent more on ads every month and growth
          stalled. The diagnostic may reveal that calls go unanswered or that
          follow-up stops after a single text. In that case, the first system
          question is intake and recovery before the next ad budget.
        </P>

        <H2>Business implication</H2>
        <P>
          You can usually recover revenue faster by fixing leaks than by buying
          more leads. The diagnostic helps identify which likely leak deserves attention
          first. See the{" "}
          <Link
            href={ctaLinks.revenueLeakDiagnostic}
            className="text-accent-blue hover:text-accent-blue"
          >
            Founder Revenue Leak Diagnostic
          </Link>
          , compare{" "}
          <Link href="/pricing" className="text-accent-blue hover:text-accent-blue">
            offers and pricing
          </Link>
          , or read about{" "}
          <Link
            href="/insights/follow-up-intelligence"
            className="text-accent-blue hover:text-accent-blue"
          >
            Follow-Up Intelligence
          </Link>
          , the system that often addresses follow-up and recovery gaps.
        </P>

        <div className="rounded-xl border border-border-subtle bg-surface-1 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-yellow">
            Related path
          </p>
          <div className="mt-3 grid gap-3 text-sm font-semibold sm:grid-cols-3">
            <Link
              href={ctaLinks.revenueLeakDiagnostic}
              className="text-accent-blue hover:text-accent-blue"
            >
              Diagnostic offer
            </Link>
            <Link href="/pricing" className="text-accent-blue hover:text-accent-blue">
              Pricing
            </Link>
            <Link
              href="/agents/responseos"
              className="text-accent-blue hover:text-accent-blue"
            >
              ResponseOS
            </Link>
          </div>
        </div>

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </InsightArticle>
    </>
  );
}
