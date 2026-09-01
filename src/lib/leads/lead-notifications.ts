import "server-only";
import type { FounderIntelligenceLeadInput } from "./lead-schema";
import type { LeadScores } from "./lead-scoring";

type NotifyArgs = {
  leadId: string;
  input: FounderIntelligenceLeadInput;
  scores: LeadScores;
};

export async function notifyFounderIntelligenceLead(args: NotifyArgs) {
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
        "[founder-intelligence] internal notification skipped: email env missing",
        {
          hasResendApiKey: Boolean(apiKey),
          hasLeadNotificationEmail: Boolean(to),
        },
      );
    }
    return;
  }

  const subject = `[${scores.priority.toUpperCase()}] Founder Intelligence lead: ${input.firstName} (${scores.totalScore})`;
  const html = renderEmail({ leadId, input, scores });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    // fetch only rejects on a transport failure. A bad API key, an
    // unverified sender or a rate limit all come back as a resolved 4xx,
    // which without this check looks exactly like a delivered email.
    if (!res.ok) {
      console.error("[founder-intelligence] email notification rejected", {
        status: res.status,
        body: await safeBody(res),
        leadId,
      });
    }
  } catch (err) {
    console.error("[founder-intelligence] email notification failed", err);
  }
}

// Read a failed response for the log without letting the read itself throw
// and mask the status being reported.
async function safeBody(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 500);
  } catch {
    return "<unreadable>";
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
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Same reasoning as the email call: a rejecting or misconfigured
    // downstream returns a resolved 4xx/5xx, not a thrown error.
    if (!res.ok) {
      console.error("[founder-intelligence] n8n webhook rejected", {
        status: res.status,
        body: await safeBody(res),
        leadId,
      });
    }
  } catch (err) {
    console.error("[founder-intelligence] n8n webhook failed", err);
  }
}

function renderEmail({ leadId, input, scores }: NotifyArgs) {
  const row = (label: string, value: unknown) =>
    value == null || value === ""
      ? ""
      : `<tr><td style="padding:4px 12px 4px 0;color:#94A3B8;">${label}</td><td style="padding:4px 0;">${escape(String(value))}</td></tr>`;

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#080808;color:#F8FAFC;padding:24px;">
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
