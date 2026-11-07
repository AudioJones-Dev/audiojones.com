import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { ButtonLink } from "@/components/ui/Button";
import { clientCaseStudies } from "@/data/audiojones-design";

type Stat = {
  metric: string;
  label: string;
};

type HeroProps = {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  stats?: readonly Stat[];
  children?: React.ReactNode;
};

type SectionIntroProps = {
  label: string;
  title: string;
  description?: string;
};

export function SignalHero({
  title,
  description,
  primaryHref = "/book-a-call",
  primaryLabel = "Book a Call",
  secondaryHref = "/founder-intelligence/diagnostic",
  secondaryLabel = "Start the Diagnostic",
  stats,
  children,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line-2)] bg-[var(--aj-gradient-dark)] py-20 sm:py-28 lg:py-32">
      <div className="aj-noise-overlay" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-60" aria-hidden />
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="max-w-4xl">
          <h1 className="max-w-full break-words font-accent text-[clamp(2.55rem,9vw,5.6rem)] font-bold leading-[0.96] tracking-[-0.025em] text-fg-0 sm:tracking-[-0.045em]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fg-2 sm:text-xl">
            {description}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={primaryHref} variant="glow">
              {primaryLabel}
            </ButtonLink>
            <ButtonLink href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </ButtonLink>
          </div>
          {stats ? (
            <dl className="mt-12 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.metric} className="aj-product-card">
                  <dt className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
                    {stat.metric}
                  </dt>
                  <dd className="mt-3 text-sm leading-6 text-fg-2">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        <div className="min-w-0">{children ?? <ClientProofCard />}</div>
      </div>
    </section>
  );
}

export function SectionIntro({ label, title, description }: SectionIntroProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-amber)]">
        {label}
      </p>
      <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-fg-0">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-lg leading-8 text-fg-2">{description}</p>
      ) : null}
    </div>
  );
}

export function ClientProofCard() {
  const study = clientCaseStudies[0];
  return (
    <div className="aj-card-signal">
      <div className="aj-card-inner">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-fg-3">Client result</p>
          <Image
            src={study.logo.src}
            alt={study.client}
            width={study.logo.width}
            height={study.logo.height}
            className="h-9 w-auto"
          />
        </div>
        <div className="mt-6 grid gap-3">
          <div className="rounded-xl border border-[var(--line-1)] bg-[rgba(5,7,15,0.62)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-fg-3">Before</p>
            <p className="mt-1 font-accent text-2xl font-bold text-[var(--aj-orange)]">{study.before}</p>
          </div>
          <div className="rounded-xl border border-[var(--line-1)] bg-[rgba(5,7,15,0.62)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-fg-3">After</p>
            <p className="mt-1 font-accent text-2xl font-bold text-[var(--aj-success)]">{study.after}</p>
          </div>
        </div>
        <figure className="mt-6">
          <blockquote className="text-lg leading-8 text-fg-0">
            &ldquo;{study.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-3 text-sm text-fg-2">{study.quoteBy}</figcaption>
        </figure>
        <Link
          href={`/case-studies#${study.slug}`}
          className="mt-4 inline-block text-sm text-fg-2 underline underline-offset-4 hover:text-signal-yellow"
        >
          Read the case study
        </Link>
      </div>
    </div>
  );
}

export function DarkSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-bg-0 py-16 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function LightProofSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`aj-bg-grid-light py-16 text-[#101827] sm:py-24 ${className}`}>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function FinalCta({
  title,
  description,
  primaryLabel = "Book a Call",
  primaryHref = "/book-a-call",
  secondaryLabel = "Start the Diagnostic",
  secondaryHref = "/founder-intelligence/diagnostic",
}: {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-[var(--line-2)] bg-[var(--aj-gradient-dark)] py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-[900px] px-5 text-center sm:px-8">
        <h2 className="font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-fg-0">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-fg-2">
          {description}
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={primaryHref} variant="glow">
            {primaryLabel}
          </ButtonLink>
          <ButtonLink href={secondaryHref} variant="secondary">
            {secondaryLabel}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function ProductCard({
  title,
  description,
  meta,
  href,
}: {
  title: string;
  description: string;
  meta?: string;
  href?: string;
}) {
  const content = (
    <div className="aj-card-signal h-full">
      <div className="aj-card-inner flex h-full flex-col">
        {meta ? (
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
            {meta}
          </p>
        ) : null}
        <h3 className="mt-3 font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
          {title}
        </h3>
        <p className="mt-4 flex-1 text-sm leading-7 text-fg-2">{description}</p>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}
