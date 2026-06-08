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

const PATH = "/insights/why-ai-fails-most-companies";
const TITLE = "Why AI fails most companies (and what to fix first)";
const DESCRIPTION =
  "AI projects fail for systemic reasons, not technical ones. The fix is operational — not algorithmic.";

const FAQS = [
  {
    question: "Why do AI projects fail?",
    answer:
      "Most AI projects fail because the surrounding business system is unclear: noisy data, undocumented workflows, weak attribution, and no decision owner for the AI's output. Better models don't fix any of those.",
  },
  {
    question: "Why does AI fail in small businesses?",
    answer:
      "Small businesses typically lack documented systems and reliable attribution. Without those, AI is layered onto a guess. The first failed pilot then poisons the team's appetite for the next attempt.",
  },
  {
    question: "What is AI operationalization?",
    answer:
      "Operationalization means turning a model or AI workflow into a stable, owned, measurable part of how the business runs. It includes the data inputs, the human decision points, the success metric, and the retirement plan.",
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
          { name: "Why AI fails" },
        ]}
      />

      <InsightArticle
        eyebrow="Pillar essay"
        title={TITLE}
        intro="The fastest answer: AI rarely fails because the model is wrong. It fails because the business is unclear about which decision the AI is supposed to improve."
      >
        <P>
          The mechanism is the same across every failed pilot: noisy inputs,
          undocumented workflow, missing attribution, no named owner for the
          AI’s output. The model can be world-class — without that
          surrounding architecture, it produces confidently wrong work that
          nobody acts on.
        </P>

        <H2>The four failure patterns</H2>
        <UL
          items={[
            "Tool-first deployment: a license is purchased before the system is mapped.",
            "Activity automation: the AI accelerates a workflow that should have been redesigned.",
            "Orphaned automation: nobody owns the AI's output, so it drifts.",
            "Attribution-blind: nobody can prove whether the AI is helping or hurting.",
          ]}
        />

        <H2>What to fix first</H2>
        <P>
          Build the system before the AI. Define the objective, instrument
          the signal layer, run every metric through{" "}
          <Link
            href="/frameworks/map-attribution"
            className="text-accent-blue hover:text-accent-blue"
          >
            M.A.P Attribution
          </Link>
          , and document the workflow. Then deploy AI inside that
          architecture — see the{" "}
          <Link
            href="/frameworks/applied-intelligence-systems"
            className="text-accent-blue hover:text-accent-blue"
          >
            Applied Intelligence Systems framework
          </Link>{" "}
          for the order.
        </P>

        <H2>Business implication</H2>
        <P>
          The companies that win with AI in the next three years won’t be the
          ones with the best tools. They’ll be the ones whose systems were
          coherent enough to absorb AI without breaking.
        </P>

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </InsightArticle>
    </>
  );
}
