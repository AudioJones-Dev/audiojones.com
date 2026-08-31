// Application persistence — the deeper-intent form at /apply.
//
// Writes to the same `applied_intelligence_leads` table as the Founder
// Intelligence diagnostic (src/db/leads.ts). Application rows are identified
// by source_page = '/apply' and, where the visitor arrived from an offer, a
// non-null `offer`.
//
// The field mapping lives in src/lib/apply/apply-row.ts so it can be tested
// without a database. Columns added for this shape are in
// db/migrations/003_apply_submission_fields.sql.

import "server-only";
import type { ApplyInput } from "@/lib/apply/apply-schema";
import { toApplyRow, type ApplyRowContext } from "@/lib/apply/apply-row";
import { getSql } from "./neon";
import type { StoredLead } from "./leads";

export type { StoredLead };

export async function insertApplySubmission(
  input: ApplyInput,
  ctx: ApplyRowContext,
): Promise<StoredLead> {
  const sql = getSql();
  const row = toApplyRow(input, ctx);

  // The scoring columns (signal_score, icp_fit_score, total_score, priority)
  // are deliberately omitted. `scoreFounderIntelligenceLead` reads fields the
  // application form does not collect, and inventing a second scoring model
  // here would put unearned numbers in the triage columns. They keep their
  // schema defaults until a scoring model for this shape is agreed.
  const rows = (await sql`
    INSERT INTO applied_intelligence_leads (
      first_name, last_name, email, phone, company_name, website, role,
      annual_revenue_range, current_growth_stage, primary_constraint, team_size,
      offer, desired_outcome, timeline, budget_range, notes,
      consent_to_contact, status,
      source_page, apply_source,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content,
      user_agent, ip_hash
    ) VALUES (
      ${row.firstName}, ${row.lastName}, ${row.email}, ${row.phone},
      ${row.companyName}, ${row.website}, ${row.role},
      ${row.annualRevenueRange}, ${row.currentGrowthStage},
      ${row.primaryConstraint}, ${row.teamSize},
      ${row.offer}, ${row.desiredOutcome}, ${row.timeline},
      ${row.budgetRange}, ${row.notes},
      ${row.consentToContact}, 'new',
      ${row.sourcePage}, ${row.applySource},
      ${row.utmSource}, ${row.utmMedium}, ${row.utmCampaign},
      ${row.utmTerm}, ${row.utmContent},
      ${row.userAgent}, ${row.ipHash}
    )
    RETURNING id::text AS id, created_at AS "createdAt"
  `) as Array<{ id: string; createdAt: Date | string }>;

  const stored = rows[0];
  if (!stored) {
    throw new Error("Apply insert returned no rows");
  }

  return {
    id: stored.id,
    createdAt:
      stored.createdAt instanceof Date
        ? stored.createdAt.toISOString()
        : new Date(stored.createdAt).toISOString(),
  };
}
