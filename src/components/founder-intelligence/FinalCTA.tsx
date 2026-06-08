import { ButtonLink } from "@/components/ui/Button";
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
    <section className="border-t border-border-subtle bg-bg-base py-24">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h2 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
          {headline}
        </h2>
        <p className="mt-4 text-lg text-text-primary">{body}</p>
        <ButtonLink href={ctaHref} variant="primary" size="lg" className="mt-10">
          {ctaLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
