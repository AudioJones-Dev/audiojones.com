"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import {
  AI_USAGE_LEVELS,
  PRIMARY_CONSTRAINTS,
  REVENUE_RANGES,
  TIMELINE_OPTIONS,
} from "@/lib/leads/lead-schema";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
  role: string;

  annualRevenueRange: string;
  primaryConstraint: string;
  currentGrowthStage: string;
  biggestPain: string;
  whatHaveYouTried: string;

  crmUsed: string;
  analyticsUsed: string;
  projectManagementUsed: string;
  automationToolsUsed: string;
  contentSystemStatus: string;
  documentedSops: boolean;

  currentAiTools: string;
  aiUsageLevel: string;
  aiMainGoal: string;
  aiConcern: string;

  canIdentifyBestLeadSource: boolean | null;
  knowsCAC: boolean | null;
  knowsLTV: boolean | null;
  tracksConversionSource: boolean | null;
  attributionConfidence: number;
  desiredOutcome: string;

  budgetRange: string;
  timeline: string;
  preferredContactMethod: string;
  consentToContact: boolean;

  website_url: string; // honeypot
};

const INITIAL: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  companyName: "",
  website: "",
  role: "",
  annualRevenueRange: "",
  primaryConstraint: "",
  currentGrowthStage: "",
  biggestPain: "",
  whatHaveYouTried: "",
  crmUsed: "",
  analyticsUsed: "",
  projectManagementUsed: "",
  automationToolsUsed: "",
  contentSystemStatus: "",
  documentedSops: false,
  currentAiTools: "",
  aiUsageLevel: "",
  aiMainGoal: "",
  aiConcern: "",
  canIdentifyBestLeadSource: null,
  knowsCAC: null,
  knowsLTV: null,
  tracksConversionSource: null,
  attributionConfidence: 5,
  desiredOutcome: "",
  budgetRange: "",
  timeline: "",
  preferredContactMethod: "Email",
  consentToContact: false,
  website_url: "",
};

const STEPS = [
  "Business snapshot",
  "Growth constraint",
  "Current systems",
  "AI readiness",
  "Attribution",
  "Submit",
] as const;

const ROLE_OPTIONS = [
  "Founder / owner",
  "CEO / president",
  "COO / operator",
  "CMO / growth lead",
  "Sales leader",
  "Agency / consultant",
  "Other",
];

const GROWTH_STAGE_OPTIONS = [
  "Pre-revenue / validating offer",
  "Under $250K and founder-led",
  "$250K-$500K with inconsistent pipeline",
  "$500K-$1M and process is breaking",
  "$1M-$2M and team handoffs are noisy",
  "$2M-$5M and systems need control",
  "$5M+ and scaling needs governance",
];

const PAIN_OPTIONS = [
  "Missed follow-up",
  "Too many manual handoffs",
  "Leads are not qualified",
  "Marketing is unclear",
  "Sales process is inconsistent",
  "Delivery depends on the founder",
  "Reporting does not match reality",
  "AI tools are scattered",
];

const TRIED_OPTIONS = [
  "Hired an agency",
  "Built automations in-house",
  "Tried AI tools",
  "Changed CRM or pipeline process",
  "Created SOPs",
  "Ran paid ads",
  "Added reporting dashboards",
  "Nothing structured yet",
];

const CRM_OPTIONS = [
  "None",
  "HubSpot",
  "Salesforce",
  "GoHighLevel",
  "Pipedrive",
  "Zoho CRM",
  "Keap",
  "Monday Sales CRM",
  "Airtable",
  "Not sure",
  "Other",
];

const ANALYTICS_OPTIONS = [
  "None",
  "Google Analytics 4",
  "Google Search Console",
  "Looker Studio",
  "Mixpanel",
  "Amplitude",
  "Triple Whale",
  "Northbeam",
  "Hotjar",
  "Microsoft Clarity",
  "Not sure",
  "Other",
];

const PROJECT_OPTIONS = [
  "None",
  "ClickUp",
  "Asana",
  "Monday.com",
  "Trello",
  "Notion",
  "Basecamp",
  "Jira",
  "Airtable",
  "Google Sheets",
  "Not sure",
  "Other",
];

const AUTOMATION_OPTIONS = [
  "None",
  "Zapier",
  "Make",
  "n8n",
  "HubSpot workflows",
  "GoHighLevel workflows",
  "Airtable automations",
  "Pabbly",
  "Workato",
  "Custom scripts",
  "Not sure",
  "Other",
];

const CONTENT_SYSTEM_OPTIONS = [
  "No content system",
  "Ad hoc posting",
  "Content calendar",
  "Documented production workflow",
  "Newsletter / nurture system",
  "Repurposing engine",
  "Full content pipeline",
  "Not sure",
];

