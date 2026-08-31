// Field mapping from an /apply submission to an `applied_intelligence_leads`
// row.
//
// Kept out of src/db/apply.ts — and therefore out of "server-only" — so the
// mapping can be unit-tested without a database or a server bundle. The SQL
// that consumes this lives in src/db/apply.ts; columns are defined in
// db/migrations/001_applied_intelligence_leads.sql and
// db/migrations/003_apply_submission_fields.sql.

import type { ApplyInput } from "./apply-schema";

export type ApplyRowContext = {
  ipHash: string | null;
  userAgent: string | null;
};

export const APPLY_SOURCE_PAGE = "/apply";

const orNull = (value: string | undefined) =>
  value && value.trim() !== "" ? value : null;

export type ApplyRow = ReturnType<typeof toApplyRow>;

export function toApplyRow(input: ApplyInput, ctx: ApplyRowContext) {
  return {
    firstName: input.firstName,
    lastName: orNull(input.lastName),
    email: input.email,
    phone: orNull(input.phone),
    companyName: input.companyName,
    website: orNull(input.website),
    role: orNull(input.role),

    annualRevenueRange: input.annualRevenueRange,
    currentGrowthStage: orNull(input.currentGrowthStage),
    primaryConstraint: orNull(input.primaryConstraint),
    teamSize: orNull(input.teamSize),

    offer: orNull(input.offer),
    desiredOutcome: input.desiredOutcome,
    timeline: input.timeline,
    budgetRange: orNull(input.budgetRange),
    notes: orNull(input.notes),

    consentToContact: input.consentToContact === true,

    sourcePage: APPLY_SOURCE_PAGE,
    applySource: orNull(input.source),
    utmSource: orNull(input.utmSource),
    utmMedium: orNull(input.utmMedium),
    utmCampaign: orNull(input.utmCampaign),
    utmTerm: orNull(input.utmTerm),
    utmContent: orNull(input.utmContent),

    userAgent: ctx.userAgent,
    ipHash: ctx.ipHash,
  };
}
