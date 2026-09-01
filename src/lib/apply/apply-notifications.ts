// Internal notification for a persisted /apply submission.
//
// Mirrors src/lib/leads/lead-notifications.ts — same env vars, same two
// channels (Resend email + n8n/CRM webhook), same fail-soft posture — but
// carries the application shape rather than the diagnostic's, and leads with
// the offer, which is what decides who picks the application up.
//
// Fired only after a row is committed (see the neon adapter in
// apply-storage.ts). A mock submission notifies nobody, because nothing was
// received.
//
// No scores. The application form does not collect what
// scoreFounderIntelligenceLead reads, so there is no priority to put in the
// subject line; triage is by offer instead.
//
// Subject and body live in apply-notification-content.ts so they can be
// tested without a server bundle.

import "server-only";
import { readCappedBody } from "@/lib/notifications/safe-body";
import { applySubject, offerLabel, renderApplyEmail } from "./apply-notification-content";
import type { ApplyInput } from "./apply-schema";

// Bound every notification request. A downstream that accepts the connection
// and then stalls would otherwise hold the deferred `after` task open until
// the platform kills it, and the status would never be logged.
const NOTIFY_TIMEOUT_MS = 10_000;

type NotifyArgs = {
  leadId: string;
  input: ApplyInput;
};

export async function notifyApplySubmission({ leadId, input }: NotifyArgs) {
  await Promise.allSettled([
    sendEmail(leadId, input),
    sendWebhook(leadId, input),
  ]);
}

// Warn-once guard so a misconfigured deploy emits a single visible signal
// instead of one line per submission. Module-scoped — resets per cold start,
// which is fine: it is a deployment-config smell, not a per-request alert.
let emailEnvWarned = false;

async function sendEmail(leadId: string, input: ApplyInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.FROM_EMAIL || "Audio Jones <noreply@audiojones.com>";
  if (!apiKey || !to) {
    if (!emailEnvWarned) {
      emailEnvWarned = true;
      console.warn("[apply] notification skipped: email env missing", {
        hasResendApiKey: Boolean(apiKey),
        hasLeadNotificationEmail: Boolean(to),
      });
    }
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: applySubject(input),
        html: renderApplyEmail(leadId, input),
        reply_to: input.email,
      }),
      signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
    });

    // fetch only rejects on a transport failure. A bad API key, an
    // unverified sender or a rate limit all come back as a resolved 4xx,
    // which without this check would look exactly like a delivered email
    // and leave every application silently unannounced.
    if (!res.ok) {
      console.error("[apply] email notification rejected", {
        status: res.status,
        body: await readCappedBody(res),
        leadId,
      });
    }
  } catch (err) {
    // The row is already committed, so a failed notification must never
    // surface to the applicant — it is an internal delivery problem.
    console.error("[apply] email notification failed", err);
  }
}


async function sendWebhook(leadId: string, input: ApplyInput) {
  const url = process.env.N8N_LEAD_WEBHOOK_URL || process.env.CRM_WEBHOOK_URL;
  if (!url) return;

  const payload = {
    event: "apply_submission_created",
    application: {
      id: leadId,
      offer: input.offer ?? null,
      offerLabel: offerLabel(input.offer),
      source: input.source ?? null,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      companyName: input.companyName,
      website: input.website,
      role: input.role,
      annualRevenueRange: input.annualRevenueRange,
      currentGrowthStage: input.currentGrowthStage,
      teamSize: input.teamSize,
      primaryConstraint: input.primaryConstraint,
      desiredOutcome: input.desiredOutcome,
      timeline: input.timeline,
      budgetRange: input.budgetRange,
      notes: input.notes,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      utmContent: input.utmContent,
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
    });

    // Same reasoning as the email call: a rejecting or misconfigured
    // downstream returns a resolved 4xx/5xx, not a thrown error.
    if (!res.ok) {
      console.error("[apply] webhook notification rejected", {
        status: res.status,
        body: await readCappedBody(res),
        leadId,
      });
    }
  } catch (err) {
    console.error("[apply] webhook notification failed", err);
  }
}
