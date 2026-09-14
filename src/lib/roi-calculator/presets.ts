import type { CalculatorPreset } from "./types";

export type PresetModules = {
  missedCalls: boolean;
  afterHours: boolean;
  quoteFollowup: boolean;
  delayedResponse: boolean;
  websiteConversion: boolean;
  costAvoidance: boolean;
};

export type PresetConfig = {
  key: CalculatorPreset;
  label: string;
  resultHeading: string;
  modules: PresetModules;
  cta: { label: string; href: string; support: string };
};

const DIAGNOSTIC_HREF =
  "/apply?source=diagnostic&offer=revenue-leak-assessment&utm_source=roi-calculator&utm_medium=website&utm_campaign=revenue-leak-scorecard";

const DIAGNOSTIC_CTA = {
  label: "Book a Revenue Leak Diagnostic",
  href: DIAGNOSTIC_HREF,
  support: "We'll validate the assumptions behind your scorecard and identify which workflow is most worth fixing first.",
};

/**
 * A preset decides which scenario modules run and how the result is framed.
 * It never changes a formula — every preset calls the same engine.
 */
export const PRESETS: Record<CalculatorPreset, PresetConfig> = {
  revenue_leak: {
    key: "revenue_leak",
    label: "Revenue Leak Scorecard",
    resultHeading: "Your Revenue Response Economics",
    modules: { missedCalls: true, afterHours: true, quoteFollowup: true, delayedResponse: true, websiteConversion: true, costAvoidance: true },
    cta: DIAGNOSTIC_CTA,
  },
  responseos: {
    key: "responseos",
    label: "ResponseOS Revenue Response Scorecard",
    resultHeading: "Your Revenue Response Economics",
    modules: { missedCalls: true, afterHours: true, quoteFollowup: true, delayedResponse: true, websiteConversion: false, costAvoidance: false },
    cta: DIAGNOSTIC_CTA,
  },
  operations: {
    key: "operations",
    label: "Operations ROI",
    resultHeading: "Your Operating Capacity Economics",
    modules: { missedCalls: false, afterHours: false, quoteFollowup: false, delayedResponse: false, websiteConversion: false, costAvoidance: true },
    cta: DIAGNOSTIC_CTA,
  },
  website: {
    key: "website",
    label: "Website ROI",
    resultHeading: "Your Website Conversion Economics",
    modules: { missedCalls: false, afterHours: false, quoteFollowup: false, delayedResponse: true, websiteConversion: true, costAvoidance: false },
    cta: DIAGNOSTIC_CTA,
  },
  ai_roi: {
    key: "ai_roi",
    label: "AI ROI",
    resultHeading: "Your Automation Economics",
    modules: { missedCalls: true, afterHours: true, quoteFollowup: true, delayedResponse: true, websiteConversion: true, costAvoidance: true },
    cta: DIAGNOSTIC_CTA,
  },
};

export const DEFAULT_PRESET: CalculatorPreset = "revenue_leak";

export function getPreset(key: CalculatorPreset | undefined): PresetConfig {
  return PRESETS[key ?? DEFAULT_PRESET] ?? PRESETS[DEFAULT_PRESET];
}
