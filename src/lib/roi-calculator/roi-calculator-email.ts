import "server-only";

import { readCappedBody } from "@/lib/notifications/safe-body";

import { ctaLinks } from "@/config/links";
import { SITE_URL } from "@/lib/founder-intelligence/tokens";
import type { RoiLeadInput } from "./roi-calculator-schema";
import type { RevenueLeakScorecardInput, RevenueLeakScorecardResult } from "./types";
import { getPreset } from "./presets";

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

// Bound the request. A downstream that accepts the connection and then
// stalls would otherwise hold the deferred `after` task open until the
// platform kills it, taking the client's result email with it.
const EMAIL_TIMEOUT_MS = 10_000;

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
    signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
  });

  if (!response.ok) {
    // `response.text()` buffers the whole body before any slice, so a large
    // or non-terminating error body could exhaust memory or hold the
    // deferred `after` task open. readCappedBody stops at the limit.
    const errBody = await readCappedBody(response);
    throw new Error(`Resend returned ${response.status}${errBody ? `: ${errBody}` : ""}`);
  }
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
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#080808;color:#F8FAFC;padding:24px;">
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
        row("Leads/month", input.leadsPerMonth),
        row("Average deal value", `$${input.averageDealValue}`),
        row("Current close rate", `${input.currentCloseRate}%`),
        row("Speed-to-lead lift", `${input.speedToLeadLift}%`),
        row("Errors/month", input.errorsPerMonth),
        row("Cost per error", `$${input.costPerError}`),
        row("Preventable error rate", `${input.preventableErrorRate}%`),
        row("Owner hours/week", input.ownerHoursPerWeek),
        row("Owner hourly value", `$${input.ownerHourlyValue}`),
        row("Owner recoverable rate", `${input.ownerRecoverableRate}%`),
        row("Avoided hire monthly cost", `$${input.avoidedHireMonthlyCost}`),
        row("Headcount avoidance rate", `${input.headcountAvoidanceRate}%`),
        row("Budget", `$${input.implementationBudget}`),
        row("Timeline", input.timelineExpectation),
        row("Owner/readiness", input.internalOwner),
        row("Context", input.message),
        row("Source", lead.source),
      ].join("")}</table>
      <h2 style="margin:20px 0 8px 0;">Result</h2>
      <table style="border-collapse:collapse;font-size:14px;">${[
        row("Monthly recovery", money(result.monthlySavings)),
        row("Annual recovery", money(result.annualSavings)),
        row("Payback", result.paybackMonths ? `${result.paybackMonths} months` : "Needs budget estimate"),
        row("Readiness score", `${result.readinessScore}/100`),
        row("Priority score", `${result.priorityScore}/100`),
        row("Confidence", result.confidenceTier),
        row("Recommendation", result.recommendation),
        row("Next action", result.recommendedNextAction),
      ].join("")}</table>
      <h2 style="margin:20px 0 8px 0;">Operational waste recovery levers</h2>
      <table style="border-collapse:collapse;font-size:14px;">${[
        row("Manual labor recovery", money(result.savingsBreakdown.manualLaborRecovery)),
        row("Revenue recovery", money(result.savingsBreakdown.revenueRecovery)),
        row("Error reduction", money(result.savingsBreakdown.errorReduction)),
        row("Owner capacity unlocked", money(result.savingsBreakdown.ownerCapacityUnlocked)),
        row("Headcount avoidance", money(result.savingsBreakdown.headcountAvoidance)),
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
  const subject = `Your Operational Waste Recovery Signal — ${result.recommendation}`;
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#080808;color:#F8FAFC;padding:24px;line-height:1.6;">
      <p style="margin:0 0 12px 0;color:#E8FF5A;text-transform:uppercase;letter-spacing:.08em;font-size:12px;">Audio Jones · Operational Waste Recovery</p>
      <h1 style="margin:0 0 12px 0;">${escapeHtml(input.name)}, here is the short version.</h1>
      <p style="margin:0 0 18px 0;color:#CBD5E1;">Your workflow shows an estimated ${escapeHtml(money(result.annualSavings))} in annual operational waste recovery with a ${escapeHtml(result.confidenceTier.toLowerCase())} confidence tier.</p>
      <div style="border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;background:#161616;">
        <p><strong>Readiness:</strong> ${escapeHtml(result.readinessScore)}/100</p>
        <p><strong>Estimated monthly recovery:</strong> ${escapeHtml(money(result.monthlySavings))}</p>
        <p><strong>Estimated payback:</strong> ${escapeHtml(result.paybackMonths ? `${result.paybackMonths} months` : "needs a budget estimate")}</p>
        <p><strong>Recommended next action:</strong> ${escapeHtml(result.recommendedNextAction)}</p>
      </div>
      <p style="margin:18px 0 8px 0;color:#CBD5E1;"><strong>Where the recovery comes from:</strong></p>
      <ul style="margin:0 0 18px 18px;padding:0;color:#CBD5E1;">
        <li>Manual labor recovery — ${escapeHtml(money(result.savingsBreakdown.manualLaborRecovery))}/mo</li>
        <li>Revenue recovery — ${escapeHtml(money(result.savingsBreakdown.revenueRecovery))}/mo</li>
        <li>Error reduction — ${escapeHtml(money(result.savingsBreakdown.errorReduction))}/mo</li>
        <li>Owner capacity unlocked — ${escapeHtml(money(result.savingsBreakdown.ownerCapacityUnlocked))}/mo</li>
        <li>Headcount avoidance — ${escapeHtml(money(result.savingsBreakdown.headcountAvoidance))}/mo</li>
      </ul>
      <p style="margin:18px 0;color:#CBD5E1;">This is directional, not a promise. We do not calculate AI hype — we calculate operational waste recovery. The next step is to separate true workflow signal from noise before adding another tool.</p>
      <p><a href="${ctaLinks.signalDiagnostic}" style="color:#E8FF5A;font-weight:700;">Take the Signal Diagnostic</a></p>
      <p style="margin-top:24px;color:#94A3B8;font-size:12px;">Reference ID: ${escapeHtml(leadId)}</p>
    </div>`;

  try {
    return await sendResendEmail({ to: lead.email, subject, html });
  } catch (error) {
    console.error("[roi-calculator] client email failed", { leadId, error });
    return "failed";
  }
}

/* ------------------------------------------------------------------------ */
/* V2 — Revenue Leak Scorecard                                               */
/* ------------------------------------------------------------------------ */

type ScorecardSendArgs = {
  leadId: string;
  input: RevenueLeakScorecardInput;
  result: RevenueLeakScorecardResult;
  submittedAt: string;
  source?: string;
};

const SCORECARD_DISCLAIMER =
  "These estimates are scenario-based economic models, not guarantees of savings, revenue, bookings, or profit. Actual outcomes depend on lead quality, implementation quality, staffing, customer demand, business operations, pricing, margins, market conditions, and execution.";

function range(result: RevenueLeakScorecardResult) {
  const { low, high } = result.modeledOpportunityRange;
  return `${money(low)}–${money(high)}/year`;
}

function hoursLabel(value: number) {
  return `${value} h/week`;
}

/**
 * Concise agency summary: the fields a person needs before a diagnostic
 * call. The full input and result payloads are on the persisted row, not in
 * the inbox.
 */
export async function sendAgencyScorecardNotification({ leadId, input, result, submittedAt, source }: ScorecardSendArgs): Promise<RoiEmailStatus> {
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  if (!to) return "skipped";

  const subject = `[Revenue Leak Scorecard] ${input.company} — ${result.primaryLeakageScenario} — ${result.recommendation}`;
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#080808;color:#F8FAFC;padding:24px;">
      <h1 style="margin:0 0 8px 0;">Revenue Leak Scorecard</h1>
      <p style="margin:0 0 18px 0;color:#94A3B8;">ID ${escapeHtml(leadId)} · Submitted ${escapeHtml(submittedAt)} · ${escapeHtml(result.calculationVersion)}</p>
      <table style="border-collapse:collapse;font-size:14px;">${[
        row("Company", input.company),
        row("Contact", `${input.name} · ${input.email}${input.phone ? ` · ${input.phone}` : ""}`),
        row("Location", `${input.zipCode} · ${result.geography.label}`),
        row("Industry", input.industry),
        row("Company size", input.companySize),
        row("Monthly revenue", input.monthlyRevenue),
        row("Operational hours/week", hoursLabel(result.laborCapacity.hoursPerWeek + result.ownerCapacity.hoursPerWeek)),
        row("Addressable hours/week", hoursLabel(result.laborCapacity.addressableHoursPerWeek + result.ownerCapacity.addressableHoursPerWeek)),
        row("Estimated annual labor capacity", `${money(result.laborCapacity.annualAddressableLaborValue)} addressable of ${money(result.laborCapacity.annualCurrentLaborValue)}`),
        row("Estimated annual revenue leakage", money(result.revenueLeakage.total)),
        row("Conversion opportunity", money(result.conversionOpportunity.total)),
        row("Owner capacity", `${hoursLabel(result.ownerCapacity.addressableHoursPerWeek)} · ${money(result.ownerCapacity.replacementCostValue)} replacement cost`),
        row("Modeled opportunity range", range(result)),
        row("Primary leakage scenario", result.primaryLeakageScenario),
        row("Gross profit basis", result.economics.grossProfitBasis),
        row("Leakage input basis", input.leakage.inputBasis),
        row("Benchmark tier", result.geography.tier),
        row("Confidence", `${result.confidenceTier} — ${result.confidenceReasons.join(" ")}`),
        row("Readiness / priority", `${result.readinessScore}/100 · ${result.priorityScore}/100`),
        row("Recommendation", result.recommendation),
        row("Recommended next action", result.recommendedNextAction),
        row("Timeline", input.timelineExpectation),
        row("Context", input.message),
        row("Source", source ?? "roi-calculator-page"),
      ].join("")}</table>
    </div>`;

  try {
    return await sendResendEmail({ to, subject, html });
  } catch (error) {
    console.error("[roi-calculator] agency scorecard email failed", { leadId, error });
    return "failed";
  }
}

export async function sendClientScorecardResult({ leadId, input, result }: ScorecardSendArgs): Promise<RoiEmailStatus> {
  const preset = getPreset(result.preset);
  const subject = `Your Revenue Leak Scorecard — ${result.primaryLeakageScenario === "None identified" ? result.recommendation : result.primaryLeakageScenario}`;
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#080808;color:#F8FAFC;padding:24px;line-height:1.6;">
      <p style="margin:0 0 12px 0;color:#E8FF5A;text-transform:uppercase;letter-spacing:.08em;font-size:12px;">Audio Jones · Revenue Leak Scorecard</p>
      <h1 style="margin:0 0 12px 0;">${escapeHtml(input.name)}, here is the short version.</h1>
      <p style="margin:0 0 18px 0;color:#CBD5E1;">Modeled economic opportunity of ${escapeHtml(range(result))}, priced against the ${escapeHtml(result.geography.label)} labor market, at ${escapeHtml(result.confidenceTier.toLowerCase())} confidence.</p>
      <div style="border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;background:#161616;">
        <p><strong>Operational labor exposure:</strong> ${escapeHtml(money(result.laborCapacity.annualCurrentLaborValue))}/year</p>
        <p><strong>Addressable operational capacity:</strong> ${escapeHtml(money(result.laborCapacity.annualAddressableLaborValue))}/year · ${escapeHtml(hoursLabel(result.laborCapacity.addressableHoursPerWeek))}</p>
        <p><strong>Revenue leakage opportunity:</strong> ${escapeHtml(money(result.revenueLeakage.total))}/year</p>
        <p><strong>Conversion opportunity:</strong> ${escapeHtml(money(result.conversionOpportunity.total))}/year</p>
        <p><strong>Owner capacity:</strong> ${escapeHtml(hoursLabel(result.ownerCapacity.addressableHoursPerWeek))} potentially redirected</p>
        <p><strong>Primary leak:</strong> ${escapeHtml(result.primaryLeakageScenario)}</p>
        <p><strong>Recommended next action:</strong> ${escapeHtml(result.recommendedNextAction)}</p>
      </div>
      <p style="margin:18px 0 8px 0;color:#CBD5E1;"><strong>Revenue leakage breakdown:</strong></p>
      <ul style="margin:0 0 18px 18px;padding:0;color:#CBD5E1;">
        <li>Missed calls — ${escapeHtml(money(result.revenueLeakage.missedCalls))}/yr</li>
        <li>After-hours demand — ${escapeHtml(money(result.revenueLeakage.afterHours))}/yr</li>
        <li>Quote follow-up — ${escapeHtml(money(result.revenueLeakage.quoteFollowup))}/yr</li>
        <li>Delayed response — ${escapeHtml(money(result.conversionOpportunity.speedToLead))}/yr</li>
      </ul>
      <p style="margin:18px 0;color:#94A3B8;font-size:13px;">${escapeHtml(SCORECARD_DISCLAIMER)}</p>
      <p><a href="${escapeHtml(`${SITE_URL}${preset.cta.href}`)}" style="color:#E8FF5A;font-weight:700;">${escapeHtml(preset.cta.label)}</a></p>
      <p style="margin:6px 0 0 0;color:#CBD5E1;">${escapeHtml(preset.cta.support)}</p>
      <p style="margin-top:24px;color:#94A3B8;font-size:12px;">Reference ID: ${escapeHtml(leadId)}</p>
    </div>`;

  try {
    return await sendResendEmail({ to: input.email, subject, html });
  } catch (error) {
    console.error("[roi-calculator] client scorecard email failed", { leadId, error });
    return "failed";
  }
}
