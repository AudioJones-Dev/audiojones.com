// Pilot application persistence — writes to the `pilot_applications`
// table on NeonDB. Schema lives in db/migrations/002_pilot_applications.sql.

import "server-only";
import type { PilotApplicationInput } from "@/lib/pilot/pilot-schema";
import { getSql } from "./neon";

export type StoredPilotApplication = {
  id: string;
  createdAt: string;
};

export type PilotApplicationContext = {
  ipHash: string | null;
  userAgent: string | null;
};

export async function insertPilotApplication(
  input: PilotApplicationInput,
  ctx: PilotApplicationContext,
): Promise<StoredPilotApplication> {
  const sql = getSql();

  const rows = (await sql`
    INSERT INTO pilot_applications (
      name, business_name, website, email, phone,
      industry, annual_revenue_range, team_size,
      current_crm, biggest_bottleneck, communication_channels,
      interest_level, consent_to_contact,
      source_page, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
      user_agent, ip_hash
    ) VALUES (
      ${input.name}, ${input.businessName}, ${input.website || null},
      ${input.email}, ${input.phone},
      ${input.industry}, ${input.annualRevenueRange}, ${input.teamSize},
      ${input.currentCrm ?? null}, ${input.biggestBottleneck},
      ${input.communicationChannels ?? null},
      ${input.interestLevel}, ${input.consentToContact === true},
      ${input.sourcePage ?? null}, ${input.utmSource ?? null},
      ${input.utmMedium ?? null}, ${input.utmCampaign ?? null},
      ${input.utmTerm ?? null}, ${input.utmContent ?? null},
      ${ctx.userAgent}, ${ctx.ipHash}
    )
    RETURNING id::text AS id, created_at AS "createdAt"
  `) as Array<{ id: string; createdAt: Date | string }>;

  const row = rows[0];
  if (!row) {
    throw new Error("Pilot application insert returned no rows");
  }

  return {
    id: row.id,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : new Date(row.createdAt).toISOString(),
  };
}
