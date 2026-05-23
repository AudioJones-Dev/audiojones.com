import "server-only";
import type { AppliedIntelligenceLeadInput } from "./lead-schema";
import type { LeadScores } from "./lead-scoring";

type NotifyArgs = {
  leadId: string;
  input: AppliedIntelligenceLeadInput;
  scores: LeadScores;
};

export async function notifyAppliedIntelligenceLead(args: NotifyArgs) {
  await Promise.allSettled([sendEmail(args), sendN8nWebhook(args)]);
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

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
