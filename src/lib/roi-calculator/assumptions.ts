import type { CalculationAssumption, LaborScopeKey } from "./types";

/**
 * Every economically meaningful constant the V2 scorecard uses lives here, so
 * the result can list exactly which assumptions produced it and a visitor can
 * see (and, where marked, override) each one. Nothing in the scenario files
 * carries a bare numeric literal that moves the headline.
 */

export const WEEKS_PER_YEAR = 52;

export const BENCHMARK_VERSION = "2026-09-seeded-oews-may-2023";

/**
 * Employer burden on top of market wage. BLS Employer Costs for Employee
 * Compensation puts private-industry benefits at roughly 30% of total
 * compensation, which implies wages × ~1.4; this default is rounded down so
 * the estimate errs conservative. Overridable per submission.
 */
export const DEFAULT_BURDEN_MULTIPLIER = 1.35;
export const MIN_BURDEN_MULTIPLIER = 1;
export const MAX_BURDEN_MULTIPLIER = 2;

/**
 * Share of each scope's hours a response/follow-up system can realistically
 * take over. Dispatch and operations coordination stay mostly human, so they
 * sit lowest; call handling and CRM entry are the most systemisable.
 */
export const SCOPE_RECOVERABILITY_PRESETS: Record<LaborScopeKey, number> = {
  calls: 70,
  customer_communication: 60,
  scheduling: 65,
  dispatch: 40,
  crm_admin: 70,
  quote_followup: 65,
  billing: 50,
  operations_admin: 45,
  custom: 50,
};

/** Share of missed or after-hours calls that are genuine sales opportunities. */
export const DEFAULT_QUALIFIED_OPPORTUNITY_RATE = 40;
/** Share of missed-call opportunities a system would actually win back. */
export const DEFAULT_MISSED_CALL_RECOVERABILITY = 50;
/** Share of after-hours demand a system would actually capture. */
export const DEFAULT_AFTER_HOURS_CAPTURE_RATE = 40;
/** Share of unworked quotes that follow-up would actually recover. */
export const DEFAULT_QUOTE_RECOVERABILITY = 50;
/** Close-rate points added on leads that currently get a slow response. */
export const DEFAULT_RESPONSE_CLOSE_RATE_LIFT = 5;

/** Conservative spread around the base modeled figure. */
export const OPPORTUNITY_RANGE_LOW_FACTOR = 0.7;
export const OPPORTUNITY_RANGE_HIGH_FACTOR = 1.15;

export const SCOPE_LABELS: Record<LaborScopeKey, string> = {
  calls: "Answering calls",
  customer_communication: "Customer texts and emails",
  scheduling: "Scheduling",
  dispatch: "Dispatch",
  crm_admin: "CRM and data entry",
  quote_followup: "Quote and estimate follow-up",
  billing: "Billing and invoices",
  operations_admin: "General administration",
  custom: "Other operational work",
};

export function baseAssumptions(overrides: {
  burdenMultiplier: number;
  qualifiedOpportunityRate: number;
  missedCallRecoverability: number;
  afterHoursCaptureRate: number;
  quoteRecoverability: number;
  responseCloseRateLift: number;
}): CalculationAssumption[] {
  return [
    {
      id: "burden_multiplier",
      label: "Employer burden multiplier",
      value: overrides.burdenMultiplier,
      description:
        "Market wage is multiplied by this to approximate loaded labor cost (payroll taxes, benefits, paid time, overhead).",
      source: "BLS Employer Costs for Employee Compensation, private industry benefit share",
      sourceDate: "2025",
      userOverridable: true,
    },
    {
      id: "qualified_opportunity_rate",
      label: "Qualified opportunity rate",
      value: `${overrides.qualifiedOpportunityRate}%`,
      description: "Share of missed and after-hours calls treated as real sales opportunities rather than vendors, spam, or existing-customer service.",
      userOverridable: true,
    },
    {
      id: "missed_call_recoverability",
      label: "Missed-call recoverability",
      value: `${overrides.missedCallRecoverability}%`,
      description: "Share of qualified missed-call opportunities a response system is assumed to win back. Never 100%: some callers have already booked elsewhere.",
      userOverridable: true,
    },
    {
      id: "after_hours_capture_rate",
      label: "After-hours capture rate",
      value: `${overrides.afterHoursCaptureRate}%`,
      description: "Share of after-hours demand assumed to be captured with coverage. Lower than daytime recoverability because urgency and intent are less certain.",
      userOverridable: true,
    },
    {
      id: "quote_recoverability",
      label: "Quote follow-up recoverability",
      value: `${overrides.quoteRecoverability}%`,
      description: "Share of unworked quotes that structured follow-up is assumed to close at the historical quote close rate.",
      userOverridable: true,
    },
    {
      id: "response_close_rate_lift",
      label: "Speed-to-lead close-rate lift",
      value: `+${overrides.responseCloseRateLift} pts`,
      description: "Percentage points added to the close rate on leads that currently get a slow response. Applied only to leads not already counted as missed, after-hours, or unworked quotes.",
      userOverridable: true,
    },
    {
      id: "opportunity_range",
      label: "Opportunity range factors",
      value: `${OPPORTUNITY_RANGE_LOW_FACTOR}× to ${OPPORTUNITY_RANGE_HIGH_FACTOR}×`,
      description: "The low and high ends of the modeled range are the base estimate scaled by these factors. Not user-adjustable in this release.",
      userOverridable: false,
    },
  ];
}
