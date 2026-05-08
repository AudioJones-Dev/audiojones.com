"use client";

import { useMemo, useState } from "react";
import { COMPANY_SIZE_OPTIONS, FREQUENCY_OPTIONS, IMPLEMENTATION_BUDGET_OPTIONS, INDUSTRY_OPTIONS, MARGIN_OPTIONS, BUSINESS_MODEL_OPTIONS, MATURITY_OPTIONS, REVENUE_OPTIONS, WORKFLOW_OPTIONS } from "@/lib/ai-roi-diagnostic/constants";
import { scoreDiagnostic } from "@/lib/ai-roi-diagnostic/scoring";
import { getRecommendation } from "@/lib/ai-roi-diagnostic/recommendations";
import type { DiagnosticInput, DiagnosticResult, Maturity } from "@/lib/ai-roi-diagnostic/types";

type FieldErrors = Record<string, string>;
const steps = ["Business", "Workflow", "Friction", "Investment", "Readiness"];
const initialInput: DiagnosticInput = {
  industry: "", companySize: "", monthlyRevenueRange: "", grossMarginRange: "", businessModel: "",
  workflowType: "", taskFrequency: "", timePerTaskMinutes: 30, peopleInvolved: 1, hourlyLaborCost: 75, manualHandoffs: 0,
  errorRatePercent: 0, reworkTimeHours: 0, customerWaitTimeHours: 0, toolCount: 2, approvalBottleneck: false,
  implementationBudgetRange: "Not sure yet", monthlySoftwareBudget: 500, internalTrainingHours: 8, humanQaHoursPerWeek: 2, adoptionTimelineMonths: 3,
  sopMaturity: "Partial", dataQuality: "Partial", processClarity: "Partial", kpiTracking: "Partial", leadershipBuyIn: "Partial", teamAdoptionRisk: "Partial", existingAutomation: "Partial", securityConstraints: "Partial",
};

