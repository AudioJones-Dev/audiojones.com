import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
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

      <div className="mx-auto max-w-3xl space-y-10 px-5 py-16 text-text-primary sm:px-8">
        {children}

        <div className="rounded-xl border border-border-subtle bg-surface-1 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-yellow">
            Apply this
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            Take the Applied Intelligence Diagnostic.
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
