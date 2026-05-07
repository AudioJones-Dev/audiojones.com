import type { ReactNode } from "react";
import Link from "next/link";
import { ctaLinks } from "@/config/links";

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  definition: string;
  children: ReactNode;
};

export default function FrameworkArticle({
  eyebrow,
  title,
  intro,
  definition,
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

      <section className="bg-[#0B1020] py-10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <blockquote className="rounded-xl border-l-4 border-[#3B5BFF] bg-[#101827] p-6 text-lg leading-relaxed text-slate-100">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#3B5BFF]">
              Definition
            </span>
            {definition}
          </blockquote>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-12 px-5 py-16 text-slate-200 sm:px-8">
        {children}

        <div className="rounded-xl border border-white/10 bg-[#0B1020] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A96A]">
            Next step
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            Apply this to your business in the Strategic Diagnostic.
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

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 text-2xl font-semibold text-white sm:text-3xl"
    >
      {children}
    </h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-lg leading-relaxed text-slate-300">{children}</p>;
}

export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6 text-slate-300">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
