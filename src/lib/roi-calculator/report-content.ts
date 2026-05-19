import type { RoiCalculatorInput, RoiCalculatorResult } from "./types";

export type MapScore = {
  label: "Measurement" | "Attribution" | "Prediction";
  score: number;
  band: "Weak" | "Partial" | "Strong";
  reading: string;
};

export type ReportContent = {
  title: string;
  headline: string;
  executiveSnapshot: {
    annualSavings: number;
    monthlySavings: number;
    paybackMonths: number | null;
    readinessScore: number;
    confidenceTier: RoiCalculatorResult["confidenceTier"];
    summary: string;
  };
  revenueLeak: {
    monthly: number;
    annual: number;
    breakdown: Array<{ label: string; amount: number; note: string }>;
  };
  bottleneckDiagnosis: {
    workflow: string;
    cadence: string;
    weeklyLaborCost: number;
    paragraphs: string[];
  };
  signalVsNoise: {
    verdict: "Real signal" | "Signal buried in noise" | "Mostly noise" | "Signal unclear";
    paragraph: string;
  };
  mapLens: {
    measurement: MapScore;
    attribution: MapScore;
    prediction: MapScore;
    summary: string;
  };
  nextMove: {
    headline: string;
    paragraph: string;
  };
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
};

const WORKFLOW_LABEL: Record<string, string> = {
  "lead-routing": "lead routing and qualification",
  "client-onboarding": "client onboarding",
  reporting: "reporting and analysis",
  support: "support and operations",
  content: "content or campaign production",
  other: "the repetitive workflow you described",
};

const FREQUENCY_LABEL: Record<string, string> = {
  daily: "daily",
  weekly: "weekly",
  monthly: "monthly",
  occasional: "occasionally",
};

