import { FOUNDER_GRAVITY_QUESTIONS } from "../src/lib/founder-gravity-audit/content";
import { scoreFounderGravityAudit } from "../src/lib/founder-gravity-audit/scoring";

function answersFor(value: string) {
  return Object.fromEntries(
    FOUNDER_GRAVITY_QUESTIONS.map((question) => {
      const option = question.options.find((item) => item.value === value) ?? question.options.at(-1);
      return [question.id, option?.value ?? ""];
    }),
  );
}

const distributed = Object.fromEntries(
  FOUNDER_GRAVITY_QUESTIONS.map((question) => [question.id, question.options[0]?.value ?? ""]),
);
const orbit = answersFor("4");
for (const question of FOUNDER_GRAVITY_QUESTIONS) {
  if (!orbit[question.id]) {
    orbit[question.id] = question.options.at(-1)?.value ?? "";
  }
}

const cases = [
  {
    name: "distributed profile",
    result: scoreFounderGravityAudit(distributed, {
      consentToContact: true,
      durationSeconds: 420,
    }),
    expected: "Distributed",
  },
  {
    name: "high dependency profile",
    result: scoreFounderGravityAudit(orbit, {
      consentToContact: true,
      durationSeconds: 420,
    }),
    expected: "Orbit",
  },
];

for (const item of cases) {
  if (item.result.segment !== item.expected) {
    throw new Error(
      `${item.name} expected ${item.expected}, got ${item.result.segment}`,
    );
  }
  if (item.result.completedQuestionCount !== FOUNDER_GRAVITY_QUESTIONS.length) {
    throw new Error(`${item.name} did not count all answered questions`);
  }
}

console.log(
  JSON.stringify(
    cases.map((item) => ({
      name: item.name,
      segment: item.result.segment,
      gravityLoad: item.result.gravityLoad,
      confidenceScore: item.result.confidenceScore,
      suppression: item.result.suppression,
    })),
    null,
    2,
  ),
);
