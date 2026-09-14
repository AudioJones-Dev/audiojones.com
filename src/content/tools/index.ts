/**
 * Canonical registry of the interactive tools on /resources.
 *
 * Two kinds, and the distinction is the point: a diagnostic identifies a
 * problem, a calculator estimates cost or economic value. Conflating them was
 * the flaw in the previous hub, which listed the ROI calculator beside essays
 * and omitted both diagnostics entirely.
 *
 * Ratified in docs/specs/resources-tools-expansion-prd.md. Diagnostics link
 * their landing pages rather than the instruments (Q-8): the landing pages
 * carry the framing copy and FAQ schema, and the instrument is one click in.
 */

export type ToolKind = "diagnostic" | "calculator";

/** `planned` tools are ratified but unbuilt; see PRD waves 2–3. */
export type ToolStatus = "live" | "planned";

export type Tool = {
  id: string;
  kind: ToolKind;
  name: string;
  href: string;
  /** What the tool is for, in the visitor's terms. */
  description: string;
  /** What they walk away holding. Rendered as the card's outcome line. */
  primaryResult: string;
  /** Action-shaped CTA label. */
  cta: string;
  status: ToolStatus;
};

export const TOOLS: Tool[] = [
  {
    id: "ai-readiness-diagnostic",
    kind: "diagnostic",
    name: "AI Readiness Diagnostic",
    href: "/ai-readiness-diagnostic",
    description:
      "Assess whether your workflows, data, team, and technology are prepared for useful AI implementation.",
    primaryResult: "Readiness score and priorities",
    cta: "Assess AI readiness",
    status: "live",
  },
  {
    id: "founder-gravity-audit",
    kind: "diagnostic",
    name: "Founder Gravity Audit",
    href: "/founder-gravity-audit",
    description:
      "Map how much of the business still depends on you — where decisions, delivery, and follow-up still route through the founder.",
    primaryResult: "Gravity Load and the next operating move",
    cta: "Map my gravity load",
    status: "live",
  },
  {
    id: "website-project-estimator",
    kind: "calculator",
    name: "Website Project Estimator",
    href: "/website-project-estimator",
    description:
      "Estimate the likely scope, timeline, and investment required for your website project.",
    primaryResult: "Project tier, timeline, price range",
    cta: "Estimate my website project",
    status: "planned",
  },
  {
    id: "seo-roi-calculator",
    kind: "calculator",
    name: "SEO ROI Calculator",
    href: "/seo-roi-calculator",
    description:
      "Estimate how additional search visibility could translate into traffic, qualified leads, revenue, and payback.",
    primaryResult: "Traffic, leads, revenue and break-even",
    cta: "Calculate SEO potential",
    status: "planned",
  },
  {
    // Named to match the destination page, which the V2 geo-economic engine
    // repositioned from "Operational Waste Recovery Calculator" to the
    // Revenue Leak Scorecard already named on /ecosystem. The page stays
    // positioned against AI-ROI framing, so the card never promises "AI ROI".
    id: "revenue-leak-scorecard",
    kind: "calculator",
    name: "Revenue Leak Scorecard",
    href: "/roi-calculator",
    description:
      "Model the gross-profit value of missed calls, slow follow-up, unworked quotes, and operational labor, priced against your local labor market.",
    primaryResult: "Labor capacity, revenue leakage, owner capacity, modeled opportunity range",
    cta: "Score your revenue leaks",
    status: "live",
  },
];

export const DIAGNOSTICS = TOOLS.filter((t) => t.kind === "diagnostic");
export const CALCULATORS = TOOLS.filter((t) => t.kind === "calculator");

/**
 * Which tools the hub actually renders.
 *
 * Ratified 2026-09-09: `planned` tools are hidden, not shown as "coming soon".
 * The hub's job is to hand a visitor a result without a call, and a card that
 * cannot do that works against the page even when it is honestly labelled.
 * They stay in the registry so a wave ships by flipping `status` to "live" —
 * no edit to the hub, and no window where a card links to a route that 404s.
 */
export function visibleTools(tools: Tool[]): Tool[] {
  return tools.filter((t) => t.status === "live");
}
