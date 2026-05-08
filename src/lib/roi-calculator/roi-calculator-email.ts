import "server-only";
import type { RoiLeadInput } from "./roi-calculator-schema";
import { getRecommendation } from "@/lib/ai-roi-diagnostic/recommendations";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");

export async function sendAgencyNotification(leadId: string, lead: RoiLeadInput): Promise<void> {
  const recommendation = getRecommendation(lead.result);
  await sendEmail({
    to: process.env.LEAD_NOTIFICATION_EMAIL,
    subject: `[ROI Calc] ${lead.input.industry} / ${lead.input.companySize} — ${recommendation.title}`,
    html: `
      <div style="font-family:Inter,system-ui,sans-serif;background:#05070F;color:#F8FAFC;padding:24px;">
        <p style="color:#C8A96A;text-transform:uppercase;letter-spacing:.16em;">ROI Calculator Lead</p>
        <h1>${escape(recommendation.title)} · ${lead.result.roiScore}/${lead.result.readinessScore}/${lead.result.priorityScore}</h1>
        <p style="color:#94A3B8;">Lead ${escape(leadId)} · ${escape(lead.email)} · Source ${escape(lead.source ?? "roi-calculator-page")}</p>
        ${scoreGrid(lead)}
        <h2>Recommendation</h2><p>${escape(recommendation.summary)}</p>
        <h2>Full submitted context</h2>
        <pre style="white-space:pre-wrap;background:#0B1020;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;">${escape(JSON.stringify({ input: lead.input, result: lead.result, utm: lead.utm }, null, 2))}</pre>
      </div>`,
  });
}

export async function sendClientResultEmail(lead: RoiLeadInput): Promise<void> {
  const recommendation = getRecommendation(lead.result);
  await sendEmail({
    to: lead.email,
    subject: `Your AI ROI Diagnostic — ${recommendation.title}`,
    html: `
      <div style="font-family:Inter,system-ui,sans-serif;background:#05070F;color:#F8FAFC;padding:24px;line-height:1.6;">
        <p style="color:#C8A96A;text-transform:uppercase;letter-spacing:.16em;">Audio Jones</p>
        <h1 style="margin-bottom:8px;">Your AI ROI diagnostic is ready.</h1>
        <p style="color:#CBD5E1;max-width:680px;">The signal is not whether AI is possible. The signal is whether this workflow has enough economic pressure, process clarity, and operational readiness to deserve automation now.</p>
        ${scoreGrid(lead)}
        <div style="border:1px solid rgba(255,69,0,.35);border-radius:18px;padding:18px;background:#0B1020;margin:20px 0;">
          <h2 style="margin-top:0;">${escape(recommendation.title)}</h2>
          <p>${escape(recommendation.summary)}</p>
          <p><strong>Recommended next action:</strong> ${escape(recommendation.nextStep)}</p>
          <a href="https://diagnostic.audiojones.com" style="display:inline-block;background:#FF4500;color:#fff;text-decoration:none;border-radius:999px;padding:12px 18px;font-weight:700;">Take the Signal Diagnostic</a>
        </div>
        <p><strong>Expected annual impact:</strong> ${money(lead.result.expectedAnnualImpact)} · <strong>Payback:</strong> ${lead.result.paybackMonths} months · <strong>Readiness tier:</strong> ${readinessTier(lead.result.readinessScore)}</p>
        <p style="color:#94A3B8;">— Audio Jones</p>
      </div>`,
  });
}

function scoreGrid(lead: RoiLeadInput) {
  return `<div style="display:grid;gap:12px;grid-template-columns:repeat(3,minmax(0,1fr));margin:20px 0;">
    ${scoreCard("ROI", lead.result.roiScore)}${scoreCard("Readiness", lead.result.readinessScore)}${scoreCard("Priority", lead.result.priorityScore)}
  </div>`;
}
function scoreCard(label: string, score: number) {
  return `<div style="background:#0B1020;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px;"><div style="color:#94A3B8;font-size:12px;text-transform:uppercase;letter-spacing:.12em;">${label}</div><div style="font-size:32px;font-weight:800;">${score}</div></div>`;
}
function readinessTier(score: number) {
  if (score >= 70) return "Strong operational readiness";
  if (score >= 45) return "Partial operational readiness";
  return "Weak operational readiness";
}
async function sendEmail({ to, subject, html }: { to?: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from || !to) {
    console.warn("[roi-calculator email] missing Resend env; skipping send", { hasApiKey: Boolean(apiKey), hasFrom: Boolean(from), hasTo: Boolean(to) });
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to, subject, html }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}
