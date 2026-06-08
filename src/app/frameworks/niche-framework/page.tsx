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

const PATH = "/frameworks/niche-framework";
const TITLE = "N.I.C.H.E Framework";
const DEFINITION =
  "The N.I.C.H.E Framework is an Audio Jones positioning system for identifying high-signal markets and engineering business engines around causal clarity, human leverage, and founder intelligence.";

const FAQS = [
  {
    question: "What is the N.I.C.H.E Framework?",
    answer:
      "N.I.C.H.E is a five-stage positioning model — Niche Identification, Intelligence Layer, Causal Clarity, Human Leverage Points, Engine Design — that founders use to architect a business around the highest-signal market segment.",
  },
  {
    question: "Why is niche selection a signal problem?",
    answer:
      "A poorly chosen niche generates noisy data: too many segments, too many objections, too many feedback loops to learn from. Tightening the niche reduces variance and makes every metric a stronger predictor.",
  },
  {
    question: "How does N.I.C.H.E apply to AI systems?",
    answer:
      "AI systems work better with constrained inputs. A tight niche produces tighter prompts, sharper data, more reliable evaluation criteria, and faster compounding feedback loops.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: `${TITLE} | Audio Jones Framework`,
  description:
    "N.I.C.H.E: a five-stage positioning system for identifying high-signal markets and engineering founder-intelligence engines around them.",
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
        title="N.I.C.H.E: positioning is a signal problem before it's a marketing problem."
        intro="Tighten the niche and the rest of the system gets easier — better data, sharper attribution, faster compounding loops."
        definition={DEFINITION}
      >
        <H2>Why niche selection is a signal problem</H2>
        <P>
          Vague positioning produces vague data. Every dashboard, every
          interview, every campaign carries variance from segments you don’t
          actually serve. Tightening the niche removes that variance —
          attribution, messaging, and AI evaluation all sharpen as a
          downstream effect.
        </P>

        <H2>N — Niche Identification</H2>
        <P>
          Define the smallest segment whose problem you can describe in their
          own words and whose economics support the engagement model. Width
          is comfort; depth is leverage.
        </P>

        <H2>I — Intelligence Layer</H2>
        <P>
          Map what the business needs to know to serve this niche
          continuously: which signals matter, how they’re collected, and how
          they update. The Intelligence Layer is the sensory system of the
          business.
        </P>

        <H2>C — Causal Clarity</H2>
        <P>
          Distinguish the inputs that cause outcomes from the inputs that
          merely correlate. M.A.P Attribution lives here. Without causal
          clarity, AI augmentation has nothing reliable to optimize.
        </P>

        <H2>H — Human Leverage Points</H2>
        <P>
          Identify the few decisions and conversations where a human is
          irreplaceable. Protect them from automation. Direct AI augmentation
          to amplify these points, not bypass them.
        </P>

        <H2>E — Engine Design</H2>
        <P>
          Compose the niche, the intelligence layer, the causal model, and
          the human leverage points into a repeatable engine. Engine design
          is what turns insight into compounding revenue.
        </P>

        <H2>Application for founders</H2>
        <UL
          items={[
            "Pre-launch: choose the niche before choosing the offer.",
            "Plateau: re-run N.I.C.H.E to find the next constraint.",
            "Re-architecture: use N.I.C.H.E to redesign a stalling product line.",
          ]}
        />

        <H2>Application for AI systems</H2>
        <UL
          items={[
            "Constrained niches produce sharper prompts and evaluation criteria.",
            "Causal Clarity gives the AI loop something stable to optimize against.",
            "Human Leverage Points define where AI must defer rather than decide.",
          ]}
        />

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </FrameworkArticle>
    </>
  );
}
