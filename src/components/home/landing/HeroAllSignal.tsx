import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { ctaLinks } from "@/config/links";

const PORTRAIT =
  "/assets/Homepage/02-hero-all-signal/portrait/hero-portrait-eightee20-society.png";

export default function HeroAllSignal() {
  return (
    <section className="relative overflow-hidden bg-white pb-0 pt-28 text-[#0A0A0A] sm:pt-32 lg:min-h-[860px] lg:pt-36">
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
          <h1 className="mt-7 text-balance font-headline text-[clamp(3rem,6.2vw,6.4rem)] font-bold leading-[0.96] tracking-[-0.045em]">
            You don&apos;t have a growth problem. You have a signal problem.
          </h1>
          <p className="mt-7 max-w-2xl text-xl font-medium leading-8 text-black/70 sm:text-2xl">
            When work, information, decisions, and handoffs become fragmented,
            the business gets harder to run—even when demand is growing.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-7 text-black/65 sm:text-lg sm:leading-8">
            Audio Jones helps founder-led service businesses uncover how work
            actually happens, identify where information, decisions, rules,
            and handoffs break down, and design the operating systems required
            to make the business run reliably.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/55 sm:text-base">
            Those systems may include process redesign, custom applications,
            integrations, automation, AI, business memory, and operational
            measurement.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={ctaLinks.founderIntelligenceDiagnostic}
              variant="primary"
              size="lg"
            >
              Start the Founder Intelligence Diagnostic
            </ButtonLink>
            <ButtonLink
              href="#method"
              variant="secondary"
              size="lg"
              className="border-black/30 text-[#0A0A0A] hover:border-black hover:text-black"
            >
              See How the Method Works
            </ButtonLink>
          </div>
        </div>

        <div className="relative min-h-[410px] sm:min-h-[560px] lg:min-h-[700px]">
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
