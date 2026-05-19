// src/app/studio-policy/page.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Studio Use Policy & Liability Waiver",
  description:
    "Booking, deposits, safety expectations, and liability terms for Audio Jones podcast and recording sessions at Circle House Studios.",
  path: "/studio-policy",
});

export default function StudioPolicyPage() {
  const lastUpdated = "October 29, 2025";

  return (
    <main className="min-h-screen bg-[#111] text-white">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          Studio Use Policy & Liability Waiver
        </h1>
        <p className="mt-4 text-lg text-white/75">Last Updated: {lastUpdated}</p>

        <div className="prose prose-invert mt-8 max-w-none">
          <h2>1. Booking & Deposits</h2>
          <p>50% deposit secures booking; balance due at session start.</p>

          <h2>2. Conduct</h2>
          <p>Respect equipment and staff. No food/drink near gear without approval.</p>

          <h2>3. Damage Liability</h2>
          <p>
            Client responsible for cost of repair/replacement for damages caused by negligence.
          </p>

          <h2>4. Health & Safety</h2>
          <p>
            Follow posted rules inside Circle House Studios; non-compliance may terminate session without
            refund.
          </p>

          <h2>5. Recording Rights</h2>
          <p>
            Audio Jones retains right to use short clips for portfolio unless client opts out in writing.
          </p>

          <h2>6. Waiver</h2>
          <p>
            Client releases AJ Digital LLC from liability for injury or loss except gross negligence.
          </p>

          <p>Governing Law: Florida.</p>
        </div>
      </section>
    </main>
  );
}
