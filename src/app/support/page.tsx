import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

const SUPPORT_EMAIL = "support@ajdigital.app";
const DESCRIPTION =
  "Contact Audio Jones support for billing, access, project, and service questions.";

const supportTopics = [
  {
    title: "Billing and receipts",
    copy: "Use this for invoice questions, Stripe receipts, failed payments, refund status, or subscription access.",
  },
  {
    title: "Access and fulfillment",
    copy: "Use this when a purchased product, client workspace, download, or onboarding path is unavailable.",
  },
  {
    title: "Project support",
    copy: "Use this for active client work, deliverable questions, rescheduling, or implementation follow-up.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "Support",
  description: DESCRIPTION,
  path: "/support",
});

export default function SupportPage() {
  const supportHref = `mailto:${SUPPORT_EMAIL}?subject=Audio%20Jones%20Support%20Request`;

  return (
    <main className="min-h-screen bg-bg-base text-fg-0">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Audio Jones Support",
          url: `${siteConfig.url}/support`,
          description: DESCRIPTION,
          publisher: {
            "@type": "Organization",
            name: "AJ Digital LLC",
            url: siteConfig.url,
            email: SUPPORT_EMAIL,
            brand: { "@type": "Brand", name: "Audio Jones" },
          },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: SUPPORT_EMAIL,
            availableLanguage: "English",
          },
        }}
      />

      <section className="mx-auto max-w-[1280px] px-5 pb-16 pt-32 sm:px-8 sm:pb-24 sm:pt-40">
        <div className="max-w-3xl">
          <p className="t-label text-signal-yellow">Audio Jones Support</p>
          <h1 className="mt-5 t-h1 text-fg-0">Support for billing, access, and active client work.</h1>
          <p className="mt-6 t-lead text-fg-2">This page is for existing customers, active clients, and payment support. New project inquiries should use the diagnostic or booking path so the request starts with the right context.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={supportHref} className="inline-flex min-h-11 items-center justify-center rounded-md bg-signal-yellow px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-signal-soft focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--accent-blue)]">Email Support</a>
            <Link href="/status" className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-bg-2 px-6 py-3 text-sm font-bold text-fg-0 transition-colors hover:border-[var(--border-strong)] hover:bg-bg-4 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--accent-blue)]">Check System Status</Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {supportTopics.map((topic) => <article key={topic.title} className="rounded-2xl border border-[var(--border-subtle)] bg-surface-1 p-6"><h2 className="t-h4 text-fg-0">{topic.title}</h2><p className="mt-4 t-body text-fg-2">{topic.copy}</p></article>)}
        </div>

        <section className="mt-16 grid gap-8 border-t border-[var(--border-subtle)] pt-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div><p className="t-label text-fg-3">How to reach support</p><h2 className="mt-4 t-h2 text-fg-0">Send the issue with enough context to act.</h2></div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-surface-1 p-6">
              <p className="t-label text-signal-yellow">Support email</p>
              <a href={supportHref} className="mt-3 block break-words text-xl font-bold text-fg-0 transition-colors hover:text-signal-yellow">{SUPPORT_EMAIL}</a>
              <p className="mt-4 t-body text-fg-2">Include the email used at checkout, the product or service name, and a short description of what is blocked. Do not send card numbers, passwords, or private credentials.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/book-a-call" className="rounded-2xl border border-[var(--border-subtle)] bg-surface-1 p-6 transition-colors hover:border-[var(--border-strong)]"><p className="t-label text-fg-3">New work</p><p className="mt-3 t-body text-fg-1">Discuss a known operating problem or use the diagnostic when the system need is still unclear.</p></Link>
              <Link href="/cancellation-policy" className="rounded-2xl border border-[var(--border-subtle)] bg-surface-1 p-6 transition-colors hover:border-[var(--border-strong)]"><p className="t-label text-fg-3">Refund policy</p><p className="mt-3 t-body text-fg-1">Review cancellation and refund terms before opening a billing request.</p></Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
