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
  definedTermJsonLd,
  faqJsonLd,
} from "@/lib/seo/schema";

const PATH = "/insights/revenue-leak-diagnostic";
const TITLE = "What is a Revenue Leak Diagnostic?";
const DEFINITION =
  "A Revenue Leak Diagnostic is a structured review of a business that finds where earned revenue is lost — across response time, follow-up, qualification, attribution, and reporting — and ranks the highest-leverage fixes.";
const DESCRIPTION =
  "A Revenue Leak Diagnostic finds where a business loses revenue it already earned — missed calls, slow follow-up, weak qualification, and broken attribution — and ranks the fixes.";

const FAQS = [
  {
    question: "What is a Revenue Leak Diagnostic?",
    answer: DEFINITION,
  },
  {
    question: "How is it different from a marketing audit?",
    answer:
      "A marketing audit looks at campaigns and ad spend. A Revenue Leak Diagnostic looks at what happens to leads after they arrive — response time, follow-up, qualification, and attribution — which is where most recoverable revenue hides.",
  },
  {
    question: "What do I get at the end?",
    answer:
      "A prioritized action plan: the specific leaks, ranked by how much revenue each one is costing and how quickly it can be fixed.",
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
      <JsonLd data={definedTermJsonLd({ name: "Revenue Leak Diagnostic", description: DEFINITION, url: PATH })} />
      <JsonLd data={faqJsonLd(FAQS)} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights" },
          { name: "Revenue Leak Diagnostic" },
        ]}
      />

      <InsightArticle
        eyebrow="Definition"
        title={TITLE}
        intro="The fastest answer: a Revenue Leak Diagnostic finds the money your business already earned but never collected — and tells you which leak to plug first."
      >
        <P>
          Most owners think they have a lead problem. More often they have a
          leak problem: leads arrive, then slip out in the gap between the phone
          ringing and the deal closing. A Revenue Leak Diagnostic measures that
          gap and puts a number on it.
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
          It is not a sales call. It is a structured read of how leads enter,
          how fast they are answered, how follow-up happens, and where the
          handoffs break — ending in a decision-ready plan.
        </P>

        <H2>Example</H2>
        <P>
          A home-services business spent more on ads every month and growth
          stalled. The diagnostic found that one in four calls went unanswered
          and follow-up stopped after a single text. The leak was not ad spend —
          it was intake. Fixing follow-up recovered more than the next ad budget
          would have.
        </P>

        <H2>Business implication</H2>
        <P>
          You can usually recover revenue faster by fixing leaks than by buying
          more leads. The diagnostic tells you which leak returns the most
          money, first. See{" "}
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
          , the system that usually plugs the biggest leak.
        </P>

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </InsightArticle>
    </>
  );
}
