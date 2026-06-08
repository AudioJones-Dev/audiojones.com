import Link from "next/link";
import { ctaLinks } from "@/config/links";

type Props = {
  headline?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function FinalCTA({
  headline = "Stop scaling noise.",
  body = "Build the system that scales judgment instead.",
  ctaLabel = "Request Strategic Diagnostic",
  ctaHref = ctaLinks.signalDiagnostic,
}: Props) {
  return (
    <section className="border-t border-white/10 bg-[#05070F] py-24">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h2 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
          {headline}
        </h2>
        <p className="mt-4 text-lg text-slate-300">{body}</p>
        <Link
          href={ctaHref}
          className="mt-10 inline-flex items-center justify-center rounded-md bg-[#3B5BFF] px-8 py-4 text-sm font-semibold text-white shadow-[0_12px_50px_-10px_rgba(59,91,255,0.8)] transition hover:bg-[#5B7AFF]"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
