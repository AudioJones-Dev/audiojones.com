import { ButtonLink } from "@/components/ui/Button";

type Cta = { label: string; href: string };

type Props = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
};

export default function SignalHero({
  eyebrow,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
}: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-bg-base pt-28 pb-24 sm:pt-32 sm:pb-28">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(77,172,255,0.18),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(232,255,90,0.10),transparent_60%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent"
      />
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-signal-yellow">
          {eyebrow}
        </p>
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
          {headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-text-primary sm:text-xl">
          {subheadline}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink href={primaryCta.href} variant="primary">
            {primaryCta.label}
          </ButtonLink>
          {secondaryCta && (
            <ButtonLink href={secondaryCta.href} variant="secondary">
              {secondaryCta.label}
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
