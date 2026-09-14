import { clampPercent } from "../labor/labor-calculations";

export type QuoteFollowupScenarioInput = {
  unfollowedQuotesPerMonth: number;
  historicalQuoteCloseRate: number;
  grossProfitPerSale: number;
  recoverabilityRate: number;
};

/** Unworked Quotes × Historical Close Rate × Gross Profit × Recoverability, annualised. */
export function calculateQuoteFollowupScenario(input: QuoteFollowupScenarioInput) {
  const monthly =
    Math.max(0, input.unfollowedQuotesPerMonth) *
    (clampPercent(input.historicalQuoteCloseRate, 0) / 100) *
    Math.max(0, input.grossProfitPerSale) *
    (clampPercent(input.recoverabilityRate, 0) / 100);
  return { monthlyGrossProfit: monthly, annualGrossProfit: monthly * 12 };
}
