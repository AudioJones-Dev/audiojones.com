import { clampPercent } from "../labor/labor-calculations";

export type DelayedResponseScenarioInput = {
  leadsAffectedPerMonth: number;
  currentCloseRate: number;
  /** Percentage points. The improved rate is capped at 100%. */
  closeRateLift: number;
  grossProfitPerSale: number;
};

/** Affected Leads × (Improved Close Rate − Current Close Rate) × Gross Profit, annualised. */
export function calculateDelayedResponseScenario(input: DelayedResponseScenarioInput) {
  const current = clampPercent(input.currentCloseRate, 0);
  const improved = Math.min(100, current + Math.max(0, input.closeRateLift));
  const lift = Math.max(0, improved - current) / 100;
  const monthly = Math.max(0, input.leadsAffectedPerMonth) * lift * Math.max(0, input.grossProfitPerSale);
  return { improvedCloseRate: improved, monthlyGrossProfit: monthly, annualGrossProfit: monthly * 12 };
}
