// src/app/cookie-policy/page.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description:
    "How Audio Jones uses essential, analytics, and marketing cookies, and how to manage your cookie preferences.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  const lastUpdated = "October 29, 2025";

  return (
    <main className="min-h-screen bg-[#111] text-white">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Cookie Policy</h1>
        <p className="mt-4 text-lg text-white/75">Last Updated: {lastUpdated}</p>

        <div className="prose prose-invert mt-8 max-w-none">
          <p>
            We use cookies to improve functionality and analyze traffic. By continuing, you consent to cookies
            as described here.
          </p>

          <h2>1. Types of Cookies</h2>
          <ul>
            <li>Essential (session, security)</li>
            <li>Analytics (Google Analytics, Meta Pixel)</li>
            <li>Marketing (retargeting ads)</li>
          </ul>

          <h2>2. Managing Cookies</h2>
          <p>
            You may disable non-essential cookies in browser settings or via our banner controls.
          </p>

          <h2>3. Third-Party Tools</h2>
          <p>
            We use Google Analytics, Facebook Pixel, and YouTube Embeds under their respective privacy
            policies.
          </p>

          <h2>4. Updates</h2>
          <p>Changes posted on this page with new “Last Updated” date.</p>
        </div>
      </section>
    </main>
  );
}
