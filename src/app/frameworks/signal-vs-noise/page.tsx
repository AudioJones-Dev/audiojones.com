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

const PATH = "/frameworks/signal-vs-noise";
const TITLE = "Signal vs Noise";
const DEFINITION =
  "Signal is causal information that improves judgment, execution, or business outcomes. Noise is the activity, data, or complexity that obscures what actually matters.";

const FAQS = [
  {
    question: "What is signal vs noise in business?",
    answer:
      "Signal is information that improves a decision. Noise is information that occupies attention without improving decisions. Most operating dashboards drift toward noise as the business grows because measurement is cheap and pruning is expensive.",
  },
  {
    question: "Why do founders scale noise?",
    answer:
      "Tools, dashboards, and reports get added every quarter; almost nothing gets retired. Each one feels useful in isolation. Combined, they create a fog the founder has to mentally cut through before any decision can be made.",
  },
  {
    question: "What is acceptable noise?",
    answer:
      "Acceptable noise is the unavoidable variance that exposes how the system actually works — edge cases, friction, customer surprises. Removing it would also remove the early signals you need to learn from.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: `${TITLE} in Business`,
  description:
    "Signal vs Noise: the philosophical anchor behind Applied Intelligence. Identify which inputs actually create outcomes, and remove the rest.",
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
        title="Signal vs Noise: the lens behind every Applied Intelligence System."
        intro="The goal isn't to eliminate noise. The goal is to identify which noise reveals signal — and then engineer everything around that signal."
        definition={DEFINITION}
      >
        <H2>Why founders scale noise</H2>
        <P>
          Every tool, dashboard, and report a founder adds feels useful in
          isolation. Almost nothing gets retired. The result is a
          high-resolution picture of activity and a low-resolution picture of
          what actually drives the business. AI laid on top of that
          environment doesn’t clarify — it amplifies.
        </P>

        <H2>Acceptable noise</H2>
        <P>
          Some noise is necessary. Edge cases, customer surprises, and
          process friction are the early signal of where the system is
          weakest. The job is to keep the noise that teaches and remove the
          noise that distracts.
        </P>

        <H2>Signal extraction process</H2>
        <UL
          items={[
            "List every recurring report, dashboard, and inbox the team consumes.",
            "Tag each as signal, acceptable noise, or noise.",
            "For everything tagged 'noise', define a sunset date.",
            "For everything tagged 'signal', name a decision owner.",
            "For everything tagged 'acceptable noise', define what it teaches.",
          ]}
        />

        <H2>Examples</H2>
        <UL
          items={[
            "A weekly traffic report becomes signal only when it ties back to a defined revenue cohort.",
            "A vanity engagement dashboard becomes acceptable noise when it's used solely to flag content drift.",
            "A pipeline forecast becomes noise when nobody decides off it.",
          ]}
        />

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </FrameworkArticle>
    </>
  );
}
