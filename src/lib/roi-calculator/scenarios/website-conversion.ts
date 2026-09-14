import { clampPercent } from "../labor/labor-calculations";

export type WebsiteConversionScenarioInput = {
  monthlyWebsiteVisitors: number;
  currentConversionRate: number;
  modeledConversionRate: number;
  qualifiedLeadRate: number;
  closeRate: number;
  grossProfitPerSale: number;
};

/**
 * Visitors × Conversion Lift × Qualification Rate × Close Rate × Gross Profit,
 * annualised. Optional module: the ResponseOS preset omits it, and the
 * revenue-leak preset only runs it when website inputs are supplied.
 */
export function calculateWebsiteConversionScenario(input: WebsiteConversionScenarioInput) {
  const lift = Math.max(0, clampPercent(input.modeledConversionRate, 0) - clampPercent(input.currentConversionRate, 0)) / 100;
  const monthly =
    Math.max(0, input.monthlyWebsiteVisitors) *
    lift *
    (clampPercent(input.qualifiedLeadRate, 0) / 100) *
    (clampPercent(input.closeRate, 0) / 100) *
    Math.max(0, input.grossProfitPerSale);
  return { monthlyGrossProfit: monthly, annualGrossProfit: monthly * 12 };
}
