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

const PATH = "/insights/business-memory";
const TITLE = "What is Business Memory?";
const DEFINITION =
  "Business Memory is a system that captures and retains an organization's operating knowledge — decisions, SOPs, customer context, and the reasoning behind them — so it survives turnover and scales beyond individual memory.";
const DESCRIPTION =
  "Business Memory is the system that retains what your business knows — decisions, SOPs, customer context, and the reasons behind them — so knowledge does not live only in people's heads.";

const FAQS = [
  {
    question: "What is Business Memory?",
    answer: DEFINITION,
  },
  {
    question: "How is it different from a wiki or shared drive?",
    answer:
      "A wiki stores documents someone remembered to write. Business Memory captures decisions, context, and reasoning as work happens, and makes them retrievable when you need them.",
  },
  {
    question: "Why does it matter for a small business?",
    answer:
      "Small teams carry more knowledge per person, so losing one person hurts more. Business Memory protects against that and lets you grow without the founder as the bottleneck.",
  },
  {
    question: "What happens without it?",
    answer:
      "Repeated mistakes, slow onboarding, and a founder who cannot step away because the business only runs from their head.",
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
      <JsonLd data={definedTermJsonLd({ name: "Business Memory", description: DEFINITION, url: PATH })} />
      <JsonLd data={faqJsonLd(FAQS)} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights" },
          { name: "Business Memory" },
        ]}
      />

      <InsightArticle
        eyebrow="Definition"
        title={TITLE}
        intro="The fastest answer: Business Memory is what keeps your company from forgetting how it works every time someone leaves or gets busy."
      >
        <P>
          In most founder-led businesses, the real operating knowledge lives in
          a few people&apos;s heads and a scatter of docs, chats, and CRM notes.
          When someone leaves — or just gets overloaded — that knowledge walks
          out or goes silent. Business Memory captures it.
        </P>

        <H2>What it holds</H2>
        <UL
          items={[
            "How decisions were made, and why.",
            "SOPs and the way work actually gets done.",
            "Customer context and history.",
            "Where things are and who owns them.",
            "The lessons that otherwise get re-learned the hard way.",
          ]}
        />

        <H2>Why it matters</H2>
        <P>
          Without Business Memory, every hire starts from zero, every repeated
          mistake costs again, and the founder stays the bottleneck because they
          are the index. With it, the business can teach and run itself.
        </P>

        <H2>Example</H2>
        <P>
          A growing firm kept solving the same client problem three different
          ways because no one remembered the last fix. Once decisions and SOPs
          were captured in one place, onboarding dropped from weeks to days.
        </P>

        <H2>Where it lives</H2>
        <P>
          Business Memory is a core layer of a{" "}
          <Link href="/founder-intelligence" className="text-accent-blue hover:text-accent-blue">
            Founder Intelligence System
          </Link>
          . You can start by scoping it in a{" "}
          <Link href="/pricing" className="text-accent-blue hover:text-accent-blue">
            diagnostic
          </Link>
          .
        </P>

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </InsightArticle>
    </>
  );
}
