import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-0 text-fg-0 flex items-center justify-center">
      <div className="text-center space-y-6 px-6 max-w-2xl">
        <div className="space-y-3">
          <Eyebrow tone="gold">404 — signal lost</Eyebrow>
          <h1 className="t-h1">Page not found</h1>
          <p className="t-lead text-fg-2 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <ButtonLink href="/" variant="glow" size="md">
            Back to home
          </ButtonLink>
          <Link
            href="/insights"
            className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--line-2)] px-5 t-body text-fg-1 hover:border-[var(--line-3)] hover:text-fg-0 transition-colors"
          >
            Browse insights
          </Link>
        </div>
      </div>
    </div>
  );
}