function band(score: number): MapScore["band"] {
  if (score >= 4) return "Strong";
  if (score >= 3) return "Partial";
  return "Weak";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function measurementScore(input: RoiCalculatorInput): MapScore {
  const score = (input.dataQuality + input.processClarity) / 2;
  const b = band(score);
  const reading = {
    Strong:
      "You have clean inputs and a process you can describe end-to-end. Most decisions can be tied back to evidence today.",
    Partial:
      "You can track the headline numbers but the supporting detail is noisy. Causal calls still rely on judgment more than data.",
    Weak:
      "Decisions are made on instinct because the underlying data is incomplete, inconsistent, or scattered across tools.",
  }[b];
  return { label: "Measurement", score: Math.round(score * 10) / 10, band: b, reading };
}

function attributionScore(input: RoiCalculatorInput): MapScore {
  const fragmentationInverted = 6 - input.toolFragmentation;
  const score = (input.sopMaturity + fragmentationInverted) / 2;
  const b = band(score);
  const reading = {
    Strong:
      "Your SOPs and tool stack are tight enough to trace cause and effect. You can say with confidence which lever moved which outcome.",
    Partial:
      "Some workflows are documented and consolidated, but the chain from action to result still breaks in places. Attribution is partial.",
    Weak:
      "Tools and processes are fragmented enough that you can't reliably tell which action produced which result. Attribution is mostly story.",
  }[b];
  return { label: "Attribution", score: Math.round(score * 10) / 10, band: b, reading };
}

function predictionScore(input: RoiCalculatorInput, result: RoiCalculatorResult): MapScore {
  const readinessNormalized = clamp(result.readinessScore / 20, 1, 5);
  const score = (input.teamAdoption + readinessNormalized) / 2;
  const b = band(score);
  const reading = {
    Strong:
      "Your team is ready to act on a forecast and your system is mature enough to feed one. You can plan from a model, not a guess.",
    Partial:
      "Forecasting is possible but adoption is uneven. Predictions will be used selectively, not as a default operating layer.",
    Weak:
      "Predictive work would not stick yet. Adoption gaps or system maturity gaps would absorb the value before it lands.",
  }[b];
  return { label: "Prediction", score: Math.round(score * 10) / 10, band: b, reading };
}

function diagnoseSignalVsNoise(input: RoiCalculatorInput, result: RoiCalculatorResult) {
  const readiness = result.readinessScore;
  const priority = result.priorityScore;
  const hasVolume = input.hoursPerWeek >= 6 || input.monthlyReworkCost >= 1000;

  let verdict: ReportContent["signalVsNoise"]["verdict"];
  let paragraph: string;

  if (priority >= 60 && readiness >= 65 && hasVolume) {
    verdict = "Real signal";
    paragraph =
      "There is a clear, repeatable workflow with measurable pain and enough internal maturity to execute on it. The signal is real. The risk is moving slowly while the cost compounds. Pick one workflow and scope an automation sprint.";
  } else if (priority >= 55 && readiness < 55) {
    verdict = "Signal buried in noise";
    paragraph =
      "The economics of automating this workflow look strong, but the underlying system is not ready to absorb it. Implementing AI on top of unclear SOPs, fragmented tooling, or weak data will amplify the noise instead of recovering the signal. Fix the substrate first.";
  } else if (priority < 40 && readiness < 50) {
    verdict = "Mostly noise";
    paragraph =
      "Right now the inputs read more like operational friction than a real AI opportunity. Tools will not fix it. The next move is diagnosis — understand which workflow is actually leaking revenue before investing in automation.";
  } else {
    verdict = "Signal unclear";
    paragraph =
      "The pattern is mixed. There is enough opportunity to take seriously but not enough clarity to act on without diagnosis. A short workflow audit will tell you whether to automate, pilot, or rebuild the underlying process first.";
  }

  return { verdict, paragraph };
}

function diagnoseBottleneck(input: RoiCalculatorInput, result: RoiCalculatorResult) {
  const workflow = WORKFLOW_LABEL[input.workflowType] ?? "the workflow you described";
  const cadence = FREQUENCY_LABEL[input.taskFrequency] ?? input.taskFrequency;
  const weeklyLaborCost = input.hoursPerWeek * input.hourlyCost;
  const annualLaborCost = weeklyLaborCost * 52;

  const paragraphs: string[] = [];
  paragraphs.push(
    `Your stated bottleneck is ${workflow}, run ${cadence}. At ${input.hoursPerWeek} hours per week at $${input.hourlyCost}/hr, that workflow is burning roughly $${Math.round(annualLaborCost).toLocaleString()} per year before any rework or delay costs are added.`,
  );

  if (input.errorFrequency === "high" || input.errorFrequency === "medium") {
    paragraphs.push(
      "You flagged error and rework cost as material. That is the higher-leverage fix — eliminating rework usually returns more than shaving minutes off the original task.",
    );
  } else if (input.errorFrequency === "unknown") {
    paragraphs.push(
      "Error rate is currently untracked. That is itself a signal: you cannot improve what you cannot see. Instrumenting this workflow is part of the next move.",
    );
  }

  if (input.delayPain === "severe") {
    paragraphs.push(
      "Cycle-time delay is severe enough to cost revenue. That moves this workflow up the priority list — the cost of waiting is higher than the cost of acting.",
    );
  }

  if (result.recommendation === "Diagnose the Workflow") {
    paragraphs.push(
      "The numbers say the highest-confidence move is not to automate yet. The shape of the workflow needs to be clarified before tooling can compound on top of it.",
    );
  }

  return { workflow, cadence, weeklyLaborCost, paragraphs };
}

function nextMoveFor(result: RoiCalculatorResult) {
  if (result.recommendation === "Automate Now") {
    return {
      headline: "Scope the first automation sprint.",
      paragraph:
        "Readiness, priority, and payback all line up. Pick the single workflow with the highest pain × clarity score, confirm data access, and run a focused implementation sprint with a clear owner. Resist scope creep — one workflow at a time is how this compounds.",
    };
  }
  if (result.recommendation === "Pilot First") {
    return {
      headline: "Run a contained pilot before scaling.",
      paragraph:
        "The opportunity is real but the system is not yet proven for automation. Build a tight pilot around one measurable bottleneck. The pilot is not the product — it is the evidence you need to commit to a larger build with confidence.",
    };
  }
  return {
    headline: "Diagnose the workflow before buying any tool.",
    paragraph:
      "Right now there is more noise than signal. Take the Signal Diagnostic to clarify which workflow actually leaks revenue, where the substrate is broken, and what the highest-leverage move is. Diagnosis is the lever — tools come after.",
  };
}

export function buildReportContent(
  input: RoiCalculatorInput,
  result: RoiCalculatorResult,
  ctaLinks: { signalDiagnostic: string; bookSession: string },
): ReportContent {
  const measurement = measurementScore(input);
  const attribution = attributionScore(input);
  const prediction = predictionScore(input, result);
  const signal = diagnoseSignalVsNoise(input, result);
  const next = nextMoveFor(result);

  const firstName = (input.name || "").trim().split(/\s+/)[0] || "Founder";

  return {
    title: "Your Signal ROI Snapshot",
    headline: `${firstName}, here is what the numbers say about your workflow.`,
    executiveSnapshot: {
      annualSavings: result.annualSavings,
      monthlySavings: result.monthlySavings,
      paybackMonths: result.paybackMonths,
      readinessScore: result.readinessScore,
      confidenceTier: result.confidenceTier,
      summary: `${result.recommendation} — ${result.recommendedNextAction}`,
    },
    revenueLeak: {
      monthly: result.monthlySavings,
      annual: result.annualSavings,
      breakdown: [
        {
          label: "Labor recapture",
          amount: result.savingsBreakdown.laborSavings,
          note: "Hours returned to higher-leverage work via automation of the repetitive workflow.",
        },
        {
          label: "Rework reduction",
          amount: result.savingsBreakdown.reworkSavings,
          note: "Cost of fixing errors and inconsistencies that should not have happened in the first place.",
        },
        {
          label: "Delay recovery",
          amount: result.savingsBreakdown.delayRecovery,
          note: "Revenue currently leaking out the back door of cycle-time pain — the cost of waiting.",
        },
      ],
    },
    bottleneckDiagnosis: diagnoseBottleneck(input, result),
    signalVsNoise: signal,
    mapLens: {
      measurement,
      attribution,
      prediction,
      summary:
        "M.A.P. is the lens we use to evaluate whether a workflow is ready to be automated, augmented, or rebuilt. Measurement is what you can see. Attribution is what you can prove. Prediction is what you can plan from.",
    },
    nextMove: next,
    cta: {
      primary: { label: "Book a Signal Audit", href: ctaLinks.bookSession },
      secondary: { label: "Complete the AI Readiness Diagnostic", href: ctaLinks.signalDiagnostic },
    },
  };
}
