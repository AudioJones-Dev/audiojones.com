import assert from "node:assert/strict";
import test from "node:test";

import { calculateAfterHoursScenario } from "../src/lib/roi-calculator/scenarios/after-hours";
import { calculateDelayedResponseScenario } from "../src/lib/roi-calculator/scenarios/delayed-response";
import { calculateMissedCallsScenario } from "../src/lib/roi-calculator/scenarios/missed-calls";
import { calculateQuoteFollowupScenario } from "../src/lib/roi-calculator/scenarios/quote-followup";
import { calculateWebsiteConversionScenario } from "../src/lib/roi-calculator/scenarios/website-conversion";
import { resolveGrossProfit } from "../src/lib/roi-calculator/scorecard";

test("missed calls: zero calls means zero recovery", () => {
  const result = calculateMissedCallsScenario({
    missedCallsPerMonth: 0,
    qualifiedOpportunityRate: 40,
    closeRate: 35,
    grossProfitPerSale: 6000,
    recoverabilityRate: 50,
  });
  assert.equal(result.monthlyGrossProfit, 0);
  assert.equal(result.annualGrossProfit, 0);
});

test("missed calls: partial qualification and partial recoverability both scale the result", () => {
  // 20 × 0.4 × 0.35 × 6000 × 0.5 = 8,400/month
  const result = calculateMissedCallsScenario({
    missedCallsPerMonth: 20,
    qualifiedOpportunityRate: 40,
    closeRate: 35,
    grossProfitPerSale: 6000,
    recoverabilityRate: 50,
  });
  assert.equal(result.qualifiedOpportunitiesPerMonth, 8);
  assert.equal(Math.round(result.monthlyGrossProfit), 8400);
  assert.equal(Math.round(result.annualGrossProfit), 100800);

  const fullyRecoverable = calculateMissedCallsScenario({
    missedCallsPerMonth: 20,
    qualifiedOpportunityRate: 40,
    closeRate: 35,
    grossProfitPerSale: 6000,
    recoverabilityRate: 100,
  });
  assert.equal(Math.round(fullyRecoverable.monthlyGrossProfit), 16800);
});

test("missed calls: the calculation is gross-profit based, not revenue based", () => {
  const entered = resolveGrossProfit({ name: "Job", averageSaleValue: 10000, grossProfitPerSale: 4000 });
  assert.equal(entered.basis, "entered");
  assert.equal(entered.grossProfitPerSale, 4000);

  const derived = resolveGrossProfit({ name: "Job", averageSaleValue: 10000, grossMarginPercent: 40 });
  assert.equal(derived.basis, "derived");
  assert.equal(derived.grossProfitPerSale, 4000);

  const revenueOnly = resolveGrossProfit({ name: "Job", averageSaleValue: 10000 });
  assert.equal(revenueOnly.basis, "revenue_only");
  assert.equal(revenueOnly.grossProfitPerSale, 10000, "revenue is substituted but labelled, never silently treated as profit");

  assert.equal(resolveGrossProfit({ name: "Job" }).basis, "missing");
});

test("after-hours: capture rate limits recovered demand", () => {
  // 10 × 0.5 × 0.2 × 1000 × 0.4 = 400/month
  const result = calculateAfterHoursScenario({
    afterHoursCallsPerMonth: 10,
    qualifiedOpportunityRate: 50,
    closeRate: 20,
    grossProfitPerSale: 1000,
    captureRate: 40,
  });
  assert.equal(result.monthlyGrossProfit, 400);
  assert.equal(calculateAfterHoursScenario({ ...{ afterHoursCallsPerMonth: 10, qualifiedOpportunityRate: 50, closeRate: 20, grossProfitPerSale: 1000 }, captureRate: 0 }).monthlyGrossProfit, 0);
});

test("quotes: zero quotes, historical close rate, and recoverability", () => {
  const base = { historicalQuoteCloseRate: 30, grossProfitPerSale: 2000, recoverabilityRate: 50 };
  assert.equal(calculateQuoteFollowupScenario({ ...base, unfollowedQuotesPerMonth: 0 }).annualGrossProfit, 0);
  // 10 × 0.3 × 2000 × 0.5 = 3,000/month
  assert.equal(calculateQuoteFollowupScenario({ ...base, unfollowedQuotesPerMonth: 10 }).monthlyGrossProfit, 3000);
  assert.equal(calculateQuoteFollowupScenario({ ...base, unfollowedQuotesPerMonth: 10, historicalQuoteCloseRate: 60 }).monthlyGrossProfit, 6000);
  assert.equal(calculateQuoteFollowupScenario({ ...base, unfollowedQuotesPerMonth: 10, recoverabilityRate: 0 }).monthlyGrossProfit, 0);
});

test("delayed response: no lift means no upside", () => {
  const result = calculateDelayedResponseScenario({ leadsAffectedPerMonth: 50, currentCloseRate: 30, closeRateLift: 0, grossProfitPerSale: 1000 });
  assert.equal(result.monthlyGrossProfit, 0);
  assert.equal(result.improvedCloseRate, 30);
});

test("delayed response: positive lift applies to affected leads only", () => {
  // 50 × 0.05 × 1000 = 2,500/month
  const result = calculateDelayedResponseScenario({ leadsAffectedPerMonth: 50, currentCloseRate: 30, closeRateLift: 5, grossProfitPerSale: 1000 });
  assert.equal(result.monthlyGrossProfit, 2500);
  assert.equal(result.improvedCloseRate, 35);
});

test("delayed response: the improved close rate cannot exceed 100%", () => {
  const result = calculateDelayedResponseScenario({ leadsAffectedPerMonth: 10, currentCloseRate: 98, closeRateLift: 20, grossProfitPerSale: 1000 });
  assert.equal(result.improvedCloseRate, 100);
  assert.equal(Math.round(result.monthlyGrossProfit), 200, "only the 2 points up to 100% count");
  const negative = calculateDelayedResponseScenario({ leadsAffectedPerMonth: 10, currentCloseRate: 50, closeRateLift: -20, grossProfitPerSale: 1000 });
  assert.equal(negative.monthlyGrossProfit, 0, "a negative lift never subtracts");
});

test("website conversion: only the lift above the current rate counts", () => {
  // 10000 × 0.01 × 0.5 × 0.2 × 1000 = 10,000/month
  const result = calculateWebsiteConversionScenario({
    monthlyWebsiteVisitors: 10000,
    currentConversionRate: 2,
    modeledConversionRate: 3,
    qualifiedLeadRate: 50,
    closeRate: 20,
    grossProfitPerSale: 1000,
  });
  assert.equal(Math.round(result.monthlyGrossProfit), 10000);
  const worse = calculateWebsiteConversionScenario({ monthlyWebsiteVisitors: 10000, currentConversionRate: 3, modeledConversionRate: 2, qualifiedLeadRate: 50, closeRate: 20, grossProfitPerSale: 1000 });
  assert.equal(worse.monthlyGrossProfit, 0);
});
