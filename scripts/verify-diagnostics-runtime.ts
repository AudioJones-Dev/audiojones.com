/**
 * Phase 4B parity check — proves the generic Founder Gravity scoring adapter
 * reproduces the live `scoreFounderGravityAudit` 1:1 across sample profiles.
 * Behavioral counterpart to the Phase 4A type-conformance assertion.
 *
 * Run: pnpm exec tsx scripts/verify-diagnostics-runtime.ts
 * Exits non-zero on any divergence.
 *
 * Follows the precedent of scripts/verify-founder-gravity-audit.ts
 * (relative imports; no test runner required).
 */

import { FOUNDER_GRAVITY_QUESTIONS } from "../src/lib/founder-gravity-audit/content";
import { scoreFounderGravityAudit } from "../src/lib/founder-gravity-audit/scoring";
import { founderGravityScoringAdapter } from "../src/lib/diagnostics/runtime";

function answersFor(value: string): Record<string, string> {
  return Object.fromEntries(
    FOUNDER_GRAVITY_QUESTIONS.map((question) => {
      const option =
        question.options.find((item) => item.value === value) ??
        question.options.at(-1);
      return [question.id, option?.value ?? ""];
    }),
  );
}

const distributed: Record<string, string> = Object.fromEntries(
  FOUNDER_GRAVITY_QUESTIONS.map((question) => [
    question.id,
    question.options[0]?.value ?? "",
  ]),
);

const orbit = answersFor("4");
for (const question of FOUNDER_GRAVITY_QUESTIONS) {
  if (!orbit[question.id]) {
    orbit[question.id] = question.options.at(-1)?.value ?? "";
  }
}

// A partial, fast completion — exercises the suppression / low-confidence path.
const partial: Record<string, string> = Object.fromEntries(
  FOUNDER_GRAVITY_QUESTIONS.slice(0, 14).map((question) => [
    question.id,
    question.options[0]?.value ?? "",
  ]),
);

const cases = [
  { name: "distributed", answers: distributed, opts: { consentToContact: true, durationSeconds: 420 } },
  { name: "orbit", answers: orbit, opts: { consentToContact: true, durationSeconds: 420 } },
  { name: "partial/fast", answers: partial, opts: { consentToContact: true, durationSeconds: 30 } },
];

let failures = 0;
for (const testCase of cases) {
  const fg = scoreFounderGravityAudit(testCase.answers, testCase.opts);
  const adapted = founderGravityScoringAdapter.score(testCase.answers, testCase.opts);

  const checks: Array<[string, boolean]> = [
    ["primaryScore == gravityLoad", adapted.primaryScore === fg.gravityLoad],
    ["classification == segment", adapted.classification === fg.segment],
    ["moduleScores == layerScores", JSON.stringify(adapted.moduleScores) === JSON.stringify(fg.layerScores)],
    ["topModules == topLayers", JSON.stringify(adapted.topModules) === JSON.stringify(fg.topLayers)],
    ["highestModule == highestLayer", adapted.highestModule === fg.highestLayer],
    ["confidenceScore", adapted.confidenceScore === fg.confidenceScore],
    ["completedQuestionCount", adapted.completedQuestionCount === fg.completedQuestionCount],
    ["totalQuestionCount", adapted.totalQuestionCount === fg.totalQuestionCount],
    ["suppression", JSON.stringify(adapted.suppression) === JSON.stringify(fg.suppression)],
    ["cta", JSON.stringify(adapted.cta) === JSON.stringify(fg.cta)],
    ["signals.topFragilityZone", adapted.signals?.topFragilityZone === fg.topFragilityZone],
    ["signals.strongestContradictionSignal", adapted.signals?.strongestContradictionSignal === fg.strongestContradictionSignal],
    ["signals.resonanceZone", adapted.signals?.resonanceZone === fg.resonanceZone],
  ];

  for (const [label, ok] of checks) {
    if (!ok) {
      failures += 1;
      console.error(`FAIL [${testCase.name}] ${label}`);
    }
  }
}

if (failures > 0) {
  console.error(`\nverify-diagnostics-runtime: ${failures} parity check(s) failed.`);
  process.exit(1);
}

console.log(
  "verify-diagnostics-runtime: OK — founderGravityScoringAdapter matches scoreFounderGravityAudit 1:1 across distributed, orbit, and partial/fast profiles.",
);
