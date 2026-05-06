import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  personJsonLd,
} from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "About Audio Jones — Applied Intelligence Systems",
  description:
    "Audio Jones is an Applied Intelligence Systems partner for founder-led businesses. Tyrone Nelms helps operators identify causal growth signals, reduce noise, and build systems that compound.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={personJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ])}
      />

      {/* ── Page content ── */}
      {/*
        TODO: Add About page UI.
        This page currently serves as a metadata + schema placeholder.
        Wire in the About section component here once designed.
      */}
      <main className="mx-auto max-w-[1280px] px-5 py-32 sm:px-8">
        <p className="t-lead text-fg-2">About page coming soon.</p>
      </main>
    </>
  );
}
