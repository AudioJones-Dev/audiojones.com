import {
  FOUNDER_GRAVITY_QUESTIONS,
  GRAVITY_LAYERS,
  SEGMENT_CTAS,
} from "./content";
import type {
  FounderGravityResult,
  FounderGravitySegment,
  GravityLayerId,
} from "./types";

const LAYER_IDS = Object.keys(GRAVITY_LAYERS) as GravityLayerId[];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function selectedScore(questionId: string, answers: Record<string, string>) {
  const question = FOUNDER_GRAVITY_QUESTIONS.find((item) => item.id === questionId);
  if (!question) return null;
  const option = question.options.find((item) => item.value === answers[question.id]);
  return option?.score ?? null;
}

function segmentFromScores(
  gravityLoad: number,
  layerScores: Record<GravityLayerId, number>,
  contradictionScore: number,
): FounderGravitySegment {
  const highLayerCount = Object.values(layerScores).filter((score) => score >= 70).length;
  if (gravityLoad >= 82 || highLayerCount >= 4) return "Orbit";
  if (gravityLoad >= 65) return "High Pull";
  if (contradictionScore >= 24 && gravityLoad >= 40) return "Drift";
  if (gravityLoad >= 35) return "Stabilizing";
  return "Distributed";
}

function contradictionSignal(score: number) {
  if (score >= 32) {
    return "claimed delegation vs revealed dependency concentration";
  }
  if (score >= 20) {
    return "partial autonomy claim vs operational exposure pattern";
  }
  if (score >= 10) {
    return "light mismatch between stated autonomy and dependency mapping";
  }
  return "low contradiction between stated autonomy and revealed routing";
}

function getTopFragilityZone(answers: Record<string, string>, highestLayer: GravityLayerId) {
  const scenarioZones = FOUNDER_GRAVITY_QUESTIONS.flatMap((question) => {
    const selected = question.options.find((option) => option.value === answers[question.id]);
    return selected?.fragilityZone ? [selected.fragilityZone] : [];
  });
  return scenarioZones[0] || `${GRAVITY_LAYERS[highestLayer]} concentration`;
}

export function scoreFounderGravityAudit(
  answers: Record<string, string>,
  opts: { durationSeconds?: number; consentToContact?: boolean } = {},
): FounderGravityResult {
  const completedQuestionCount = FOUNDER_GRAVITY_QUESTIONS.filter(
    (question) => answers[question.id],
  ).length;
  const totalQuestionCount = FOUNDER_GRAVITY_QUESTIONS.length;

  const layerTotals = Object.fromEntries(
    LAYER_IDS.map((layer) => [layer, { weightedScore: 0, max: 0 }]),
  ) as Record<GravityLayerId, { weightedScore: number; max: number }>;

  for (const question of FOUNDER_GRAVITY_QUESTIONS) {
    const selected = question.options.find((option) => option.value === answers[question.id]);
    if (!selected) continue;

    if (question.layer) {
      const weight = question.weight ?? 1;
      const score = selected.score ?? 0;
      layerTotals[question.layer].weightedScore += score * weight;
      layerTotals[question.layer].max += 4 * weight;
    }

    if (selected.layerScores) {
      for (const layer of LAYER_IDS) {
        const score = selected.layerScores[layer];
        if (score == null) continue;
        layerTotals[layer].weightedScore += score;
        layerTotals[layer].max += 4;
      }
    }
  }

  const layerScores = Object.fromEntries(
    LAYER_IDS.map((layer) => {
      const item = layerTotals[layer];
      return [layer, item.max ? Math.round((item.weightedScore / item.max) * 100) : 0];
    }),
  ) as Record<GravityLayerId, number>;

  const layerAverage = average(Object.values(layerScores));
  const scenarioScores = FOUNDER_GRAVITY_QUESTIONS.filter((item) => item.role === "scenario")
    .map((question) => {
      const selected = question.options.find((option) => option.value === answers[question.id]);
      if (!selected) return null;
      const values = Object.values(selected.layerScores ?? {});
      return values.length > 0 ? average(values) : 0;
    })
    .filter((value): value is number => value != null);
  const scenarioAverage = (average(scenarioScores) / 4) * 100;

  const selfPerceptionScores = [
    selectedScore("autonomy_baseline", answers),
    selectedScore("availability_bottleneck", answers),
    selectedScore("standards_clarity", answers),
  ].filter((value): value is number => value != null);
  const claimedDependency = (average(selfPerceptionScores) / 4) * 100;

  const gravityLoad = Math.round(
    clamp(layerAverage * 0.68 + scenarioAverage * 0.22 + claimedDependency * 0.1),
  );

  const contradictionScore = Math.round(clamp(Math.max(0, layerAverage - claimedDependency)));
  const topLayers = [...LAYER_IDS].sort((a, b) => layerScores[b] - layerScores[a]).slice(0, 3);
  const highestLayer = topLayers[0] ?? "decision";
  const confidenceBase = 55 + (completedQuestionCount / totalQuestionCount) * 35;
  const scenarioCoverage =
    FOUNDER_GRAVITY_QUESTIONS.filter((item) => item.role === "scenario" && answers[item.id])
      .length / 3;
  const confidenceScore = Math.round(clamp(confidenceBase + scenarioCoverage * 10));
  const segment = segmentFromScores(gravityLoad, layerScores, contradictionScore);

  const duration = opts.durationSeconds ?? 0;
  const suppression =
    opts.consentToContact === false
      ? { suppressed: true, reason: "consent_withdrawn" as const }
      : confidenceScore < 65
        ? { suppressed: true, reason: "low_confidence_score" as const }
        : duration > 0 && duration < 90
          ? { suppressed: true, reason: "speedrun_completion" as const }
          : contradictionScore >= 42
            ? { suppressed: true, reason: "self_perception_noise" as const }
            : { suppressed: false, reason: null };

  return {
    segment,
    gravityLoad,
    layerScores,
    topLayers,
    highestLayer,
    topFragilityZone: getTopFragilityZone(answers, highestLayer),
    strongestContradictionSignal: contradictionSignal(contradictionScore),
    resonanceZone: highestLayer,
    confidenceScore,
    completedQuestionCount,
    totalQuestionCount,
    suppression,
    cta: SEGMENT_CTAS[segment],
  };
}
