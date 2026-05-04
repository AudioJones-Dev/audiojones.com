import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Inline success state — replaces the form in place, no page redirect.
 * Used in both default (homepage final CTA) and inline (footer) variants.
 */
export default function NewsletterSuccess({
  variant = "default",
  email,
}: {
  variant?: "default" | "inline";
  email?: string;
}) {
  if (variant === "inline") {
    return (
      <p
        role="status"
        aria-live="polite"
        className="t-small text-fg-1"
      >
        <span className="font-semibold text-aj-blue-bright">Subscribed.</span>{" "}
        Watch your inbox for the next signal.
      </p>
    );
  }
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-2">
      <Eyebrow tone="blue">Subscribed</Eyebrow>
      <p className="t-lead text-fg-1">
        You&apos;re in. Watch your inbox for the next signal.
      </p>
      {email && (
        <p className="t-small text-fg-3">
          Confirmation queued for <span className="font-medium text-fg-1">{email}</span>.
        </p>
      )}
    </div>
  );
}