export default function RoiCalculatorClient() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<DiagnosticInput>(initialInput);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [gate, setGate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const progress = Math.round(((step + 1) / steps.length) * 100);
  const update = <K extends keyof DiagnosticInput>(key: K, value: DiagnosticInput[K]) => setInput((prev) => ({ ...prev, [key]: value }));

  function validate(current: number) {
    const next: FieldErrors = {};
    if (current === 0) {
      if (!input.industry) next.industry = "Choose an industry.";
      if (!input.companySize) next.companySize = "Choose a company size.";
      if (!input.monthlyRevenueRange) next.monthlyRevenueRange = "Choose monthly revenue.";
    }
    if (current === 1) {
      if (!input.workflowType) next.workflowType = "Choose a workflow.";
      if (!input.taskFrequency) next.taskFrequency = "Choose a frequency.";
      (["timePerTaskMinutes", "peopleInvolved", "hourlyLaborCost"] as const).forEach((key) => { if (!input[key] || input[key] < 1) next[key] = "Enter a value greater than zero."; });
    }
    if (current === 4) {
      (["sopMaturity", "dataQuality", "processClarity"] as const).forEach((key) => { if (!input[key]) next[key] = "Choose a readiness level."; });
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function next(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); e.stopPropagation();
    if (!validate(step)) return;
    if (step === 4) { setResult(scoreDiagnostic(input)); setGate(true); return; }
    setStep((s) => Math.min(4, s + 1));
  }
  function back(e: React.MouseEvent<HTMLButtonElement>) { e.preventDefault(); e.stopPropagation(); setErrors({}); setStep((s) => Math.max(0, s - 1)); }
  function restart() { setInput(initialInput); setErrors({}); setResult(null); setGate(false); setEmail(""); setStep(0); setSubmitMessage(""); }

  async function submitLead(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); e.stopPropagation();
    if (!result) return;
    if (!/^\S+@\S+\.\S+$/.test(email)) { setSubmitMessage("Enter a valid email to unlock your results."); return; }
    setSubmitting(true); setSubmitMessage("");
    const params = new URLSearchParams(window.location.search);
    try {
      const res = await fetch("/api/roi-calculator/lead", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, input, result, source: "roi-calculator-page", hp, utm: Object.fromEntries(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].map((key) => [key, params.get(key) ?? undefined])) }),
      });
      if (!res.ok) throw new Error(`Lead API ${res.status}`);
      setGate(false);
    } catch (err) {
      console.error("[roi-calculator] lead submit failed", err);
      setSubmitMessage("We could not save your email, but your report is below.");
      setGate(false);
    } finally { setSubmitting(false); }
  }

  if (result && !gate) return <Results result={result} onRestart={restart} notice={submitMessage} />;

  return (
    <div className="rounded-[28px] border border-[var(--line-2)] bg-bg-2/80 p-5 shadow-[var(--shadow-card)] sm:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 t-small text-fg-2"><span>Step {step + 1} of 5</span><span>{progress}%</span></div>
        <div className="mt-3 h-2 rounded-full bg-bg-4"><div className="h-full rounded-full bg-aj-orange" style={{ width: `${progress}%` }} /></div>
        <div className="mt-4 hidden items-center gap-2 t-small text-fg-3 sm:flex">{steps.map((label, i) => <span className={i === step ? "text-fg-0" : ""} key={label}>{i + 1}. {label}{i < steps.length - 1 ? " ›" : ""}</span>)}</div>
      </div>
      {step === 0 && <StepBusiness input={input} update={update} errors={errors} />}
      {step === 1 && <StepWorkflow input={input} update={update} errors={errors} />}
      {step === 2 && <StepFriction input={input} update={update} />}
      {step === 3 && <StepInvestment input={input} update={update} />}
      {step === 4 && <StepReadiness input={input} update={update} errors={errors} />}
      {gate && result && <EmailGate email={email} setEmail={setEmail} hp={hp} setHp={setHp} submitting={submitting} message={submitMessage} onSubmit={submitLead} />}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={back} disabled={step === 0 || gate} className="min-h-11 rounded-full border border-[var(--line-2)] px-5 py-3 t-small font-semibold text-fg-1 disabled:opacity-40">Back</button>
        <button type="button" onClick={next} disabled={gate} className="btn-glow min-h-11 px-5 py-3">{step === 4 ? "See My Diagnostic" : "Next"}</button>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block t-small font-semibold text-fg-1">{label}</span>{children}{error && <span className="mt-1 block t-small text-aj-orange-soft">{error}</span>}</label>; }
function selectClass(error?: string) { return `min-h-11 w-full rounded-xl border ${error ? "border-aj-orange" : "border-[var(--line-2)]"} bg-bg-1 px-3 py-3 text-fg-0`; }
function inputClass() { return "min-h-11 w-full rounded-xl border border-[var(--line-2)] bg-bg-1 px-3 py-3 text-fg-0"; }
function Select<K extends keyof DiagnosticInput>({ label, valueKey, options, input, update, error }: { label: string; valueKey: K; options: readonly string[]; input: DiagnosticInput; update: <T extends keyof DiagnosticInput>(key: T, value: DiagnosticInput[T]) => void; error?: string }) { return <Field label={label} error={error}><select className={selectClass(error)} value={String(input[valueKey] ?? "")} onChange={(e) => update(valueKey, e.target.value as DiagnosticInput[K])}><option value="">Select…</option>{options.map((o) => <option value={o} key={o}>{o}</option>)}</select></Field>; }
function NumberInput<K extends keyof DiagnosticInput>({ label, valueKey, input, update, decimal = false }: { label: string; valueKey: K; input: DiagnosticInput; update: <T extends keyof DiagnosticInput>(key: T, value: DiagnosticInput[T]) => void; decimal?: boolean }) { return <Field label={label}><input className={inputClass()} type="number" inputMode={decimal ? "decimal" : "numeric"} value={Number(input[valueKey] ?? 0)} onChange={(e) => update(valueKey, Number(e.target.value) as DiagnosticInput[K])} /></Field>; }
function grid(children: React.ReactNode) { return <div className="grid gap-5 md:grid-cols-2">{children}</div>; }
function StepBusiness(props: { input: DiagnosticInput; errors: FieldErrors; update: <K extends keyof DiagnosticInput>(key: K, value: DiagnosticInput[K]) => void }) { return grid(<><Select label="Industry" valueKey="industry" options={INDUSTRY_OPTIONS} {...props} error={props.errors.industry} /><Select label="Company size" valueKey="companySize" options={COMPANY_SIZE_OPTIONS} {...props} error={props.errors.companySize} /><Select label="Monthly revenue range" valueKey="monthlyRevenueRange" options={REVENUE_OPTIONS} {...props} error={props.errors.monthlyRevenueRange} /><Select label="Gross margin range" valueKey="grossMarginRange" options={MARGIN_OPTIONS} {...props} /><Select label="Business model" valueKey="businessModel" options={BUSINESS_MODEL_OPTIONS} {...props} /></>); }
function StepWorkflow(props: { input: DiagnosticInput; errors: FieldErrors; update: <K extends keyof DiagnosticInput>(key: K, value: DiagnosticInput[K]) => void }) { return grid(<><Select label="Workflow type" valueKey="workflowType" options={WORKFLOW_OPTIONS} {...props} error={props.errors.workflowType} /><Select label="Task frequency" valueKey="taskFrequency" options={FREQUENCY_OPTIONS} {...props} error={props.errors.taskFrequency} /><NumberInput label="Time per task minutes" valueKey="timePerTaskMinutes" {...props} /><NumberInput label="People involved" valueKey="peopleInvolved" {...props} /><NumberInput label="Hourly labor cost USD" valueKey="hourlyLaborCost" {...props} /><NumberInput label="Manual handoffs" valueKey="manualHandoffs" {...props} /></>); }
function StepFriction(props: { input: DiagnosticInput; update: <K extends keyof DiagnosticInput>(key: K, value: DiagnosticInput[K]) => void }) { return grid(<><NumberInput label="Error rate %" valueKey="errorRatePercent" decimal {...props} /><NumberInput label="Rework time hours / month" valueKey="reworkTimeHours" decimal {...props} /><NumberInput label="Customer wait time hours" valueKey="customerWaitTimeHours" decimal {...props} /><NumberInput label="Tool count" valueKey="toolCount" {...props} /><label className="flex min-h-11 items-center gap-3 rounded-xl border border-[var(--line-2)] bg-bg-1 px-4 py-3"><input type="checkbox" checked={props.input.approvalBottleneck ?? false} onChange={(e) => props.update("approvalBottleneck", e.target.checked)} />Approval bottleneck</label></>); }
function StepInvestment(props: { input: DiagnosticInput; update: <K extends keyof DiagnosticInput>(key: K, value: DiagnosticInput[K]) => void }) { return grid(<><Select label="Implementation budget range" valueKey="implementationBudgetRange" options={IMPLEMENTATION_BUDGET_OPTIONS} {...props} /><NumberInput label="Monthly software budget" valueKey="monthlySoftwareBudget" {...props} /><NumberInput label="Internal training hours" valueKey="internalTrainingHours" decimal {...props} /><NumberInput label="Human QA hours per week" valueKey="humanQaHoursPerWeek" decimal {...props} /><NumberInput label="Adoption timeline months" valueKey="adoptionTimelineMonths" decimal {...props} /></>); }
function ReadinessSelect(props: { label: string; valueKey: keyof DiagnosticInput; input: DiagnosticInput; update: <K extends keyof DiagnosticInput>(key: K, value: DiagnosticInput[K]) => void; error?: string }) { return <Field label={props.label} error={props.error}><select className={selectClass(props.error)} value={String(props.input[props.valueKey] ?? "")} onChange={(e) => props.update(props.valueKey, e.target.value as Maturity as never)}>{MATURITY_OPTIONS.map((o) => <option value={o} key={o}>{o}</option>)}</select></Field>; }
function StepReadiness(props: { input: DiagnosticInput; errors: FieldErrors; update: <K extends keyof DiagnosticInput>(key: K, value: DiagnosticInput[K]) => void }) { return grid(<>{[["SOP maturity","sopMaturity"],["Data quality","dataQuality"],["Process clarity","processClarity"],["KPI tracking","kpiTracking"],["Leadership buy-in","leadershipBuyIn"],["Team adoption risk","teamAdoptionRisk"],["Existing automation","existingAutomation"],["Security constraints","securityConstraints"]].map(([label, key]) => <ReadinessSelect key={key} label={label} valueKey={key as keyof DiagnosticInput} {...props} error={props.errors[key]} />)}</>); }
function EmailGate({ email, setEmail, hp, setHp, submitting, message, onSubmit }: { email: string; setEmail: (v: string) => void; hp: string; setHp: (v: string) => void; submitting: boolean; message: string; onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void }) { return <div className="mt-8 rounded-3xl border border-aj-orange/40 bg-bg-1 p-5"><h3 className="t-h3">Your AI ROI diagnostic is ready.</h3><p className="mt-2 text-fg-2">Enter your email to view your full report and get the breakdown emailed to you.</p><input className={`${inputClass()} mt-5`} type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" /><input tabIndex={-1} autoComplete="off" className="hidden" value={hp} onChange={(e) => setHp(e.target.value)} /><button type="button" onClick={onSubmit} disabled={submitting} className="btn-glow mt-4 min-h-11 w-full px-5 py-3">{submitting ? "Saving…" : "Show My Results"}</button>{message && <p className="mt-3 t-small text-aj-orange-soft">{message}</p>}</div>; }
function Results({ result, onRestart, notice }: { result: DiagnosticResult; onRestart: () => void; notice: string }) { const rec = useMemo(() => getRecommendation(result), [result]); return <div className="rounded-[28px] border border-[var(--line-2)] bg-bg-2/80 p-5 sm:p-8">{notice && <p className="mb-4 rounded-xl border border-aj-orange/40 bg-bg-1 p-3 t-small text-aj-orange-soft">{notice}</p>}<div className="grid gap-4 md:grid-cols-3">{[["ROI Score", result.roiScore, "Economic upside after likely investment."], ["AI Readiness Score", result.readinessScore, "Workflow, data, SOP, and adoption foundation."], ["Automation Priority", result.priorityScore, "How urgently this bottleneck deserves action."]].map(([label, score, desc]) => <div className="rounded-2xl border border-[var(--line-2)] bg-bg-1 p-5" key={label}><p className="t-small uppercase tracking-[.14em] text-aj-gold">{label}</p><p className="mt-2 text-5xl font-bold text-fg-0">{score}</p><p className="mt-2 t-small text-fg-2">{desc}</p></div>)}</div><div className="mt-6 rounded-3xl border border-aj-orange/40 bg-bg-1 p-6"><p className="t-small uppercase tracking-[.16em] text-aj-orange">Recommendation</p><h3 className="mt-2 t-h3">{rec.title}</h3><p className="mt-3 text-fg-2">{rec.summary}</p><a className="btn-glow mt-5 inline-flex px-5 py-3" href="https://diagnostic.audiojones.com" target="_blank" rel="noopener noreferrer">Take the Signal Diagnostic</a></div><dl className="mt-6 grid gap-4 sm:grid-cols-2"><Metric label="Conservative annual impact" value={currency(result.conservativeAnnualImpact)} /><Metric label="Expected annual impact" value={currency(result.expectedAnnualImpact)} /><Metric label="Aggressive annual impact" value={currency(result.aggressiveAnnualImpact)} /><Metric label="Payback period" value={`${result.paybackMonths} months`} /></dl><button type="button" onClick={onRestart} className="mt-6 t-small text-fg-2 underline">Restart</button></div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-[var(--line-2)] bg-bg-1 p-4"><dt className="t-small text-fg-3">{label}</dt><dd className="mt-1 t-h4 text-fg-0">{value}</dd></div>; }
function currency(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value); }
