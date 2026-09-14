import { clampPercent } from "../labor/labor-calculations";

export type MissedCallsScenarioInput = {
  missedCallsPerMonth: number;
  qualifiedOpportunityRate: number;
  closeRate: number;
  grossProfitPerSale: number;
  recoverabilityRate: number;
};

/**
 * Missed Calls × Qualified Rate × Close Rate × Gross Profit × Recoverability,
 * annualised. Returns gross profit, never revenue, so the figure is
 * comparable with the labor layers.
 */
export function calculateMissedCallsScenario(input: MissedCallsScenarioInput) {
  const calls = Math.max(0, input.missedCallsPerMonth);
  const qualified = calls * (clampPercent(input.qualifiedOpportunityRate, 0) / 100);
  const monthly =
    qualified *
    (clampPercent(input.closeRate, 0) / 100) *
    Math.max(0, input.grossProfitPerSale) *
    (clampPercent(input.recoverabilityRate, 0) / 100);
  return { qualifiedOpportunitiesPerMonth: qualified, monthlyGrossProfit: monthly, annualGrossProfit: monthly * 12 };
}
