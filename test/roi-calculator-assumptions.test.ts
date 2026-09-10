import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateRoiResult,
  DEFAULT_AUTOMATION_CAPTURE_RATE,
  effectiveCaptureRate,
  frequencyMultiplier,
} from "../src/lib/roi-calculator/calculations";
import { roiInputSchema } from "../src/lib/roi-calculator/roi-calculator-schema";
import type { RoiCalculatorInput } from "../src/lib/roi-calculator/types";

// A deliberately minimal input: every lever except manual-labour recovery is
// zeroed, so `monthlySavings` isolates the capture-rate assumption under test.
const baseInput: RoiCalculatorInput = {
  industry: "Professional services",
  companySize: "2-10",
  monthlyRevenue: "$50k-$100k",
  workflowType: "reporting",
  taskFrequency: "daily",
  hoursPerWeek: 10,
  hourlyCost: 100,
  leadsPerMonth: 0,
  averageDealValue: 0,
  currentCloseRate: 0,
  speedToLeadLift: 0,
  errorsPerMonth: 0,
  costPerError: 0,
  preventableErrorRate: 0,
  ownerHoursPerWeek: 0,
  ownerHourlyValue: 0,
  ownerRecoverableRate: 0,
  avoidedHireMonthlyCost: 0,
  headcountAvoidanceRate: 0,
  implementationBudget: 0,
  timelineExpectation: "60 days",
  internalOwner: "Founder",
  processClarity: 3,
  dataQuality: 3,
  sopMaturity: 3,
  toolFragmentation: 3,
  teamAdoption: 3,
  name: "Test",
  email: "test@example.com",
  company: "Test Co",
};

test("omitting the capture rate reproduces the previous hardcoded 0.42", () => {
  // Guards the migration: rows persisted before `automationCaptureRate`
  // existed must still calculate exactly as they did when they were captured.
  const withoutRate = calculateRoiResult(baseInput);
  const withExplicitDefault = calculateRoiResult({
    ...baseInput,
    automationCaptureRate: DEFAULT_AUTOMATION_CAPTURE_RATE,
  });

  assert.equal(withoutRate.monthlySavings, withExplicitDefault.monthlySavings);
  // 10h × $100 × 4.33 weeks × 0.42 × 1.0 (daily) = 1,818.60, rounded to the
  // nearest $100 by `roundedDollars` → 1,800.
  assert.equal(withoutRate.monthlySavings, 1800);
});

test("the capture rate actually drives the headline number", () => {
  // If this ever stops holding, the input is decorative and the disclosure on
  // the results panel is lying to the visitor.
  const low = calculateRoiResult({ ...baseInput, automationCaptureRate: 10 });
  const high = calculateRoiResult({ ...baseInput, automationCaptureRate: 80 });

  assert.ok(high.monthlySavings > low.monthlySavings);
  assert.equal(calculateRoiResult({ ...baseInput, automationCaptureRate: 0 }).monthlySavings, 0);
});

test("effectiveCaptureRate matches what the formula applies", () => {
  // The UI shows this number to the visitor; it must be the same one the
  // savings figure was derived from, not a re-derived approximation.
  for (const frequency of Object.keys(frequencyMultiplier)) {
    const input = { ...baseInput, taskFrequency: frequency, automationCaptureRate: 50 };
    const expected = 0.5 * frequencyMultiplier[frequency];

    assert.equal(effectiveCaptureRate(input), expected);

    const hours = input.hoursPerWeek * input.hourlyCost * 4.33;
    const predicted = Math.round((hours * expected) / 100) * 100;
    assert.equal(calculateRoiResult(input).monthlySavings, predicted);
  }
});

test("an unknown frequency falls back rather than collapsing to zero", () => {
  assert.equal(
    effectiveCaptureRate({ taskFrequency: "not-a-frequency", automationCaptureRate: 50 }),
    0.5 * 0.5,
  );
});

test("the schema defaults a missing capture rate instead of rejecting it", () => {
  // The server re-runs the calculation and rejects any client/server mismatch,
  // so a payload without this field must parse to the same default the client
  // used — otherwise every legacy submission would 400.
  const { automationCaptureRate: _omitted, ...withoutRate } = baseInput;
  const parsed = roiInputSchema.parse(withoutRate);

  assert.equal(parsed.automationCaptureRate, DEFAULT_AUTOMATION_CAPTURE_RATE);
});

test("the schema rejects a capture rate above 100%", () => {
  assert.throws(() =>
    roiInputSchema.parse({ ...baseInput, automationCaptureRate: 140 }),
  );
});
