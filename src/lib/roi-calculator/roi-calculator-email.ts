import "server-only";

import { ctaLinks } from "@/config/links";
import { buildReportContent, type ReportContent } from "./report-content";
import { buildReportUrl } from "./report-token";
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

let warnedMissingResendKey = false;
let warnedMissingFromEmail = false;
let warnedMissingNotificationEmail = false;

async function sendResendEmail(payload: { to: string; subject: string; html: string }): Promise<RoiEmailStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    if (!warnedMissingResendKey) {
      console.warn(
        "[roi-calculator] RESEND_API_KEY is not set — ROI calculator emails will not be delivered. " +
          "Configure RESEND_API_KEY in the Vercel environment to enable transactional email.",
      );
      warnedMissingResendKey = true;
    }
    return "skipped";
  }

  if (!from) {
    if (!warnedMissingFromEmail) {
      console.warn(
        "[roi-calculator] FROM_EMAIL / RESEND_FROM_EMAIL is not set — falling back to Audio Jones <noreply@audiojones.com>. " +
          "Set FROM_EMAIL in the Vercel environment for a verified sending identity.",
      );
      warnedMissingFromEmail = true;
    }
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ from: from || "Audio Jones <noreply@audiojones.com>", ...payload }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`Resend returned ${response.status}${errBody ? `: ${errBody.slice(0, 500)}` : ""}`);
  }
  return "sent";
}

function row(label: string, value: unknown) {
  if (value == null || value === "") return "";
  return `<tr><td style="padding:6px 14px 6px 0;color:#94A3B8;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#F8FAFC;">${escapeHtml(value)}</td></tr>`;
}

