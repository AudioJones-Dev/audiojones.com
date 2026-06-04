"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  FOUNDER_GRAVITY_QUESTIONS,
  GRAVITY_LAYERS,
  SEGMENT_DEFINITIONS,
  SEGMENT_PREVIEW_COPY,
} from "@/lib/founder-gravity-audit/content";
import { scoreFounderGravityAudit } from "@/lib/founder-gravity-audit/scoring";
import type {
  FounderGravityAttribution,
  FounderGravityResult,
} from "@/lib/founder-gravity-audit/types";

const STORAGE_DRAFT_KEY = "audiojones:fga:draft";
const STORAGE_REPORT_KEY = "audiojones:fga:last-report";

type FunnelEvent = {
  event: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

type StoredReport = {
  leadId: string;
  result: FounderGravityResult;
  submittedAt: string;
  founder: {
    email: string;
    displayName: string;
    entityName: string;
  };
};

type GateState = {
  email: string;
  displayName: string;
  entityName: string;
  consentToContact: boolean;
  website_url: string;
};

const INITIAL_GATE: GateState = {
  email: "",
  displayName: "",
  entityName: "",
  consentToContact: false,
  website_url: "",
};

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `fga-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function stageLabel(stage: string) {
  return stage
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function getAttribution(): FounderGravityAttribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    acquisitionChannel: params.get("utm_medium") || params.get("utm_source") || "direct",
    sourcePage: "/founder-gravity-audit/diagnostic",
    referrer: document.referrer || undefined,
    landingPath: window.location.pathname + window.location.search,
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    utmContent: params.get("utm_content") || undefined,
  };
}

function emitBrowserEvent(event: FunnelEvent) {
  if (typeof window === "undefined") return;
  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  win.dataLayer?.push({ event: `fga_${event.event}`, ...event.metadata });
  window.dispatchEvent(
    new CustomEvent("audiojones:fga_event", {
      detail: event,
    }),
  );
}

export default function FounderGravityAuditFlow() {
  const router = useRouter();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [gate, setGate] = useState<GateState>(INITIAL_GATE);
  const [sessionId, setSessionId] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [attribution, setAttribution] = useState<FounderGravityAttribution>({});
  const [events, setEvents] = useState<FunnelEvent[]>([]);
  const [mode, setMode] = useState<"questions" | "preview">("questions");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = FOUNDER_GRAVITY_QUESTIONS[questionIndex];
  const result = useMemo(
    () =>
      scoreFounderGravityAudit(answers, {
        consentToContact: gate.consentToContact,
        durationSeconds: startedAt ? Math.round((Date.now() - startedAt) / 1000) : undefined,
      }),
    [answers, gate.consentToContact, startedAt],
  );

  useEffect(() => {
    const nextSessionId = createSessionId();
    setSessionId(nextSessionId);
    setStartedAt(Date.now());
    setAttribution(getAttribution());

    const saved = localStorage.getItem(STORAGE_DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved) as {
          answers?: Record<string, string>;
          questionIndex?: number;
        };
        setAnswers(draft.answers ?? {});
        setQuestionIndex(
          Math.min(Math.max(draft.questionIndex ?? 0, 0), FOUNDER_GRAVITY_QUESTIONS.length - 1),
        );
      } catch {
        localStorage.removeItem(STORAGE_DRAFT_KEY);
      }
    }

    recordEvent("diagnostic_started", { sessionId: nextSessionId });
  }, []);

  function recordEvent(eventName: string, metadata?: Record<string, unknown>) {
    const event = {
      event: eventName,
      timestamp: new Date().toISOString(),
      metadata,
    };
    setEvents((prev) => [...prev, event].slice(-50));
    emitBrowserEvent(event);
    return event;
  }

  function saveDraft() {
    localStorage.setItem(
      STORAGE_DRAFT_KEY,
      JSON.stringify({
        answers,
        questionIndex,
        savedAt: new Date().toISOString(),
      }),
    );
    recordEvent("diagnostic_saved", { questionIndex });
  }

  function answerQuestion(value: string) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }

  function nextQuestion() {
    if (questionIndex >= FOUNDER_GRAVITY_QUESTIONS.length - 1) {
      setMode("preview");
      recordEvent("diagnostic_completed", {
        completedQuestionCount: result.completedQuestionCount,
      });
      recordEvent("preview_viewed", {
        segment: result.segment,
        gravityLoad: result.gravityLoad,
      });
      return;
    }
    setQuestionIndex((value) => value + 1);
  }

  function skipQuestion() {
    recordEvent("question_skipped", { questionId: currentQuestion?.id });
    nextQuestion();
  }

  async function submitGate() {
    setError(null);
    if (result.completedQuestionCount < 12) {
      setError("Answer at least 12 diagnostic items before requesting the full report.");
      return;
    }
    setSubmitting(true);
    const gateEvent = {
      event: "email_gate_submitted",
      timestamp: new Date().toISOString(),
      metadata: {
        segment: result.segment,
        gravityLoad: result.gravityLoad,
      },
    };
    emitBrowserEvent(gateEvent);

    try {
      const res = await fetch("/api/founder-gravity-audit/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...gate,
          sessionId,
          answers,
          durationSeconds: startedAt ? Math.round((Date.now() - startedAt) / 1000) : undefined,
          attribution,
          events: [...events, gateEvent],
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        leadId?: string;
        result?: FounderGravityResult;
        message?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.result || !data.leadId) {
        throw new Error(data.message || data.error || "Report request failed.");
      }

      const stored: StoredReport = {
        leadId: data.leadId,
        result: data.result,
        submittedAt: new Date().toISOString(),
        founder: {
          email: gate.email,
          displayName: gate.displayName,
          entityName: gate.entityName,
        },
      };
      sessionStorage.setItem(STORAGE_REPORT_KEY, JSON.stringify(stored));
      localStorage.removeItem(STORAGE_DRAFT_KEY);
      recordEvent("report_viewed", {
        leadId: data.leadId,
        segment: data.result.segment,
      });
      router.push("/founder-gravity-audit/report");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Report request failed.");
      setSubmitting(false);
    }
  }

  if (mode === "preview") {
    return (
      <section className="bg-bg-base py-12 sm:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_420px]">
          <div className="aj-card is-surface-2">
            <p className="t-label">Preview Reveal</p>
            <h1 className="mt-4 t-h2">Your Founder Gravity signal is visible.</h1>
            <p className="mt-4 max-w-2xl t-body-lg text-fg-1">
              This is the preview only. The full report adds the operating layer
              breakdown, fragility zone, contradiction signal, and the next move
              that matches your dependency pattern.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Metric label="Gravity Load" value={`${result.gravityLoad}`} />
              <Metric label="Segment" value={result.segment} />
              <Metric label="Highest Layer" value={GRAVITY_LAYERS[result.highestLayer]} />
            </div>

            <div className="mt-8 aj-callout is-blue">
              <p className="font-semibold text-fg-0">{SEGMENT_DEFINITIONS[result.segment]}</p>
              <p className="mt-2 text-fg-1">{SEGMENT_PREVIEW_COPY[result.segment]}</p>
            </div>
          </div>

          <div className="aj-form-panel">
            <p className="t-label">Full Report Gate</p>
            <h2 className="mt-4 t-h4">Send the full intelligence report.</h2>
            <p className="mt-3 t-small">
              No phone number or calendar embed. This gate only captures enough
              context to route the report and preserve attribution.
            </p>

            <div className="mt-6 grid gap-4">
              <Field label="Email">
                <input
                  type="email"
                  className="aj-input"
                  data-fga-gate-email
                  value={gate.email}
                  onChange={(event) => setGate((prev) => ({ ...prev, email: event.target.value }))}
                />
              </Field>
              <Field label="Display name">
                <input
                  className="aj-input"
                  data-fga-gate-display-name
                  value={gate.displayName}
                  onChange={(event) =>
                    setGate((prev) => ({ ...prev, displayName: event.target.value }))
                  }
                />
              </Field>
              <Field label="Entity name">
                <input
                  className="aj-input"
                  data-fga-gate-entity-name
                  value={gate.entityName}
                  onChange={(event) =>
                    setGate((prev) => ({ ...prev, entityName: event.target.value }))
                  }
                />
              </Field>
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
                value={gate.website_url}
                onChange={(event) =>
                  setGate((prev) => ({ ...prev, website_url: event.target.value }))
                }
              />
              <label className="flex items-start gap-3 border border-border-subtle bg-surface-1 p-4">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-signal-yellow"
                  data-fga-gate-consent
                  checked={gate.consentToContact}
                  onChange={(event) =>
                    setGate((prev) => ({
                      ...prev,
                      consentToContact: event.target.checked,
                    }))
                  }
                />
                <span className="t-small text-fg-1">
                  I consent to Audio Jones contacting me about this diagnostic
                  report and related next steps.
                </span>
              </label>
            </div>

            {error && (
              <p role="alert" className="mt-4 border border-accent-red/50 bg-accent-red/10 p-3 t-small text-accent-red">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                className="w-full"
                data-fga-submit
                disabled={
                  submitting ||
                  !gate.email ||
                  !gate.displayName ||
                  !gate.entityName ||
                  !gate.consentToContact
                }
                onClick={submitGate}
              >
                {submitting ? "Generating report..." : "Generate full report"}
              </Button>
              <button
                type="button"
                className="t-small text-fg-2 underline-offset-4 hover:text-fg-0 hover:underline"
                onClick={() => setMode("questions")}
              >
                Return to diagnostic answers
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg-base py-12 sm:py-16">
      <div className="mx-auto max-w-[980px] px-5 sm:px-8">
        <div className="mb-6 flex flex-col gap-3 border-b border-border-subtle pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="t-label">{currentQuestion ? stageLabel(currentQuestion.stage) : "Diagnostic"}</p>
            <h1 className="mt-3 t-h2">Founder Gravity Audit</h1>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-fg-3">
            Question {questionIndex + 1} / {FOUNDER_GRAVITY_QUESTIONS.length}
          </p>
        </div>

        {currentQuestion && (
          <div className="aj-card is-surface-2">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-signal-yellow">
              {currentQuestion.code}
            </p>
            <h2 className="mt-4 text-balance t-h3">{currentQuestion.prompt}</h2>

            <div className="mt-8 grid gap-3">
              {currentQuestion.options.map((option) => {
                const active = answers[currentQuestion.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    data-fga-option={option.value}
                    onClick={() => answerQuestion(option.value)}
                    className={`w-full border p-4 text-left transition ${
                      active
                        ? "border-signal-yellow bg-signal-yellow text-bg-base"
                        : "border-border-subtle bg-surface-1 text-fg-1 hover:border-border-strong hover:bg-surface-2"
                    }`}
                  >
                    <span className="font-headline text-base font-bold">{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="aj-btn-intel min-w-28"
                  data-fga-back
                  disabled={questionIndex === 0}
                  onClick={() => setQuestionIndex((value) => Math.max(0, value - 1))}
                >
                  Back
                </button>
                <button type="button" className="aj-btn-intel min-w-28" data-fga-save onClick={saveDraft}>
                  Save
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="px-4 py-3 t-small text-fg-2 underline-offset-4 hover:text-fg-0 hover:underline"
                  data-fga-skip
                  onClick={skipQuestion}
                >
                  Skip this item
                </button>
                <Button
                  type="button"
                  data-fga-next
                  disabled={!answers[currentQuestion.id]}
                  onClick={nextQuestion}
                >
                  {questionIndex >= FOUNDER_GRAVITY_QUESTIONS.length - 1
                    ? "Reveal preview"
                    : "Continue"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between t-small">
          <Link href="/founder-gravity-audit" className="text-fg-2 hover:text-fg-0">
            Exit diagnostic
          </Link>
          <span className="text-fg-3">
            {result.completedQuestionCount} answered
          </span>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block t-small font-medium text-fg-1">{label}</span>
      {children}
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="aj-data-panel">
      <p className="aj-data-label">{label}</p>
      <p className="mt-2 aj-data-value">{value}</p>
    </div>
  );
}
