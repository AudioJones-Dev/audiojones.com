"use client";

import { useMemo, useState } from "react";
import DiagnosticForm from "./DiagnosticForm";
import DiagnosticIntro from "./DiagnosticIntro";
import DiagnosticResults from "./DiagnosticResults";
import { DEFAULT_INPUT } from "@/lib/ai-roi-diagnostic/constants";
import { calculateDiagnostic } from "@/lib/ai-roi-diagnostic/scoring";
import type { DiagnosticInput } from "@/lib/ai-roi-diagnostic/types";

type Phase = "intro" | "form" | "results";

export default function AiRoiDiagnostic() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [input, setInput] = useState<DiagnosticInput>(DEFAULT_INPUT);

  const result = useMemo(() => calculateDiagnostic(input), [input]);

  const restart = () => {
    setInput(DEFAULT_INPUT);
    setPhase("intro");
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {phase === "intro" && (
        <DiagnosticIntro onStart={() => setPhase("form")} />
      )}
      {phase === "form" && (
        <DiagnosticForm
          value={input}
          onChange={setInput}
          onComplete={() => setPhase("results")}
        />
      )}
      {phase === "results" && (
        <DiagnosticResults
          input={input}
          result={result}
          onRestart={restart}
        />
      )}
    </div>
  );
}