export async function sendAgencyRoiNotification({ leadId, lead, submittedAt }: SendArgs): Promise<RoiEmailStatus> {
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  if (!to) {
    if (!warnedMissingNotificationEmail) {
      console.warn(
        "[roi-calculator] LEAD_NOTIFICATION_EMAIL is not set — internal team notifications are disabled. " +
          "Set LEAD_NOTIFICATION_EMAIL in the Vercel environment to receive ROI calculator leads.",
      );
      warnedMissingNotificationEmail = true;
    }
    return "skipped";
  }

  const { input, result } = lead;
  const reportUrl = buildReportUrl(leadId);
  const subject = `[ROI Calc] ${input.industry} / ${input.companySize} — ${result.recommendation}`;
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#05070F;color:#F8FAFC;padding:24px;">
      <h1 style="margin:0 0 8px 0;">ROI Calculator lead</h1>
      <p style="margin:0 0 18px 0;color:#94A3B8;">ID ${escapeHtml(leadId)} · Submitted ${escapeHtml(submittedAt)}</p>
      <p style="margin:0 0 18px 0;"><a href="${escapeHtml(reportUrl)}" style="color:#E8FF5A;font-weight:700;text-decoration:none;">Open Signal ROI Snapshot →</a></p>
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

function section({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return `
    <section style="margin:28px 0;padding:24px;border:1px solid rgba(232,255,90,0.18);border-radius:14px;background:#0B0B0B;">
      <p style="margin:0 0 8px 0;color:#E8FF5A;text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:700;">${escapeHtml(eyebrow)}</p>
      <h2 style="margin:0 0 12px 0;font-size:20px;line-height:1.3;color:#FAFAFA;">${escapeHtml(title)}</h2>
      ${body}
    </section>`;
}

function renderSnapshotEmail(reportUrl: string, content: ReportContent): string {
  const { executiveSnapshot: exec, revenueLeak, bottleneckDiagnosis, signalVsNoise, mapLens, nextMove, cta } = content;

  const breakdownRows = revenueLeak.breakdown
    .map(
      (item) =>
        `<tr><td style="padding:8px 14px 8px 0;color:#A3A3A3;">${escapeHtml(item.label)}</td><td style="padding:8px 0;color:#FAFAFA;font-weight:600;">${escapeHtml(money(item.amount))}</td></tr>`,
    )
    .join("");

  const mapRows = ([mapLens.measurement, mapLens.attribution, mapLens.prediction] as const)
    .map(
      (s) =>
        `<tr><td style="padding:8px 14px 8px 0;color:#A3A3A3;width:140px;vertical-align:top;"><strong style="color:#FAFAFA;display:block;">${escapeHtml(s.label)}</strong><span style="color:#E8FF5A;font-size:12px;">${escapeHtml(s.band)}</span></td><td style="padding:8px 0;color:#D4D4D4;line-height:1.6;">${escapeHtml(s.reading)}</td></tr>`,
    )
    .join("");

  const bottleneckParagraphs = bottleneckDiagnosis.paragraphs
    .map((p) => `<p style="margin:0 0 10px 0;color:#D4D4D4;line-height:1.7;">${escapeHtml(p)}</p>`)
    .join("");

  return `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:#080808;color:#FAFAFA;padding:32px 20px;">
      <div style="max-width:640px;margin:0 auto;">
        <p style="margin:0 0 8px 0;color:#E8FF5A;text-transform:uppercase;letter-spacing:.14em;font-size:11px;font-weight:700;">Audio Jones · ${escapeHtml(content.title)}</p>
        <h1 style="margin:0 0 8px 0;font-size:28px;line-height:1.2;font-weight:700;color:#FAFAFA;">${escapeHtml(content.headline)}</h1>
        <p style="margin:0 0 24px 0;color:#A3A3A3;line-height:1.6;">A directional read on where your workflow is leaking revenue, what your readiness looks like, and what to do next.</p>

        ${section({
          eyebrow: "1 · Executive Snapshot",
          title: exec.summary,
          body: `
            <table style="border-collapse:collapse;width:100%;font-size:14px;">
              <tr>
                <td style="padding:8px 14px 8px 0;color:#A3A3A3;">Estimated annual savings</td>
                <td style="padding:8px 0;color:#E8FF5A;font-weight:700;">${escapeHtml(money(exec.annualSavings))}</td>
              </tr>
              <tr>
                <td style="padding:8px 14px 8px 0;color:#A3A3A3;">Estimated monthly savings</td>
                <td style="padding:8px 0;color:#FAFAFA;font-weight:600;">${escapeHtml(money(exec.monthlySavings))}</td>
              </tr>
              <tr>
                <td style="padding:8px 14px 8px 0;color:#A3A3A3;">Readiness</td>
                <td style="padding:8px 0;color:#FAFAFA;font-weight:600;">${exec.readinessScore}/100 · ${escapeHtml(exec.confidenceTier)} confidence</td>
              </tr>
              <tr>
                <td style="padding:8px 14px 8px 0;color:#A3A3A3;">Estimated payback</td>
                <td style="padding:8px 0;color:#FAFAFA;font-weight:600;">${escapeHtml(exec.paybackMonths ? `${exec.paybackMonths} months` : "Needs a budget estimate")}</td>
              </tr>
            </table>`,
        })}

        ${section({
          eyebrow: "2 · Estimated Revenue Leak",
          title: `~${money(revenueLeak.annual)} of opportunity per year, broken down`,
          body: `
            <table style="border-collapse:collapse;width:100%;font-size:14px;">${breakdownRows}</table>
            <p style="margin:14px 0 0 0;color:#A3A3A3;font-size:13px;line-height:1.6;">Directional, not a promise. The figures assume a reasonable automation capture rate against the inputs you provided.</p>`,
        })}

        ${section({
          eyebrow: "3 · Current Bottleneck Diagnosis",
          title: `Where the cost is concentrated`,
          body: bottleneckParagraphs,
        })}

        ${section({
          eyebrow: "4 · Signal vs. Noise",
          title: signalVsNoise.verdict,
          body: `<p style="margin:0;color:#D4D4D4;line-height:1.7;">${escapeHtml(signalVsNoise.paragraph)}</p>`,
        })}

        ${section({
          eyebrow: "5 · M.A.P. Attribution Lens",
          title: "Measurement · Attribution · Prediction",
          body: `
            <table style="border-collapse:collapse;width:100%;font-size:14px;">${mapRows}</table>
            <p style="margin:14px 0 0 0;color:#A3A3A3;font-size:13px;line-height:1.6;">${escapeHtml(mapLens.summary)}</p>`,
        })}

        ${section({
          eyebrow: "6 · Recommended Next Move",
          title: nextMove.headline,
          body: `<p style="margin:0;color:#D4D4D4;line-height:1.7;">${escapeHtml(nextMove.paragraph)}</p>`,
        })}

        <div style="margin:32px 0 12px 0;padding:24px;border-radius:14px;background:linear-gradient(135deg,rgba(232,255,90,0.18),rgba(232,255,90,0.04));border:1px solid rgba(232,255,90,0.35);">
          <p style="margin:0 0 6px 0;color:#E8FF5A;text-transform:uppercase;letter-spacing:.14em;font-size:11px;font-weight:700;">7 · Next step</p>
          <h2 style="margin:0 0 16px 0;font-size:22px;color:#FAFAFA;">Ready to separate the signal from the noise?</h2>
          <p style="margin:0 0 20px 0;color:#D4D4D4;line-height:1.6;">Bring this snapshot to a Signal Audit and we'll pressure-test the math against your real workflow.</p>
          <a href="${escapeHtml(cta.primary.href)}" style="display:inline-block;margin-right:12px;padding:14px 22px;background:#E8FF5A;color:#080808;font-weight:700;text-decoration:none;border-radius:10px;">${escapeHtml(cta.primary.label)}</a>
          <a href="${escapeHtml(cta.secondary.href)}" style="display:inline-block;padding:14px 22px;color:#E8FF5A;border:1px solid rgba(232,255,90,0.6);text-decoration:none;border-radius:10px;">${escapeHtml(cta.secondary.label)}</a>
        </div>

        <p style="margin:24px 0 0 0;color:#737373;font-size:12px;line-height:1.6;">
          <a href="${escapeHtml(reportUrl)}" style="color:#E8FF5A;text-decoration:none;">View this report in your browser →</a>
        </p>
        <p style="margin:8px 0 0 0;color:#737373;font-size:12px;">Audio Jones · AJ Digital LLC · Applied Intelligence Systems</p>
      </div>
    </div>`;
}

export async function sendClientRoiResult({ leadId, lead }: SendArgs): Promise<RoiEmailStatus> {
  const { input, result } = lead;
  const reportUrl = buildReportUrl(leadId);
  const content = buildReportContent(input, result, ctaLinks);
  const subject = `Your Signal ROI Snapshot — ${result.recommendation}`;
  const html = renderSnapshotEmail(reportUrl, content);

  try {
    return await sendResendEmail({ to: lead.email, subject, html });
  } catch (error) {
    console.error("[roi-calculator] client email failed", { leadId, error });
    return "failed";
  }
}
