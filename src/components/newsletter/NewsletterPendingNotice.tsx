/**
 * Visual strip displayed alongside the form when the newsletter
 * integration is in mock/pending mode. Transparent acknowledgment
 * without making the user worry — direct, framework-driven, not
 * apologetic.
 */
export default function NewsletterPendingNotice({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      role="status"
      className={[
        "rounded-md border border-[var(--line-gold)]",
        "bg-[rgba(200,169,106,0.04)] px-4 py-3",
        "t-small text-fg-2",
        "italic",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      Subscriptions are in offline confirmation mode while a backend
      integration is finalized. Your address is captured; the live
      welcome sequence resumes within a day.
    </div>
  );
}
