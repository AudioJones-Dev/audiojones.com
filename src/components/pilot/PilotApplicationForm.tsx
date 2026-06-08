"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  pilotApplicationSchema,
  INDUSTRY_OPTIONS,
  REVENUE_RANGES,
  TEAM_SIZES,
  INTEREST_LEVELS,
  type PilotApplicationInput,
} from "@/lib/pilot/pilot-schema";

type FieldErrors = Partial<Record<keyof PilotApplicationInput, string>>;

const initialState: PilotApplicationInput = {
  name: "",
  businessName: "",
  website: "",
  email: "",
  phone: "",
  industry: undefined as unknown as PilotApplicationInput["industry"],
  annualRevenueRange:
    undefined as unknown as PilotApplicationInput["annualRevenueRange"],
  teamSize: undefined as unknown as PilotApplicationInput["teamSize"],
  currentCrm: "",
  biggestBottleneck: "",
  communicationChannels: "",
  interestLevel: undefined as unknown as PilotApplicationInput["interestLevel"],
  consentToContact: false,
  sourcePage: "/founder-intelligence-systems-pilot",
  website_url: "",
};

const opt = <T extends string>(arr: ReadonlyArray<T>) =>
  arr.map((v) => ({ value: v, label: v }));

export default function PilotApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<PilotApplicationInput>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) return;
    setForm((f) => ({
      ...f,
      utmSource: searchParams.get("utm_source") ?? undefined,
      utmMedium: searchParams.get("utm_medium") ?? undefined,
      utmCampaign: searchParams.get("utm_campaign") ?? undefined,
      utmTerm: searchParams.get("utm_term") ?? undefined,
      utmContent: searchParams.get("utm_content") ?? undefined,
    }));
  }, [searchParams]);

  function update<K extends keyof PilotApplicationInput>(
    key: K,
    value: PilotApplicationInput[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const parsed = pilotApplicationSchema.safeParse(form);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof PilotApplicationInput | undefined;
        if (k && !next[k]) next[k] = issue.message;
      }
      setErrors(next);
      const firstKey = parsed.error.issues[0]?.path[0];
      if (typeof firstKey === "string") {
        const el = document.getElementById(firstKey);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus();
      }
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/pilot/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as
        | { ok: true; applicationId: string }
        | { ok: false; error: string };
      if (!data.ok) {
        setSubmitError(data.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push("/founder-intelligence-systems-pilot/thank-you");
    } catch {
      setSubmitError("Network error. Please try again in a moment.");
      setSubmitting(false);
    }
  }

  return (
    <form
      id="apply"
      onSubmit={onSubmit}
      noValidate
      className="mx-auto flex w-full max-w-[640px] flex-col gap-12"
      aria-label="Apply for the Founder Intelligence Systems Pilot Program"
    >
      {/* Honeypot — visually hidden, not focusable */}
      <div
        aria-hidden
        className="absolute h-px w-px overflow-hidden"
        style={{ clip: "rect(0 0 0 0)", clipPath: "inset(50%)" }}
      >
        <label>
          Leave this field empty
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website_url ?? ""}
            onChange={(e) => update("website_url", e.target.value)}
          />
        </label>
      </div>

      {/* ── About you & your business ── */}
      <section className="flex flex-col gap-5">
        <Eyebrow>About you</Eyebrow>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField id="name" label="Full name" required error={errors.name}>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              invalid={!!errors.name}
            />
          </FormField>
          <FormField
            id="businessName"
            label="Business name"
            required
            error={errors.businessName}
          >
            <Input
              id="businessName"
              name="businessName"
              autoComplete="organization"
              value={form.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              invalid={!!errors.businessName}
            />
          </FormField>
          <FormField id="email" label="Email" required error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              invalid={!!errors.email}
            />
          </FormField>
          <FormField id="phone" label="Phone" required error={errors.phone}>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              invalid={!!errors.phone}
            />
          </FormField>
          <FormField
            id="website"
            label="Website"
            hint="Optional"
            error={errors.website}
            className="md:col-span-2"
          >
            <Input
              id="website"
              name="website"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://"
              value={form.website ?? ""}
              onChange={(e) => update("website", e.target.value)}
              invalid={!!errors.website}
            />
          </FormField>
        </div>
      </section>

      {/* ── Business context ── */}
      <section className="flex flex-col gap-5">
        <Eyebrow>Business context</Eyebrow>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField id="industry" label="Industry" required error={errors.industry}>
            <Select
              id="industry"
              name="industry"
              placeholder="Select industry"
              options={opt(INDUSTRY_OPTIONS)}
              value={(form.industry as string) ?? ""}
              onChange={(e) =>
                update(
                  "industry",
                  e.target.value as PilotApplicationInput["industry"],
                )
              }
              invalid={!!errors.industry}
            />
          </FormField>
          <FormField
            id="annualRevenueRange"
            label="Annual revenue"
            required
            error={errors.annualRevenueRange}
          >
            <Select
              id="annualRevenueRange"
              name="annualRevenueRange"
              placeholder="Select range"
              options={opt(REVENUE_RANGES)}
              value={(form.annualRevenueRange as string) ?? ""}
              onChange={(e) =>
                update(
                  "annualRevenueRange",
                  e.target.value as PilotApplicationInput["annualRevenueRange"],
                )
              }
              invalid={!!errors.annualRevenueRange}
            />
          </FormField>
          <FormField
            id="teamSize"
            label="Employees / contractors"
            required
            error={errors.teamSize}
          >
            <Select
              id="teamSize"
              name="teamSize"
              placeholder="Select size"
              options={opt(TEAM_SIZES)}
              value={(form.teamSize as string) ?? ""}
              onChange={(e) =>
                update(
                  "teamSize",
                  e.target.value as PilotApplicationInput["teamSize"],
                )
              }
              invalid={!!errors.teamSize}
            />
          </FormField>
          <FormField
            id="currentCrm"
            label="Current CRM"
            hint="Or 'none' if you don't have one"
            error={errors.currentCrm}
          >
            <Input
              id="currentCrm"
              name="currentCrm"
              value={form.currentCrm ?? ""}
              onChange={(e) => update("currentCrm", e.target.value)}
            />
          </FormField>
          <FormField
            id="communicationChannels"
            label="Communication channels"
            hint="How do leads and clients reach you? (phone, text, email, web, etc.)"
            error={errors.communicationChannels}
            className="md:col-span-2"
          >
            <Input
              id="communicationChannels"
              name="communicationChannels"
              value={form.communicationChannels ?? ""}
              onChange={(e) => update("communicationChannels", e.target.value)}
            />
          </FormField>
        </div>
      </section>

      {/* ── The constraint ── */}
      <section className="flex flex-col gap-5">
        <Eyebrow>The constraint</Eyebrow>
        <FormField
          id="biggestBottleneck"
          label="Biggest operational bottleneck"
          required
          hint="What's the single biggest thing slowing the business down right now? Be specific."
          error={errors.biggestBottleneck}
        >
          <Textarea
            id="biggestBottleneck"
            name="biggestBottleneck"
            value={form.biggestBottleneck}
            onChange={(e) => update("biggestBottleneck", e.target.value)}
            invalid={!!errors.biggestBottleneck}
          />
        </FormField>
        <FormField
          id="interestLevel"
          label="Interest level"
          required
          error={errors.interestLevel}
        >
          <Select
            id="interestLevel"
            name="interestLevel"
            placeholder="Select interest level"
            options={opt(INTEREST_LEVELS)}
            value={(form.interestLevel as string) ?? ""}
            onChange={(e) =>
              update(
                "interestLevel",
                e.target.value as PilotApplicationInput["interestLevel"],
              )
            }
            invalid={!!errors.interestLevel}
          />
        </FormField>
        <FormField id="consentToContact" label="" error={errors.consentToContact}>
          <Checkbox
            id="consentToContact"
            name="consentToContact"
            required
            label="I consent to Audio Jones contacting me about this pilot application."
            hint="Only 3 pilot partners will be accepted. Applications are reviewed personally."
            checked={form.consentToContact}
            onChange={(e) => update("consentToContact", e.target.checked)}
            invalid={!!errors.consentToContact}
          />
        </FormField>
      </section>

      {submitError && (
        <div
          role="alert"
          className="rounded-md border border-[color:var(--danger)] bg-[rgba(239,68,68,0.06)] p-4 t-small text-[color:var(--danger)]"
        >
          {submitError}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? "Submitting…" : "Apply for Pilot Program"}
        </Button>
        <p className="t-small text-fg-3">
          Reviewed personally. Pilot fit calls are booked after review.
        </p>
      </div>
    </form>
  );
}
