// Lead persistence — Applied Intelligence diagnostic.
//
// Writes to the `applied_intelligence_leads` table on NeonDB. Schema lives in
// db/migrations/001_applied_intelligence_leads.sql.

import "server-only";
import type { AppliedIntelligenceLeadInput } from "@/lib/leads/lead-schema";
import type { LeadScores } from "@/lib/leads/lead-scoring";
import { getSql } from "./neon";

export type StoredLead = {
  id: string;
  createdAt: string;
};

export type LeadContext = {
  ipHash: string | null;
  userAgent: string | null;
};

export async function insertAppliedIntelligenceLead(
  input: AppliedIntelligenceLeadInput,
  scores: LeadScores,
  ctx: LeadContext,
): Promise<StoredLead> {
  const sql = getSql();

  const rows = (await sql`
    INSERT INTO applied_intelligence_leads (
      first_name, last_name, email, phone, company_name, website, role,
      annual_revenue_range, primary_constraint, current_growth_stage,
      biggest_pain, what_have_you_tried,
      crm_used, analytics_used, project_management_used, automation_tools_used,
      content_system_status, documented_sops,
      current_ai_tools, ai_usage_level, ai_main_goal, ai_concern,
      can_identify_best_lead_source, knows_cac, knows_ltv,
      tracks_conversion_source, attribution_confidence, desired_outcome,
      budget_range, timeline, preferred_contact_method, consent_to_contact,
      signal_score, ai_readiness_score, attribution_score, icp_fit_score,
      total_score, priority, status,
      source_page, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
      user_agent, ip_hash
    ) VALUES (
      ${input.firstName}, ${input.lastName ?? null}, ${input.email},
      ${input.phone ?? null}, ${input.companyName ?? null},
      ${input.website || null}, ${input.role ?? null},
      ${input.annualRevenueRange ?? null}, ${input.primaryConstraint ?? null},
      ${input.currentGrowthStage ?? null}, ${input.biggestPain ?? null},
      ${input.whatHaveYouTried ?? null},
      ${input.crmUsed ?? null}, ${input.analyticsUsed ?? null},
      ${input.projectManagementUsed ?? null}, ${input.automationToolsUsed ?? null},
      ${input.contentSystemStatus ?? null}, ${input.documentedSops ?? null},
      ${input.currentAiTools ?? null}, ${input.aiUsageLevel ?? null},
      ${input.aiMainGoal ?? null}, ${input.aiConcern ?? null},
      ${input.canIdentifyBestLeadSource ?? null}, ${input.knowsCAC ?? null},
      ${input.knowsLTV ?? null}, ${input.tracksConversionSource ?? null},
      ${input.attributionConfidence ?? null}, ${input.desiredOutcome ?? null},
      ${input.budgetRange ?? null}, ${input.timeline ?? null},
      ${input.preferredContactMethod ?? null},
      ${input.consentToContact === true},
      ${scores.signalScore}, ${scores.aiReadinessScore},
      ${scores.attributionScore}, ${scores.icpFitScore},
      ${scores.totalScore}, ${scores.priority}, 'new',
      ${input.sourcePage ?? null}, ${input.utmSource ?? null},
      ${input.utmMedium ?? null}, ${input.utmCampaign ?? null},
      ${input.utmTerm ?? null}, ${input.utmContent ?? null},
      ${ctx.userAgent}, ${ctx.ipHash}
    )
    RETURNING id::text AS id, created_at AS "createdAt"
  `) as Array<{ id: string; createdAt: Date | string }>;

  const row = rows[0];
  if (!row) {
    throw new Error("Lead insert returned no rows");
  }

  return {
    id: row.id,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : new Date(row.createdAt).toISOString(),
  };
}
