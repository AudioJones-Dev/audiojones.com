// Subject line and HTML body for the /apply notification.
//
// Kept out of apply-notifications.ts — and therefore out of "server-only" —
// so the escaping and the subject construction can be unit-tested without a
// server bundle, the same split used for the row mapping in apply-row.ts.
// Delivery (Resend, webhook, env handling) stays in the notifier.

import { APPLY_OFFERS, type ApplyInput } from "./apply-schema";

export function offerLabel(offerId: string | undefined): string {
  if (!offerId) return "No offer selected";
  return APPLY_OFFERS.find((offer) => offer.id === offerId)?.label ?? offerId;
}

export function applySubject(input: ApplyInput): string {
  const who = input.companyName || input.firstName;
  // Strip CR/LF: the subject is user-influenced, and a newline in a mail
  // header is a header-injection primitive even where the transport encodes
  // it correctly today.
  return `[Application] ${offerLabel(input.offer)} — ${who}`.replace(/[\r\n]+/g, " ");
}

export function renderApplyEmail(leadId: string, input: ApplyInput): string {
  const row = (label: string, value: unknown) =>
    value == null || value === ""
      ? ""
      : `<tr><td style="padding:4px 12px 4px 0;color:#94A3B8;vertical-align:top;">${label}</td><td style="padding:4px 0;">${escapeHtml(String(value))}</td></tr>`;

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#080808;color:#F8FAFC;padding:24px;">
    <h1 style="margin:0 0 8px 0;font-size:20px;">${escapeHtml(offerLabel(input.offer))}</h1>
    <p style="margin:0 0 16px 0;color:#94A3B8;">Application · ID ${escapeHtml(leadId)}</p>
    <table style="border-collapse:collapse;font-size:14px;">
      ${row("Name", `${input.firstName} ${input.lastName ?? ""}`.trim())}
      ${row("Email", input.email)}
      ${row("Phone", input.phone)}
      ${row("Company", input.companyName)}
      ${row("Website", input.website)}
      ${row("Role", input.role)}
      ${row("Revenue", input.annualRevenueRange)}
      ${row("Stage", input.currentGrowthStage)}
      ${row("Team size", input.teamSize)}
      ${row("Constraint", input.primaryConstraint)}
      ${row("Desired outcome", input.desiredOutcome)}
      ${row("Timeline", input.timeline)}
      ${row("Budget", input.budgetRange)}
      ${row("Notes", input.notes)}
      ${row("Came from", input.source)}
      ${row("Campaign", input.utmCampaign)}
      ${row("Content", input.utmContent)}
    </table>
  </div>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
