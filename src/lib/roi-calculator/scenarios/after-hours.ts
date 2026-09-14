import { clampPercent } from "../labor/labor-calculations";

export type AfterHoursScenarioInput = {
  afterHoursCallsPerMonth: number;
  qualifiedOpportunityRate: number;
  closeRate: number;
  grossProfitPerSale: number;
  captureRate: number;
};

/** After-Hours Calls × Qualification Rate × Close Rate × Gross Profit × Capture Rate, annualised. */
export function calculateAfterHoursScenario(input: AfterHoursScenarioInput) {
  const calls = Math.max(0, input.afterHoursCallsPerMonth);
  const qualified = calls * (clampPercent(input.qualifiedOpportunityRate, 0) / 100);
  const monthly =
    qualified *
    (clampPercent(input.closeRate, 0) / 100) *
    Math.max(0, input.grossProfitPerSale) *
    (clampPercent(input.captureRate, 0) / 100);
  return { qualifiedOpportunitiesPerMonth: qualified, monthlyGrossProfit: monthly, annualGrossProfit: monthly * 12 };
}
