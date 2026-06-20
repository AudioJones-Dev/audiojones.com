import "server-only";
import type { FounderGravityAuditLeadSchemaInput } from "@/lib/founder-gravity-audit/schema";
import type { FounderGravityResult } from "@/lib/founder-gravity-audit/types";
import { getSql } from "./neon";

export type FounderGravityLeadContext = {
  ipHash: string | null;
  userAgent: string | null;
};

export type StoredFounderGravityLead = {
  id: string;
  createdAt: string;
};

export async function insertFounderGravityAuditLead(
  input: FounderGravityAuditLeadSchemaInput,
  result: FounderGravityResult,
  ctx: FounderGravityLeadContext,
): Promise<StoredFounderGravityLead> {
  const sql = getSql();
  const answersJson = JSON.stringify(input.answers);
  const resultJson = JSON.stringify(result);
  const attributionJson = JSON.stringify(input.attribution ?? {});
  const eventsJson = JSON.stringify(input.events ?? []);

  const rows = (await sql`
    INSERT INTO founder_gravity_audit_leads (
      email, display_name, entity_name, consent_to_contact, session_id,
      answers, result, segment, gravity_load, confidence_score,
      top_fragility_zone, strongest_contradiction_signal, resonance_zone,
      suppressed, suppression_reason, cta_label, cta_event, cta_href,
      attribution, events, duration_seconds, status, source_page,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content,
      user_agent, ip_hash
    ) VALUES (
      ${input.email}, ${input.displayName}, ${input.entityName},
      ${input.consentToContact === true}, ${input.sessionId},
      ${answersJson}::jsonb, ${resultJson}::jsonb, ${result.segment},
      ${result.gravityLoad}, ${result.confidenceScore},
      ${result.topFragilityZone}, ${result.strongestContradictionSignal},
      ${result.resonanceZone}, ${result.suppression.suppressed},
      ${result.suppression.reason}, ${result.cta.label}, ${result.cta.event},
      ${result.cta.href}, ${attributionJson}::jsonb, ${eventsJson}::jsonb,
      ${input.durationSeconds ?? null}, 'new',
      ${input.attribution?.sourcePage ?? null}, ${input.attribution?.utmSource ?? null},
      ${input.attribution?.utmMedium ?? null}, ${input.attribution?.utmCampaign ?? null},
      ${input.attribution?.utmTerm ?? null}, ${input.attribution?.utmContent ?? null},
      ${ctx.userAgent}, ${ctx.ipHash}
    )
    RETURNING id::text AS id, created_at AS "createdAt"
  `) as Array<{ id: string; createdAt: Date | string }>;

  const row = rows[0];
  if (!row) {
    throw new Error("Founder Gravity Audit lead insert returned no rows");
  }

  return {
    id: row.id,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : new Date(row.createdAt).toISOString(),
  };
}
