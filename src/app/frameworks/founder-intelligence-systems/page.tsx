import type { Metadata } from "next";
import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import FrameworkArticle, {
  H2,
  P,
  UL,
} from "@/components/founder-intelligence/FrameworkArticle";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  definedTermJsonLd,
  faqJsonLd,
} from "@/lib/seo/schema";

const PATH = "/frameworks/founder-intelligence-systems";
const TITLE = "Founder Intelligence Systems";
const DEFINITION =
  "Founder Intelligence Systems are business operating systems that combine human judgment, data signals, AI tools, attribution, and feedback loops to improve decision-making and execution.";

const FAQS = [
  {
    question: "What is a Founder Intelligence System?",
    answer:
      "A Founder Intelligence System is a business operating model that combines human judgment, data signals, AI tooling, attribution, and feedback loops so the company can make and execute better decisions at scale.",
  },
  {
    question: "How is this different from AI automation?",
    answer:
      "AI automation moves work faster. A Founder Intelligence System changes which work is being done. It rebuilds the underlying decision architecture before adding AI on top, so the AI compounds judgment instead of accelerating dysfunction.",
  },
  {
    question: "What systems should a founder build before AI?",
    answer:
      "A clear business objective, a signal collection layer, an attribution model, defined human judgment points, and documented execution workflows. AI is a layer on top of that architecture — not a substitute for it.",
  },
  {
    question: "Why does AI fail without systems?",
    answer:
      "AI applied to broken systems amplifies the broken parts: noisy data produces confidently wrong outputs, unclear ownership creates orphaned automations, and missing attribution makes it impossible to know whether the AI is helping.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DEFINITION.slice(0, 155),
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
        data={articleJsonLd({
          title: TITLE,
          description: DEFINITION,
          url: PATH,
        })}
      />
      <JsonLd
        data={definedTermJsonLd({
          name: TITLE,
          description: DEFINITION,
          url: PATH,
        })}
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
        title="Founder Intelligence Systems: the operating model behind every engagement."
        intro="Founder Intelligence is not a tool category. It's a way of designing the business so that human judgment, data, and AI compound — instead of compete."
        definition={DEFINITION}
      >
        <H2>Founder Intelligence vs AI automation</H2>
        <P>
          Most companies pursue AI automation. They look for tasks to remove
          from a person’s plate. The result is faster bad work. Applied
          Intelligence inverts the question. Before automating anything, it
          asks which decisions matter, where signal lives, and where human
          judgment is irreplaceable. Only then does AI enter the picture — as
          augmentation, not replacement.
        </P>

        <H2>Why AI fails without systems</H2>
        <UL
          items={[
            "Inputs are noisy: dashboards measure activity, not outcomes.",
            "Workflows are undocumented: AI can't be inserted reliably.",
            "Attribution is weak: nobody can prove whether AI worked.",
            "Ownership is missing: automations rot without a system owner.",
          ]}
        />

        <H2>The seven-layer Founder Intelligence stack</H2>
        <P>
          Every Founder Intelligence System is built across seven layers, in
          order. Skipping a layer is the most common cause of failed AI
          deployments.
        </P>
        <UL
          items={[
            <><strong>1. Business objective.</strong> The outcome the system exists to produce.</>,
            <><strong>2. Signal collection.</strong> The inputs the business deliberately captures.</>,
            <><strong>3. Attribution layer.</strong> The model that links inputs to outcomes.</>,
            <><strong>4. Human judgment layer.</strong> The decisions reserved for taste, ethics, and context.</>,
            <><strong>5. AI augmentation layer.</strong> The places where AI compresses time or expands reach.</>,
            <><strong>6. Execution workflow.</strong> Owners, tools, and ordering for the work itself.</>,
            <><strong>7. Feedback loop.</strong> The mechanism that retires what fails and reinvests in what works.</>,
          ]}
        />

        <H2>Examples</H2>
        <UL
          items={[
            "A consultancy that uses AI in proposal drafting only after redesigning its qualification scorecard so the AI starts from real signal.",
            "A creator-led brand that documents content workflows before deploying AI repurposing — so the AI compounds an existing engine instead of generating noise.",
            "A SaaS startup that builds attribution before building lifecycle automations, so every AI-generated touch is tied to a measurable conversion event.",
          ]}
        />

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </FrameworkArticle>
    </>
  );
}
