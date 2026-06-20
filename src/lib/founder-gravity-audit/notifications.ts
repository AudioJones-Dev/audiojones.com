import "server-only";
import {
  FOUNDER_GRAVITY_ASSET,
  GRAVITY_LAYERS,
} from "./content";
import type { FounderGravityAuditLeadSchemaInput } from "./schema";
import type { FounderGravityResult } from "./types";

type NotifyArgs = {
  leadId: string;
  input: FounderGravityAuditLeadSchemaInput;
  result: FounderGravityResult;
};

export async function notifyFounderGravityAuditLead(args: NotifyArgs) {
  await Promise.allSettled([sendEmail(args), sendN8nWebhook(args)]);
}

let emailEnvWarned = false;

async function sendEmail({ leadId, input, result }: NotifyArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.FROM_EMAIL || "Audio Jones <noreply@audiojones.com>";
  if (!apiKey || !to) {
    if (!emailEnvWarned) {
      emailEnvWarned = true;
      console.warn("[founder-gravity-audit] notification skipped: email env missing", {
        hasResendApiKey: Boolean(apiKey),
        hasLeadNotificationEmail: Boolean(to),
      });
    }
    return;
  }

  const subject = `[FGA ${result.segment}] ${input.displayName} (${result.gravityLoad})`;
  const html = renderEmail({ leadId, input, result });

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
    console.error("[founder-gravity-audit] email notification failed", err);
  }
}

async function sendN8nWebhook({ leadId, input, result }: NotifyArgs) {
  if (result.suppression.suppressed) {
    return;
  }

  const url = process.env.N8N_LEAD_WEBHOOK_URL || process.env.CRM_WEBHOOK_URL;
  if (!url) return;

  const payload = {
    event: "founder_gravity_audit_lead_created",
    asset: FOUNDER_GRAVITY_ASSET.asset,
    record_type: FOUNDER_GRAVITY_ASSET.recordType,
    asset_type: FOUNDER_GRAVITY_ASSET.assetType,
    productization_lane: FOUNDER_GRAVITY_ASSET.productizationLane,
    gtm_motion: FOUNDER_GRAVITY_ASSET.gtmMotion,
    session_id: input.sessionId,
    founder: {
      email: input.email,
      display_name: input.displayName,
      entity_name: input.entityName,
    },
    attribution: {
      acquisition_channel: input.attribution?.acquisitionChannel,
      utm_payload: {
        source: input.attribution?.utmSource,
        medium: input.attribution?.utmMedium,
        campaign: input.attribution?.utmCampaign,
        term: input.attribution?.utmTerm,
        content: input.attribution?.utmContent,
      },
      referrer: input.attribution?.referrer,
      landing_path: input.attribution?.landingPath,
      source_page: input.attribution?.sourcePage,
    },
    diagnostic: {
      lead_id: leadId,
      segment: result.segment,
      gravity_load: result.gravityLoad,
      top_layers: result.topLayers.map((layer) => GRAVITY_LAYERS[layer]),
      top_fragility_zone: result.topFragilityZone,
      strongest_contradiction_signal: result.strongestContradictionSignal,
      resonance_zone: GRAVITY_LAYERS[result.resonanceZone],
      confidence_score: result.confidenceScore,
    },
    routing: {
      pathway: result.cta.pathway,
      primary_cta: result.cta.label,
      conversion_event: result.cta.event,
    },
    suppression: result.suppression,
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[founder-gravity-audit] n8n webhook failed", err);
  }
}

function renderEmail({ leadId, input, result }: NotifyArgs) {
  const row = (label: string, value: unknown) =>
    value == null || value === ""
      ? ""
      : `<tr><td style="padding:4px 12px 4px 0;color:#9A9A9A;">${label}</td><td style="padding:4px 0;">${escape(String(value))}</td></tr>`;

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#080808;color:#E8E8E8;padding:24px;">
    <h1 style="margin:0 0 8px 0;">Founder Gravity Audit lead</h1>
    <p style="margin:0 0 16px 0;color:#9A9A9A;">${escape(result.segment)} · Gravity Load ${result.gravityLoad} · ID ${leadId}</p>
    <table style="border-collapse:collapse;font-size:14px;">
      ${row("Name", input.displayName)}
      ${row("Email", input.email)}
      ${row("Entity", input.entityName)}
      ${row("Segment", result.segment)}
      ${row("Gravity Load", result.gravityLoad)}
      ${row("Confidence", result.confidenceScore)}
      ${row("Top fragility zone", result.topFragilityZone)}
      ${row("Contradiction signal", result.strongestContradictionSignal)}
      ${row("CTA", result.cta.label)}
      ${row("Suppressed", result.suppression.suppressed ? result.suppression.reason : "no")}
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
