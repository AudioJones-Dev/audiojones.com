import "server-only";
import type { PilotApplicationInput } from "./pilot-schema";

type NotifyArgs = {
  applicationId: string;
  input: PilotApplicationInput;
};

export async function notifyPilotApplication(args: NotifyArgs) {
  await Promise.allSettled([sendEmail(args), sendN8nWebhook(args)]);
}

async function sendEmail({ applicationId, input }: NotifyArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.FROM_EMAIL || "Audio Jones <noreply@audiojones.com>";
  if (!apiKey || !to) return;

  const subject = `[PILOT] Founder Intelligence Systems Pilot application: ${input.name} (${input.businessName})`;
  const html = renderEmail({ applicationId, input });

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
    console.error("[pilot] email notification failed", err);
  }
}

async function sendN8nWebhook({ applicationId, input }: NotifyArgs) {
  const url = process.env.N8N_LEAD_WEBHOOK_URL || process.env.CRM_WEBHOOK_URL;
  if (!url) return;

  const payload = {
    event: "pilot_application_created",
    application: {
      id: applicationId,
      name: input.name,
      businessName: input.businessName,
      website: input.website,
      email: input.email,
      phone: input.phone,
      industry: input.industry,
      annualRevenueRange: input.annualRevenueRange,
      teamSize: input.teamSize,
      currentCrm: input.currentCrm,
      biggestBottleneck: input.biggestBottleneck,
      communicationChannels: input.communicationChannels,
      interestLevel: input.interestLevel,
    },
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[pilot] n8n webhook failed", err);
  }
}

function renderEmail({ applicationId, input }: NotifyArgs) {
  const row = (label: string, value: unknown) =>
    value == null || value === ""
      ? ""
      : `<tr><td style="padding:4px 12px 4px 0;color:#94A3B8;">${label}</td><td style="padding:4px 0;">${escape(String(value))}</td></tr>`;

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#05070F;color:#F8FAFC;padding:24px;">
    <h1 style="margin:0 0 8px 0;">Pilot application — ${escape(input.interestLevel)}</h1>
    <p style="margin:0 0 16px 0;color:#94A3B8;">ID ${applicationId}</p>
    <table style="border-collapse:collapse;font-size:14px;">
      ${row("Name", input.name)}
      ${row("Business", input.businessName)}
      ${row("Website", input.website)}
      ${row("Email", input.email)}
      ${row("Phone", input.phone)}
      ${row("Industry", input.industry)}
      ${row("Revenue", input.annualRevenueRange)}
      ${row("Team size", input.teamSize)}
      ${row("Current CRM", input.currentCrm)}
      ${row("Biggest bottleneck", input.biggestBottleneck)}
      ${row("Communication channels", input.communicationChannels)}
      ${row("Interest", input.interestLevel)}
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
