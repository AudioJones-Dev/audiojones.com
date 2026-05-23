import type {
  RoiCalculatorInput,
  RoiCalculatorResult,
  RoiConfidenceTier,
  RoiRecommendation,
} from "./types";

const WEEKS_PER_MONTH = 4.33;

const frequencyMultiplier: Record<string, number> = {
  daily: 1,
  weekly: 0.75,
  monthly: 0.45,
  occasional: 0.25,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundedDollars(value: number) {
  return Math.round(Math.max(0, value) / 100) * 100;
}

export function calculateRoiResult(input: RoiCalculatorInput): RoiCalculatorResult {
  const automationCapture = 0.42 * (frequencyMultiplier[input.taskFrequency] ?? 0.5);
  const manualLaborRecovery =
    input.hoursPerWeek * input.hourlyCost * WEEKS_PER_MONTH * automationCapture;

  const currentCloseRate = clamp(input.currentCloseRate, 0, 100);
  const liftedCloseRate = clamp(currentCloseRate + Math.max(0, input.speedToLeadLift), 0, 100);
  const currentMonthlyClosedRevenue =
    input.leadsPerMonth * (currentCloseRate / 100) * input.averageDealValue;
  const recoveredMonthlyRevenue =
    input.leadsPerMonth * (liftedCloseRate / 100) * input.averageDealValue;
  const revenueRecovery = Math.max(0, recoveredMonthlyRevenue - currentMonthlyClosedRevenue);

  const preventableErrorRate = clamp(input.preventableErrorRate, 0, 100);
  const errorReduction =
    input.errorsPerMonth * input.costPerError * (preventableErrorRate / 100);

  const ownerRecoverableRate = clamp(input.ownerRecoverableRate, 0, 100);
  const ownerCapacityUnlocked =
    input.ownerHoursPerWeek * input.ownerHourlyValue * WEEKS_PER_MONTH * (ownerRecoverableRate / 100);

  const headcountAvoidanceRate = clamp(input.headcountAvoidanceRate, 0, 100);
  const headcountAvoidance = input.avoidedHireMonthlyCost * (headcountAvoidanceRate / 100);

  const monthlySavings = roundedDollars(
    manualLaborRecovery +
      revenueRecovery +
      errorReduction +
      ownerCapacityUnlocked +
      headcountAvoidance,
  );
  const annualSavings = roundedDollars(monthlySavings * 12);

  const readinessScore = Math.round(
    clamp(
      ((input.processClarity + input.dataQuality + input.sopMaturity + input.teamAdoption + (6 - input.toolFragmentation)) /
        25) *
        100,
      0,
      100,
    ),
  );

  const impactScore = clamp(monthlySavings / 500, 0, 60);
  const leverPressure =
    (revenueRecovery > 0 ? 12 : 0) +
    (errorReduction > 0 ? 8 : 0) +
    (ownerCapacityUnlocked > 0 ? 6 : 0) +
    (headcountAvoidance > 0 ? 4 : 0);
  const priorityScore = Math.round(clamp(impactScore + leverPressure + readinessScore * 0.25, 0, 100));
  const paybackMonths = input.implementationBudget > 0 && monthlySavings > 0
    ? Math.max(1, Math.round((input.implementationBudget / monthlySavings) * 10) / 10)
    : null;

  let confidenceTier: RoiConfidenceTier = "Low";
  if (readinessScore >= 72 && input.hoursPerWeek >= 8 && monthlySavings >= 2000) confidenceTier = "High";
  else if (readinessScore >= 50 && input.hoursPerWeek >= 4) confidenceTier = "Medium";

  let recommendation: RoiRecommendation = "Diagnose the Workflow";
  if (readinessScore >= 70 && priorityScore >= 65 && (paybackMonths == null || paybackMonths <= 9)) {
    recommendation = "Automate Now";
  } else if (readinessScore >= 50 && priorityScore >= 45) {
    recommendation = "Pilot First";
  }

  const recommendedNextAction = {
    "Automate Now": "Scope the first workflow, confirm data access, and move into a focused implementation sprint.",
    "Pilot First": "Run a contained pilot around one measurable bottleneck before committing to a larger automation build.",
    "Diagnose the Workflow": "Take the Signal Diagnostic to clarify where AI will create leverage before you invest in tooling.",
  }[recommendation];

  return {
    monthlySavings,
    annualSavings,
    paybackMonths,
    readinessScore,
    priorityScore,
    confidenceTier,
    recommendation,
    recommendedNextAction,
    savingsBreakdown: {
      manualLaborRecovery: roundedDollars(manualLaborRecovery),
      revenueRecovery: roundedDollars(revenueRecovery),
      errorReduction: roundedDollars(errorReduction),
      ownerCapacityUnlocked: roundedDollars(ownerCapacityUnlocked),
      headcountAvoidance: roundedDollars(headcountAvoidance),
    },
  };
}
