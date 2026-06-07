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

const PATH = "/insights/applied-intelligence-systems";
const TITLE = "What is an Applied Intelligence System?";
const DESCRIPTION =
  "An Applied Intelligence System combines human judgment, data signals, AI tools, attribution, and feedback loops into a single business operating model.";

const FAQS = [
  {
    question: "What is an Applied Intelligence System?",
    answer:
      "An Applied Intelligence System is a business operating model that combines human judgment, data signals, AI tools, attribution, and feedback loops to improve and execute decisions at scale.",
  },
  {
    question: "How does Applied Intelligence differ from AI automation?",
    answer:
      "AI automation moves work faster. Applied Intelligence changes which work is done. It rebuilds decision architecture before adding AI on top, so the AI compounds judgment instead of accelerating dysfunction.",
  },
  {
    question: "What systems should founders build before AI?",
    answer:
      "A clear business objective, a signal collection layer, an attribution model, defined human judgment points, and documented execution workflows. AI is the layer on top of that architecture, not a substitute for it.",
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
          { name: "Applied Intelligence Systems" },
        ]}
      />

      <InsightArticle
        eyebrow="Pillar essay"
        title={TITLE}
        intro="The category, the seven-layer stack, and why founders should build the system before adopting the tools."
      >
        <P>
          The fastest answer: an Applied Intelligence System is a business
          operating model. It combines human judgment, data signals, AI
          tools, attribution, and feedback loops into a single architecture
          designed to improve decisions and execution. It belongs on the same
          shelf as ERP, CRM, and BI — not on the same shelf as a chatbot.
        </P>

        <P>
          The mechanism is simple: AI fails when it’s bolted onto a business
          whose underlying decision architecture is unclear. Applied
          Intelligence inverts the order. First the architecture, then the
          AI. The architecture is what makes AI compound rather than corrode.
        </P>

        <H2>The seven layers</H2>
        <UL
          items={[
            "Business objective.",
            "Signal collection.",
            "Attribution layer.",
            "Human judgment layer.",
            "AI augmentation layer.",
            "Execution workflow.",
            "Feedback loop.",
          ]}
        />

        <P>
          For the full breakdown of each layer, see the{" "}
          <Link
            href="/frameworks/applied-intelligence-systems"
            className="text-accent-blue hover:text-accent-blue"
          >
            Applied Intelligence Systems framework
          </Link>
          .
        </P>

        <H2>Business implication</H2>
        <P>
          Founders who treat AI as a tool category will keep buying tools.
          Founders who treat AI as a layer in a system will compound. The
          difference shows up in the second year: tool buyers plateau,
          system builders accelerate.
        </P>

        <H2>Example</H2>
        <P>
          A consultancy with a noisy lead pipeline tried three AI scoring
          tools and got worse results each time. The fix wasn’t a fourth
          tool — it was an attribution layer that finally separated
          referral leads from cold inbound. Once the data was honest, the
          first tool worked.
        </P>

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </InsightArticle>
    </>
  );
}
