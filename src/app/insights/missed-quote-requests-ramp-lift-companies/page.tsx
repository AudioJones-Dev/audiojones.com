import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import InsightArticle from "@/components/founder-intelligence/InsightArticle";
import { H2, P, UL } from "@/components/founder-intelligence/FrameworkArticle";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";

const PATH = "/insights/missed-quote-requests-ramp-lift-companies";
const TITLE = "Why ramp and lift companies lose quote requests (and how to stop it)";
const DESCRIPTION =
  "Ramp, stairlift and home-modification companies lose quote requests because the owner is on installs when the phone rings. Here is what that costs and how to capture and follow up on every request.";

const LINK_CLASS = "text-accent-blue hover:text-accent-blue";

const FAQS = [
  {
    question: "Why do ramp and lift companies miss quote requests?",
    answer:
      "Usually because the owner or a small crew is on installs and site visits when calls come in. Quotes often need a site measure first, so the request sits in a voicemail, a notebook or someone's memory and never turns into a quote.",
  },
  {
    question: "How many quote requests is a small mobility company likely losing?",
    answer:
      "It varies by company, and the only reliable way to know is to count. Florida Ramp & Lift found at least five quote requests a month were never getting a quote back.",
  },
  {
    question: "Do I need to hire an office person to fix this?",
    answer:
      "Not always. A business phone line that records and transcribes every call, logs it in the CRM and sends a relevant follow-up email covers most of the gap. A person still handles pricing, site visits and the quote itself.",
  },
  {
    question: "Will automatic follow-up feel impersonal to older customers or their families?",
    answer:
      "It does not have to. The follow-up is based on what the caller actually asked about, it is short and plain, and it tells them what happens next and who will contact them. Anything sensitive goes to a person.",
  },
  {
    question: "Where do I start?",
    answer:
      "Start with a diagnostic. It looks at how calls and quote requests come in today, where they drop, and which fix to build first.",
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
        data={articleJsonLd({
          title: TITLE,
          description: DESCRIPTION,
          url: PATH,
          datePublished: "2026-11-07",
        })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights" },
          { name: "Missed quote requests" },
        ]}
      />

      <InsightArticle
        eyebrow="Guide"
        title={TITLE}
        intro="Ramp and lift companies lose quote requests because the people who answer the phone are the same people doing installs and site visits, so calls go unanswered and requests are never written down. The fix is to capture every call automatically, log it in a CRM, send a relevant follow-up right away, and remind someone until the quote goes out."
      >
        <P>
          If you run a ramp, stairlift, vertical platform lift or grab bar
          business, you already know the pattern. The phone rings while you are
          under a porch or carrying a rail up a staircase. You mean to call back.
          By the end of the day there are three more calls, two site measures and
          a supplier problem. Some of those callers never hear from you again.
        </P>
        <P>
          They did not go away. They called someone else.
        </P>

        <H2>Why quote requests get missed</H2>
        <UL
          items={[
            "The owner is on installs and site visits. In a small mobility business, the person who knows the products is usually the person on the job.",
            "Calls come in during jobs. You cannot stop a stairlift install to take notes on a new caller's staircase.",
            "Quotes need a site measure. A ramp or lift quote is rarely a quick number on the phone, so the request has to wait for a visit, and waiting is where it gets lost.",
            "The request lives in the wrong place. Voicemail, a text, a sticky note, a family member's email. Nothing ties them together.",
            "Paperwork piles up. Funding questions, measurements, product options and permits all compete for the same evening hours.",
          ]}
        />
        <P>
          None of this is a discipline problem. It is a capacity problem. There
          are more inbound requests than one busy owner can track by memory.
        </P>

        <H2>What missed quotes cost</H2>
        <P>
          Here is a simple way to put a number on it. The figures below are
          illustrative only. Use your own.
        </P>
        <UL
          items={[
            "Say 5 quote requests a month never get a quote back.",
            "Say you normally win 1 out of every 2 quotes you send.",
            "Say an average job is worth $4,000 to you.",
            "That is 2 to 3 lost jobs a month, or roughly $10,000 a month in work that asked for you by name.",
          ]}
        />
        <P>
          Your numbers will be different. A stairlift job and a full ramp system
          are priced very differently, and close rates vary. The point is that
          the loss is real, it repeats every month, and you already paid to make
          the phone ring.
        </P>

        <H2>The fix: capture, log, follow up, remind</H2>
        <P>
          You do not need more leads. You need every request that already came in
          to reach a quote. That takes four pieces working together:
        </P>
        <UL
          items={[
            "Capture every call. A business phone line with AI call transcription records and writes down each call, even when nobody can pick up.",
            "Log it in the CRM. The caller, the product they asked about, the address and the next step land in one place, not in a voicemail box.",
            "Send a relevant follow-up automatically. The caller gets an email that matches what they asked about, so they know they were heard and what happens next.",
            "Remind until the quote goes out. Open requests stay visible, and someone gets a nudge if a site measure or quote is overdue.",
          ]}
        />
        <P>
          A person still does the parts that need a person: the site visit, the
          measurements, the price and any safety questions about the equipment.
          The system handles the parts that get dropped. For more on how the call
          side works, read{" "}
          <Link
            href="/insights/ai-call-transcription-home-service-business"
            className={LINK_CLASS}
          >
            AI call transcription for home service businesses
          </Link>
          . For the follow-up side, see{" "}
          <Link href="/insights/follow-up-intelligence" className={LINK_CLASS}>
            Follow-Up Intelligence
          </Link>
          .
        </P>

        <H2>A real result: Florida Ramp &amp; Lift</H2>
        <P>
          Florida Ramp &amp; Lift is an accessibility and home-modification
          company in Florida. Before the work started, at least 5 quote requests
          a month never got a quote back. The owner was buried in day-to-day
          operations.
        </P>
        <P>
          We set up a new business phone line with AI call transcription. Every
          call is captured and entered into the CRM, and customers get follow-up
          emails relevant to their call automatically. Those 5 missed quotes a
          month became 5 new sales a month.
        </P>
        <P>
          &ldquo;I went from working in my business to working on my business. I
          got my time back.&rdquo; &mdash; Owner, Florida Ramp &amp; Lift
        </P>
        <P>
          Read the full{" "}
          <Link href="/case-studies" className={LINK_CLASS}>
            Florida Ramp &amp; Lift case study
          </Link>
          . Your results will depend on your call volume, your market and how
          quickly quotes go out once requests are captured.
        </P>

        <H2>How to start</H2>
        <P>
          Before building anything, count. For two weeks, write down every quote
          request that comes in and whether a quote went out. That number tells
          you whether this is worth fixing.
        </P>
        <P>
          If it is, the next step is the{" "}
          <Link href="/founder-intelligence/diagnostic" className={LINK_CLASS}>
            diagnostic
          </Link>
          . It is a six-step request, reviewed by a person, that looks at how
          calls and quote requests reach you today and where they drop. The
          capture and follow-up system itself is built on{" "}
          <Link href="/agents/responseos" className={LINK_CLASS}>
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