const AI_TOOL_OPTIONS = [
  "None",
  "ChatGPT",
  "Claude",
  "Gemini",
  "Microsoft Copilot",
  "Perplexity",
  "Midjourney",
  "Canva AI",
  "Zapier AI",
  "Notion AI",
  "HubSpot AI",
  "Custom GPTs",
  "Internal agents",
  "Not sure",
  "Other",
];

const AI_GOAL_OPTIONS = [
  "Recover missed revenue",
  "Automate lead follow-up",
  "Qualify prospects faster",
  "Turn expertise into content",
  "Improve reporting and attribution",
  "Reduce manual operations",
  "Build an AI agent workflow",
  "Create a customer support layer",
];

const AI_CONCERN_OPTIONS = [
  "Wrong tool choice",
  "Poor data quality",
  "Team adoption",
  "Security / privacy",
  "Unclear ROI",
  "Too much complexity",
  "Brand voice / quality control",
  "No owner for the system",
];

const OUTCOME_OPTIONS = [
  "Clear operating diagnosis",
  "Revenue recovery plan",
  "Automation roadmap",
  "AI readiness score",
  "Attribution cleanup",
  "Agent-system buildout",
  "Implementation partner fit",
];

const BUDGET_OPTIONS = [
  "Under $5K",
  "$5K-$15K",
  "$15K-$25K",
  "$25K-$50K",
  "$50K+",
  "Not sure yet",
];

const DIAGNOSTIC_RESULT_STORAGE_KEY = "audiojones:diagnostic-result";

function tracker(searchParams: URLSearchParams) {
  return {
    utmSource: searchParams.get("utm_source") || undefined,
    utmMedium: searchParams.get("utm_medium") || undefined,
    utmCampaign: searchParams.get("utm_campaign") || undefined,
    utmTerm: searchParams.get("utm_term") || undefined,
    utmContent: searchParams.get("utm_content") || undefined,
  };
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type LeadResponse =
  | {
      ok: true;
      leadId: string;
      priority: string;
      totalScore: number;
    }
  | {
      ok: false;
      message?: string;
      error?: string;
    };

function storeDiagnosticResult(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      DIAGNOSTIC_RESULT_STORAGE_KEY,
      JSON.stringify(payload),
    );
  } catch {
    // Browser storage is a convenience for the thank-you page, not the source of truth.
  }
}

