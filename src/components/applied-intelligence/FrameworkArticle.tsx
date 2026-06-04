import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
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
    <article className="bg-bg-base">
      <header className="border-b border-border-subtle pt-20 pb-12">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-signal-yellow">
            {eyebrow}
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg text-text-primary">{intro}</p>
        </div>
      </header>

      <section className="bg-surface-1 py-10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <blockquote className="rounded-xl border-l-4 border-accent-blue bg-surface-2 p-6 text-lg leading-relaxed text-text-primary">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-accent-blue">
              Definition
            </span>
            {definition}
          </blockquote>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-12 px-5 py-16 text-text-primary sm:px-8">
        {children}

        <div className="rounded-xl border border-border-subtle bg-surface-1 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-yellow">
            Next step
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            Apply this to your business in the Strategic Diagnostic.
          </p>
          <ButtonLink
            href={ctaLinks.signalDiagnostic}
            variant="primary"
            size="sm"
            className="mt-4"
          >
            Request Strategic Diagnostic
          </ButtonLink>
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
  return <p className="text-lg leading-relaxed text-text-primary">{children}</p>;
}

export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6 text-text-primary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
