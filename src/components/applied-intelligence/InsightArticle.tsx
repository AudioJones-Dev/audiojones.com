import type { ReactNode } from "react";
import Link from "next/link";
import { ctaLinks } from "@/config/links";

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export default function InsightArticle({
  eyebrow,
  title,
  intro,
  children,
}: Props) {
  return (
    <article className="bg-[#05070F]">
      <header className="border-b border-white/5 pt-20 pb-12">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C8A96A]">
            {eyebrow}
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg text-slate-300">{intro}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-10 px-5 py-16 text-slate-200 sm:px-8">
        {children}

        <div className="rounded-xl border border-white/10 bg-[#0B1020] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A96A]">
            Apply this
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            Take the Applied Intelligence Diagnostic.
          </p>
          <Link
            href={ctaLinks.signalDiagnostic}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-[#3B5BFF] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5B7AFF]"
          >
            Request Strategic Diagnostic
          </Link>
        </div>
      </div>
    </article>
  );
}
