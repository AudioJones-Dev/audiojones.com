import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

const PORTRAIT =
  "/assets/Homepage/02-hero-all-signal/portrait/hero-portrait-eightee20-society.png";

export default function HeroAllSignal() {
  return (
    <section className="relative overflow-hidden bg-[#F4F1E9] pb-0 pt-12 text-[#0A0A0A] sm:pt-16 lg:min-h-[720px] lg:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-4rem] top-24 hidden select-none font-headline text-[clamp(7rem,14vw,14rem)] font-bold leading-none tracking-[-0.07em] text-black/[0.05] lg:block"
      >
        ALL SIGNAL
      </div>

      <div className="relative mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="relative z-10 max-w-3xl pb-4 lg:pb-24">
          <p className="inline-flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-[#0A0A0A]">
            <span aria-hidden className="h-2 w-6 rounded-sm bg-signal-yellow" />
            Business systems consulting for founder-led service businesses
          </p>
          <h1 className="mt-7 text-balance font-headline text-[clamp(2.6rem,4.7vw,4.6rem)] font-bold leading-[0.96] tracking-[-0.045em]">
            Find what&apos;s costing you time and sales. Fix that first.
          </h1>
          <p className="mt-7 max-w-2xl text-xl font-medium leading-8 text-black/70 sm:text-2xl">
            Missed leads. Stuck jobs. A team that needs you for every next step.
            Find the gap that hurts most, then build a better way to work.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/70 sm:text-lg">
            Audio Jones helps you find the cause. AJ Digital builds the agreed
            fix, so your team has clear steps, shared facts, and less to chase.
          </p>
          <div className="mt-9 flex flex-col items-start gap-4">
            <ButtonLink
              href="/founder-intelligence/diagnostic"
              variant="glow"
              size="lg"
            >
              Request a Diagnostic
            </ButtonLink>
            <ButtonLink
              href="#process"
              variant="ghost"
              size="lg"
              className="!text-[#080808] underline underline-offset-4"
            >
              How it works
            </ButtonLink>
          </div>
          <p className="mt-5 text-sm leading-6 text-black/70">Start with six steps about your business. This is a request for review, not an instant report.</p>
        </div>

        <div className="relative min-h-[300px] sm:min-h-[480px] lg:min-h-[580px]">
          <div
            aria-hidden
            className="absolute bottom-8 left-1/2 h-20 w-2/3 -translate-x-1/2 rounded-full bg-black/20 blur-2xl"
          />
          <Image
            src={PORTRAIT}
            alt="Audio Jones"
            fill
            priority
            className="object-contain object-bottom"
            sizes="(max-width: 1024px) 92vw, 48vw"
          />
        </div>
      </div>
    </section>
  );
}
