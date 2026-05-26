import "server-only";
import { siteConfig } from "@/lib/site";
import type { AppliedIntelligenceLeadInput } from "./lead-schema";
import type { LeadScores } from "./lead-scoring";

type NotifyArgs = {
  leadId: string;
  input: AppliedIntelligenceLeadInput;
  scores: LeadScores;
};

export async function notifyAppliedIntelligenceLead(args: NotifyArgs) {
  await Promise.allSettled([
    sendEmail(args),
    sendClientDiagnosticReport(args),
    sendN8nWebhook(args),
  ]);
}

// Warn-once guard so a misconfigured deploy emits a single visible signal
// instead of one line per submission. Module-scoped — resets per cold start,
// which is fine: it's a deployment-config smell, not a per-request alert.
let emailEnvWarned = false;

async function sendEmail({ leadId, input, scores }: NotifyArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.FROM_EMAIL || "Audio Jones <noreply@audiojones.com>";
  if (!apiKey || !to) {
    if (!emailEnvWarned) {
      emailEnvWarned = true;
      console.warn(
        "[applied-intelligence] internal notification skipped: email env missing",
        {
          hasResendApiKey: Boolean(apiKey),
          hasLeadNotificationEmail: Boolean(to),
        },
      );
    }
    return;
  }

  const subject = `[${scores.priority.toUpperCase()}] Applied Intelligence lead: ${input.firstName} (${scores.totalScore})`;
  const html = renderEmail({ leadId, input, scores });

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
  } catch (err) {
    console.error("[applied-intelligence] email notification failed", err);
  }
}

async function sendN8nWebhook({ leadId, input, scores }: NotifyArgs) {
  const url = process.env.N8N_LEAD_WEBHOOK_URL || process.env.CRM_WEBHOOK_URL;
  if (!url) return;

  const payload = {
    event: "applied_intelligence_lead_created",
    lead: {
      id: leadId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      companyName: input.companyName,
      website: input.website,
      role: input.role,
      annualRevenueRange: input.annualRevenueRange,
      primaryConstraint: input.primaryConstraint,
      timeline: input.timeline,
      totalScore: scores.totalScore,
      priority: scores.priority,
    },
    scores,
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[applied-intelligence] n8n webhook failed", err);
  }
}

async function sendClientDiagnosticReport({ leadId, input, scores }: NotifyArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || "Audio Jones <noreply@audiojones.com>";
  if (!apiKey) return;

  const subject = "Your Audio Jones AI Readiness Diagnostic";
  const html = renderClientReport({ leadId, input, scores });

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from, to: input.email, subject, html }),
    });
  } catch (err) {
    console.error("[applied-intelligence] client report email failed", err);
  }
}

function renderEmail({ leadId, input, scores }: NotifyArgs) {
  const row = (label: string, value: unknown) =>
    value == null || value === ""
      ? ""
      : `<tr><td style="padding:4px 12px 4px 0;color:#94A3B8;">${label}</td><td style="padding:4px 0;">${escape(String(value))}</td></tr>`;

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#05070F;color:#F8FAFC;padding:24px;">
    <h1 style="margin:0 0 8px 0;">${scores.priority.toUpperCase()} priority lead</h1>
    <p style="margin:0 0 16px 0;color:#94A3B8;">Total score ${scores.totalScore} / 100 · ID ${leadId}</p>
    <table style="border-collapse:collapse;font-size:14px;">
      ${row("Name", `${input.firstName} ${input.lastName ?? ""}`.trim())}
      ${row("Email", input.email)}
      ${row("Phone", input.phone)}
      ${row("Company", input.companyName)}
      ${row("Website", input.website)}
      ${row("Role", input.role)}
      ${row("Revenue", input.annualRevenueRange)}
      ${row("Constraint", input.primaryConstraint)}
      ${row("Timeline", input.timeline)}
      ${row("Budget", input.budgetRange)}
      ${row("Desired outcome", input.desiredOutcome)}
      ${row("Biggest pain", input.biggestPain)}
      ${row("ICP fit", scores.icpFitScore)}
      ${row("Signal", scores.signalScore)}
      ${row("AI readiness", scores.aiReadinessScore)}
      ${row("Attribution", scores.attributionScore)}
    </table>
  </div>`;
}

function renderClientReport({ leadId, input, scores }: NotifyArgs) {
  const absolute = (path: string) => `${siteConfig.url}${path}`;
  const row = (label: string, value: unknown) =>
    value == null || value === ""
      ? ""
      : `<tr><td style="padding:6px 14px 6px 0;color:#94A3B8;vertical-align:top;">${escape(String(label))}</td><td style="padding:6px 0;color:#F8FAFC;">${escape(String(value))}</td></tr>`;

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#05070F;color:#F8FAFC;padding:24px;line-height:1.6;">
    <p style="margin:0 0 12px 0;color:#E8FF5A;text-transform:uppercase;letter-spacing:.08em;font-size:12px;">Audio Jones AI Readiness Diagnostic</p>
    <h1 style="margin:0 0 12px 0;">${escape(input.firstName)}, your diagnostic was received.</h1>
    <p style="margin:0 0 18px 0;color:#CBD5E1;">Your current signal score is ${scores.totalScore}/100 with a ${escape(scores.priority)} priority routing signal. This is a directional diagnostic, not a promise of outcome.</p>
    <div style="border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;background:#0B1020;">
      <table style="border-collapse:collapse;font-size:14px;">
        ${row("Primary constraint", input.primaryConstraint)}
        ${row("Desired outcome", input.desiredOutcome)}
        ${row("Timeline", input.timeline)}
        ${row("Signal score", `${scores.totalScore}/100`)}
        ${row("AI readiness", `${scores.aiReadinessScore}/100`)}
        ${row("Attribution clarity", `${scores.attributionScore}/100`)}
      </table>
    </div>
    <p style="margin:18px 0;color:#CBD5E1;">The useful next step is to separate the true operating constraint from the visible symptoms before buying another tool or automation.</p>
    <p style="margin:0 0 8px 0;"><a href="${absolute("/book-a-call")}" style="color:#E8FF5A;font-weight:700;">Schedule a diagnostic call</a></p>
    <p style="margin:0;"><a href="${absolute("/insights")}" style="color:#4DACFF;font-weight:700;">Read the frameworks while you wait</a></p>
    <p style="margin-top:24px;color:#94A3B8;font-size:12px;">Reference ID: ${escape(leadId)}</p>
  </div>`;
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
