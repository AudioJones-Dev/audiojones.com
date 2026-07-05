import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import FAQ from "@/components/founder-intelligence/FAQ";
import { H2, P, UL } from "@/components/founder-intelligence/FrameworkArticle";
import InsightArticle from "@/components/founder-intelligence/InsightArticle";
import JsonLd from "@/components/seo/JsonLd";
import { ctaLinks } from "@/config/links";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo/schema";

const PATH = "/insights/revenue-leak-diagnostic-cost";
const TITLE = "What does a Founder Revenue Leak Diagnostic cost?";
const DESCRIPTION =
  "The Founder Revenue Leak Diagnostic is publicly priced at $1,997. Implementation work is scoped separately after the diagnostic ranks likely leaks.";

const FAQS = [
  {
    question: "What does a Founder Revenue Leak Diagnostic cost?",
    answer:
      "The Founder Revenue Leak Diagnostic is $1,997. It is priced separately from implementation so the business can check the likely revenue leak before committing to a Founder Intelligence System build.",
  },
  {
    question: "What is included in the price?",
    answer:
      "The diagnostic reviews response speed, follow-up, qualification, attribution, CRM process, and reporting clarity, then ranks the most likely fixes by leverage.",
  },
  {
    question: "Does the price include implementation?",
    answer:
      "No. Implementation is scoped after the diagnostic. The next step may be a smaller follow-up fix, ResponseOS, attribution cleanup, or a larger Founder Intelligence System.",
  },
  {
    question: "Why not start with a full build?",
    answer:
      "A full build before diagnosis can solve the wrong constraint. The diagnostic creates a narrower scope and a better implementation decision.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  type: "article",
});

export default function RevenueLeakDiagnosticCostPage() {
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
        data={articleJsonLd({
          title: TITLE,
          description: DESCRIPTION,
          url: PATH,
        })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights" },
          { name: TITLE },
        ]}
      />

      <InsightArticle
        eyebrow="Pricing"
        title={TITLE}
        intro="The direct answer: the Founder Revenue Leak Diagnostic is $1,997. The implementation plan is scoped after the diagnostic shows which likely leak is worth checking first."
      >
        <P>
          The diagnostic is priced as a separate decision step. That matters
          because many founder-led service businesses do not yet know whether
          the main issue is response speed, follow-up, attribution, reporting,
          CRM hygiene, or offer routing.
        </P>

        <H2>What the $1,997 diagnostic covers</H2>
        <UL
          items={[
            "Response-speed review across inbound lead paths.",
            "Follow-up and recovery-process review.",
            "Qualification and handoff review.",
            "Attribution and source-to-close visibility review.",
            "CRM, reporting, and operating-rhythm review.",
            "Prioritized action plan ranked by impact, difficulty, confidence, and dependency.",
          ]}
        />

        <H2>What is not included</H2>
        <P>
          The diagnostic does not include a full system build. Implementation is
          intentionally scoped after the leak map is complete, because the next
          step may be smaller than a full Founder Intelligence engagement.
        </P>

        <H2>How it connects to the offer ladder</H2>
        <P>
          Start with the free{" "}
          <Link
            href="/ai-readiness-diagnostic"
            className="text-accent-blue hover:text-accent-blue"
          >
            AI Readiness Diagnostic
          </Link>{" "}
          if the business needs a broad orientation. Use the{" "}
          <Link
            href={ctaLinks.revenueLeakDiagnostic}
            className="text-accent-blue hover:text-accent-blue"
          >
            Founder Revenue Leak Diagnostic
          </Link>{" "}
          when revenue leakage is already visible. If the leak is follow-up or
          recovery, the next system may be{" "}
          <Link
            href="/agents/responseos"
            className="text-accent-blue hover:text-accent-blue"
          >
            ResponseOS
          </Link>
          .
        </P>

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </InsightArticle>
    </>
  );
}
