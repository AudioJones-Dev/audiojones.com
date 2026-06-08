import Link from "next/link";

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
    <section className="relative isolate overflow-hidden bg-[#05070F] pt-28 pb-24 sm:pt-32 sm:pb-28">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(59,91,255,0.18),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(200,169,106,0.10),transparent_60%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#3B5BFF]/40 to-transparent"
      />
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A96A]">
          {eyebrow}
        </p>
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
          {headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
          {subheadline}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href={primaryCta.href}
            className="inline-flex items-center justify-center rounded-md bg-[#3B5BFF] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(59,91,255,0.7)] transition hover:bg-[#5B7AFF]"
          >
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center rounded-md border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
