import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Diagnostic received | Founder Intelligence System",
    description:
      "Your Founder Intelligence System Diagnostic request has been received. Audio Jones will review your signal profile and respond within two business days.",
    path: "/founder-intelligence-system/diagnostic/thank-you",
  }),
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Founder Intelligence System", href: "/founder-intelligence-system" },
          { name: "Diagnostic", href: "/founder-intelligence-system/diagnostic" },
          { name: "Received" },
        ]}
      />
      <section className="bg-[#05070F] py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C8A96A]">
            Received
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Your diagnostic request has been received.
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            I’ll review your signal profile, attribution clarity, and AI
            readiness. If there is a strong fit, the next step is a strategic
            diagnostic conversation. Expect a reply within two business days.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Link
              href="/frameworks/founder-intelligence-systems"
              className="rounded-lg border border-white/10 bg-[#0B1020] p-6 transition hover:border-white/30"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#C8A96A]">
                Read while you wait
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Founder Intelligence Systems →
              </p>
              <p className="mt-1 text-sm text-slate-400">
                The seven-layer model behind every engagement.
              </p>
            </Link>
            <Link
              href="/frameworks/map-attribution"
              className="rounded-lg border border-white/10 bg-[#0B1020] p-6 transition hover:border-white/30"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#C8A96A]">
                Pre-work
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                M.A.P Attribution →
              </p>
              <p className="mt-1 text-sm text-slate-400">
                The filter every metric must pass before driving strategy.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