export default function DiagnosticForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utm, setUtm] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUtm(tracker(new URLSearchParams(window.location.search)));
  }, []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const canAdvance = useMemo(() => {
    if (step === 0) {
      return state.firstName.trim().length > 0 && /\S+@\S+\.\S+/.test(state.email);
    }
    if (step === 5) {
      return state.consentToContact;
    }
    return true;
  }, [step, state]);

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/applied-intelligence/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...state,
          attributionConfidence: Number(state.attributionConfidence) || undefined,
          canIdentifyBestLeadSource:
            state.canIdentifyBestLeadSource ?? undefined,
          knowsCAC: state.knowsCAC ?? undefined,
          knowsLTV: state.knowsLTV ?? undefined,
          tracksConversionSource: state.tracksConversionSource ?? undefined,
          sourcePage: "/applied-intelligence/diagnostic",
          ...utm,
        }),
      });
      const data = (await res.json()) as LeadResponse;
      if (!data.ok) {
        throw new Error(data.message || data.error || "Submission failed.");
      }
      storeDiagnosticResult({
        type: "applied-intelligence",
        leadId: data.leadId,
        priority: data.priority,
        totalScore: data.totalScore,
        primaryConstraint: state.primaryConstraint,
        desiredOutcome: state.desiredOutcome,
        timeline: state.timeline,
        email: state.email,
        submittedAt: new Date().toISOString(),
      });
      router.push("/applied-intelligence/diagnostic/thank-you?source=diagnostic");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="diagnostic-shell">
      <ol className="diagnostic-steps" aria-label="Diagnostic progress">
        {STEPS.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              className={cx(
                "diagnostic-step",
                i === step && "is-active",
                i < step && "is-complete",
              )}
              onClick={() => setStep(i)}
              disabled={submitting}
              aria-current={i === step ? "step" : undefined}
            >
              <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ol>

      {step === 0 && <Step1 state={state} update={update} />}
      {step === 1 && <Step2 state={state} update={update} />}
      {step === 2 && <Step3 state={state} update={update} />}
      {step === 3 && <Step4 state={state} update={update} />}
      {step === 4 && <Step5 state={state} update={update} />}
      {step === 5 && <Step6 state={state} update={update} submitting={submitting} />}

      <input
        type="text"
        name="website_url"
        autoComplete="off"
        tabIndex={-1}
        value={state.website_url}
        onChange={(e) => update("website_url", e.target.value)}
        className="hidden"
        aria-hidden
      />

      {error && (
        <p role="alert" className="diagnostic-error">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || submitting}
          className="diagnostic-button diagnostic-button-secondary"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canAdvance}
            className="diagnostic-button diagnostic-button-primary"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!canAdvance || submitting}
            className="diagnostic-button diagnostic-button-primary"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-3">
                <span className="signal-loader-mini" aria-hidden>
                  <span />
                </span>
                Submitting
              </span>
            ) : (
              "Submit diagnostic"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

type StepProps = {
  state: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

type Step6Props = StepProps & {
  submitting: boolean;
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="diagnostic-label">
        {label}
        {required && <span className="ml-1 text-[var(--accent-red)]">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls = "diagnostic-input";

function SelectField({
  label,
  value,
  options,
  onChange,
  required,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <Field label={label} required={required}>
      <span className="diagnostic-select-wrap">
        <select
          className={inputCls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="diagnostic-select-icon" size={18} />
      </span>
    </Field>
  );
}

function ChoiceCards({
  label,
  value,
  options,
  onChange,
  columns = "two",
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  columns?: "two" | "three";
}) {
  return (
    <Field label={label}>
      <div
        className={cx(
          "grid gap-2",
          columns === "three" ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={cx("diagnostic-choice-card", value === option && "is-selected")}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </Field>
  );
}

function MultiChoiceCards({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  const selected = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const toggle = (option: string) => {
    const next = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(next.join(", "));
  };

  return (
    <Field label={label}>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              className={cx("diagnostic-check-card", active && "is-selected")}
              onClick={() => toggle(option)}
            >
              <span className="diagnostic-check-box" aria-hidden>
                {active && <Check size={14} strokeWidth={3} />}
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function Step1({ state, update }: StepProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="First name" required>
        <input
          className={inputCls}
          value={state.firstName}
          onChange={(e) => update("firstName", e.target.value)}
        />
      </Field>
      <Field label="Last name">
        <input
          className={inputCls}
          value={state.lastName}
          onChange={(e) => update("lastName", e.target.value)}
        />
      </Field>
      <Field label="Email" required>
        <input
          type="email"
          className={inputCls}
          value={state.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </Field>
      <Field label="Phone">
        <input
          type="tel"
          className={inputCls}
          value={state.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </Field>
      <Field label="Company name">
        <input
          className={inputCls}
          value={state.companyName}
          onChange={(e) => update("companyName", e.target.value)}
        />
      </Field>
      <Field label="Website">
        <input
          type="url"
          className={inputCls}
          placeholder="https://"
          value={state.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </Field>
      <SelectField
        label="Your role"
        value={state.role}
        options={ROLE_OPTIONS}
        onChange={(value) => update("role", value)}
      />
      <SelectField
        label="Annual revenue"
        value={state.annualRevenueRange}
        options={REVENUE_RANGES}
        onChange={(value) => update("annualRevenueRange", value)}
      />
    </div>
  );
}

function Step2({ state, update }: StepProps) {
  return (
    <div className="grid gap-5">
      <ChoiceCards
        label="Primary constraint"
        value={state.primaryConstraint}
        options={PRIMARY_CONSTRAINTS}
        columns="two"
        onChange={(value) => update("primaryConstraint", value)}
      />
      <ChoiceCards
        label="Current growth stage"
        value={state.currentGrowthStage}
        options={GROWTH_STAGE_OPTIONS}
        columns="two"
        onChange={(value) => update("currentGrowthStage", value)}
      />
      <MultiChoiceCards
        label="Biggest pain right now"
        value={state.biggestPain}
        options={PAIN_OPTIONS}
        onChange={(value) => update("biggestPain", value)}
      />
      <MultiChoiceCards
        label="What have you tried so far?"
        value={state.whatHaveYouTried}
        options={TRIED_OPTIONS}
        onChange={(value) => update("whatHaveYouTried", value)}
      />
    </div>
  );
}

function Step3({ state, update }: StepProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectField
        label="CRM in use"
        value={state.crmUsed}
        options={CRM_OPTIONS}
        onChange={(value) => update("crmUsed", value)}
      />
      <SelectField
        label="Analytics in use"
        value={state.analyticsUsed}
        options={ANALYTICS_OPTIONS}
        onChange={(value) => update("analyticsUsed", value)}
      />
      <SelectField
        label="Project management"
        value={state.projectManagementUsed}
        options={PROJECT_OPTIONS}
        onChange={(value) => update("projectManagementUsed", value)}
      />
      <SelectField
        label="Automation tools"
        value={state.automationToolsUsed}
        options={AUTOMATION_OPTIONS}
        onChange={(value) => update("automationToolsUsed", value)}
      />
      <SelectField
        label="Content system status"
        value={state.contentSystemStatus}
        options={CONTENT_SYSTEM_OPTIONS}
        onChange={(value) => update("contentSystemStatus", value)}
      />
      <YesNoMaybe
        label="Documented SOPs?"
        value={state.documentedSops}
        onChange={(value) => update("documentedSops", value === true)}
        noUnknown
      />
    </div>
  );
}

function Step4({ state, update }: StepProps) {
  return (
    <div className="grid gap-5">
      <SelectField
        label="Current AI tools"
        value={state.currentAiTools}
        options={AI_TOOL_OPTIONS}
        onChange={(value) => update("currentAiTools", value)}
      />
      <SelectField
        label="AI usage level"
        value={state.aiUsageLevel}
        options={AI_USAGE_LEVELS}
        onChange={(value) => update("aiUsageLevel", value)}
      />
      <MultiChoiceCards
        label="Main goal for AI"
        value={state.aiMainGoal}
        options={AI_GOAL_OPTIONS}
        onChange={(value) => update("aiMainGoal", value)}
      />
      <MultiChoiceCards
        label="Biggest concern about AI"
        value={state.aiConcern}
        options={AI_CONCERN_OPTIONS}
        onChange={(value) => update("aiConcern", value)}
      />
    </div>
  );
}

function YesNoMaybe({
  label,
  value,
  onChange,
  noUnknown,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean | null) => void;
  noUnknown?: boolean;
}) {
  const options: Array<[string, boolean | null]> = noUnknown
    ? [
        ["Yes", true],
        ["No", false],
      ]
    : [
        ["Yes", true],
        ["No", false],
        ["IDK", null],
      ];

  return (
    <Field label={label}>
      <div className="diagnostic-segmented" data-count={options.length}>
        {options.map(([labelText, optionValue]) => (
          <label key={labelText} className="diagnostic-segment">
            <input
              type="radio"
              name={label}
              checked={value === optionValue}
              onChange={() => onChange(optionValue)}
            />
            <span>{labelText}</span>
          </label>
        ))}
        <span
          className="diagnostic-segment-selection"
          data-position={Math.max(
            0,
            options.findIndex(([, optionValue]) => value === optionValue),
          )}
        />
      </div>
    </Field>
  );
}

function Step5({ state, update }: StepProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <YesNoMaybe
        label="Can you identify your best lead source?"
        value={state.canIdentifyBestLeadSource}
        onChange={(value) => update("canIdentifyBestLeadSource", value)}
      />
      <YesNoMaybe
        label="Do you track conversion source?"
        value={state.tracksConversionSource}
        onChange={(value) => update("tracksConversionSource", value)}
      />
      <YesNoMaybe
        label="Do you know your CAC?"
        value={state.knowsCAC}
        onChange={(value) => update("knowsCAC", value)}
      />
      <YesNoMaybe
        label="Do you know your LTV?"
        value={state.knowsLTV}
        onChange={(value) => update("knowsLTV", value)}
      />
      <Field label={`Attribution confidence: ${state.attributionConfidence} / 10`}>
        <input
          type="range"
          min={1}
          max={10}
          value={state.attributionConfidence}
          onChange={(e) =>
            update("attributionConfidence", Number(e.target.value))
          }
          className="diagnostic-range"
        />
      </Field>
      <ChoiceCards
        label="Desired outcome"
        value={state.desiredOutcome}
        options={OUTCOME_OPTIONS}
        columns="two"
        onChange={(value) => update("desiredOutcome", value)}
      />
    </div>
  );
}

function Step6({ state, update, submitting }: Step6Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectField
        label="Budget range"
        value={state.budgetRange}
        options={BUDGET_OPTIONS}
        onChange={(value) => update("budgetRange", value)}
      />
      <SelectField
        label="Timeline"
        value={state.timeline}
        options={TIMELINE_OPTIONS}
        onChange={(value) => update("timeline", value)}
      />
      <SelectField
        label="Preferred contact method"
        value={state.preferredContactMethod}
        options={["Email", "Phone", "Either"]}
        onChange={(value) => update("preferredContactMethod", value)}
      />
      <div className="sm:col-span-2">
        {submitting && (
          <div className="mb-5 flex justify-center">
            <div className="signal-radar-loader" aria-label="Submitting diagnostic">
              <span />
            </div>
          </div>
        )}
        <label className="diagnostic-consent">
          <input
            type="checkbox"
            checked={state.consentToContact}
            onChange={(e) => update("consentToContact", e.target.checked)}
          />
          <span className="diagnostic-consent-box" aria-hidden>
            {state.consentToContact && <Check size={15} strokeWidth={3} />}
          </span>
          <span>
            I consent to Audio Jones contacting me about this diagnostic
            request. I understand my information will be reviewed for fit
            before any next steps.
          </span>
        </label>
      </div>
    </div>
  );
}
