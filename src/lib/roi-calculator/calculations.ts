import type {
  RoiCalculatorInput,
  RoiCalculatorResult,
  RoiConfidenceTier,
  RoiRecommendation,
} from "./types";

const frequencyMultiplier: Record<string, number> = {
  daily: 1,
  weekly: 0.75,
  monthly: 0.45,
  occasional: 0.25,
};

const errorMultiplier: Record<string, number> = {
  high: 0.85,
  medium: 0.55,
  low: 0.25,
  unknown: 0.35,
};

const delayMultiplier: Record<string, number> = {
  severe: 0.18,
  moderate: 0.1,
  light: 0.04,
  unclear: 0.06,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundedDollars(value: number) {
  return Math.round(value / 100) * 100;
}

function revenueMidpoint(range: string) {
  switch (range) {
    case "under-25k":
      return 15000;
    case "25k-100k":
      return 62500;
    case "100k-500k":
      return 300000;
    case "500k-plus":
      return 650000;
    default:
      return 75000;
  }
}

export function calculateRoiResult(input: RoiCalculatorInput): RoiCalculatorResult {
  const weeklyLaborCost = input.hoursPerWeek * input.hourlyCost;
  const automationCapture = 0.42 * (frequencyMultiplier[input.taskFrequency] ?? 0.5);
  const laborSavings = weeklyLaborCost * 4.33 * automationCapture;
  const reworkSavings = input.monthlyReworkCost * (errorMultiplier[input.errorFrequency] ?? 0.35);
  const delayRecovery = revenueMidpoint(input.monthlyRevenue) * (delayMultiplier[input.delayPain] ?? 0.06);
  const monthlySavings = roundedDollars(laborSavings + reworkSavings + delayRecovery);
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
  const urgencyScore = (errorMultiplier[input.errorFrequency] ?? 0.35) * 20 + (delayMultiplier[input.delayPain] ?? 0.06) * 100;
  const priorityScore = Math.round(clamp(impactScore + urgencyScore + readinessScore * 0.25, 0, 100));
  const paybackMonths = input.implementationBudget > 0 && monthlySavings > 0
    ? Math.max(1, Math.round((input.implementationBudget / monthlySavings) * 10) / 10)
    : null;

  let confidenceTier: RoiConfidenceTier = "Low";
  if (readinessScore >= 72 && input.hoursPerWeek >= 8 && input.monthlyReworkCost >= 500) confidenceTier = "High";
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
      laborSavings: roundedDollars(laborSavings),
      reworkSavings: roundedDollars(reworkSavings),
      delayRecovery: roundedDollars(delayRecovery),
    },
  };
}
