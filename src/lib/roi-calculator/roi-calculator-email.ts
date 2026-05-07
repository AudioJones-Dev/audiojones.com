import "server-only";

import { ctaLinks } from "@/config/links";
import type { RoiLeadInput } from "./roi-calculator-schema";

export type RoiEmailStatus = "sent" | "skipped" | "failed";

type SendArgs = {
  leadId: string;
  lead: RoiLeadInput;
  submittedAt: string;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

async function sendResendEmail(payload: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || process.env.RESEND_FROM_EMAIL || "Audio Jones <noreply@audiojones.com>";
  if (!apiKey) return "skipped" satisfies RoiEmailStatus;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ from, ...payload }),
  });

  if (!response.ok) throw new Error(`Resend returned ${response.status}`);
  return "sent" satisfies RoiEmailStatus;
}

function row(label: string, value: unknown) {
  if (value == null || value === "") return "";
  return `<tr><td style="padding:6px 14px 6px 0;color:#94A3B8;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#F8FAFC;">${escapeHtml(value)}</td></tr>`;
}

export async function sendAgencyRoiNotification({ leadId, lead, submittedAt }: SendArgs): Promise<RoiEmailStatus> {
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  if (!to) return "skipped";

  const { input, result } = lead;
  const subject = `[ROI Calc] ${input.industry} / ${input.companySize} — ${result.recommendation}`;
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#05070F;color:#F8FAFC;padding:24px;">
      <h1 style="margin:0 0 8px 0;">ROI Calculator lead</h1>
      <p style="margin:0 0 18px 0;color:#94A3B8;">ID ${escapeHtml(leadId)} · Submitted ${escapeHtml(submittedAt)}</p>
      <h2 style="margin:20px 0 8px 0;">Lead</h2>
      <table style="border-collapse:collapse;font-size:14px;">${[
        row("Name", input.name),
        row("Email", input.email),
        row("Company", input.company),
        row("Phone", input.phone),
        row("Industry", input.industry),
        row("Company size", input.companySize),
        row("Monthly revenue", input.monthlyRevenue),
        row("Workflow", input.workflowType),
        row("Frequency", input.taskFrequency),
        row("Hours/week", input.hoursPerWeek),
        row("Hourly cost", `$${input.hourlyCost}`),
        row("Rework cost", `$${input.monthlyReworkCost}`),
        row("Delay pain", input.delayPain),
        row("Budget", `$${input.implementationBudget}`),
        row("Timeline", input.timelineExpectation),
        row("Owner/readiness", input.internalOwner),
        row("Context", input.message),
        row("Source", lead.source),
      ].join("")}</table>
      <h2 style="margin:20px 0 8px 0;">Result</h2>
      <table style="border-collapse:collapse;font-size:14px;">${[
        row("Monthly savings", money(result.monthlySavings)),
        row("Annual savings", money(result.annualSavings)),
        row("Payback", result.paybackMonths ? `${result.paybackMonths} months` : "Needs budget estimate"),
        row("Readiness score", `${result.readinessScore}/100`),
        row("Priority score", `${result.priorityScore}/100`),
        row("Confidence", result.confidenceTier),
        row("Recommendation", result.recommendation),
        row("Next action", result.recommendedNextAction),
      ].join("")}</table>
    </div>`;

  try {
    return await sendResendEmail({ to, subject, html });
  } catch (error) {
    console.error("[roi-calculator] agency email failed", { leadId, error });
    return "failed";
  }
}

export async function sendClientRoiResult({ leadId, lead }: SendArgs): Promise<RoiEmailStatus> {
  const { input, result } = lead;
  const subject = `Your AI ROI Diagnostic — ${result.recommendation}`;
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#05070F;color:#F8FAFC;padding:24px;line-height:1.6;">
      <p style="margin:0 0 12px 0;color:#C8A96A;text-transform:uppercase;letter-spacing:.08em;font-size:12px;">Audio Jones ROI Diagnostic</p>
      <h1 style="margin:0 0 12px 0;">${escapeHtml(input.name)}, here is the short version.</h1>
      <p style="margin:0 0 18px 0;color:#CBD5E1;">Your workflow shows an estimated ${escapeHtml(money(result.annualSavings))} in annual savings potential with a ${escapeHtml(result.confidenceTier.toLowerCase())} confidence tier.</p>
      <div style="border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;background:#0B1020;">
        <p><strong>Readiness:</strong> ${escapeHtml(result.readinessScore)}/100</p>
        <p><strong>Estimated monthly savings:</strong> ${escapeHtml(money(result.monthlySavings))}</p>
        <p><strong>Estimated payback:</strong> ${escapeHtml(result.paybackMonths ? `${result.paybackMonths} months` : "needs a budget estimate")}</p>
        <p><strong>Recommended next action:</strong> ${escapeHtml(result.recommendedNextAction)}</p>
      </div>
      <p style="margin:18px 0;color:#CBD5E1;">This is directional, not a promise. The next step is to separate true workflow signal from operational noise before investing in automation.</p>
      <p><a href="${ctaLinks.signalDiagnostic}" style="color:#FF6A30;font-weight:700;">Take the Signal Diagnostic</a></p>
      <p style="margin-top:24px;color:#94A3B8;font-size:12px;">Reference ID: ${escapeHtml(leadId)}</p>
    </div>`;

  try {
    return await sendResendEmail({ to: lead.email, subject, html });
  } catch (error) {
    console.error("[roi-calculator] client email failed", { leadId, error });
    return "failed";
  }
}
