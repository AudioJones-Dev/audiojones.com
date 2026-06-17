export const agentSystems = [
  {
    name: "ResponseOS",
    href: "/agents/responseos",
    category: "Revenue",
    description:
      "Captures missed calls and inquiries, sorts the real buyers, and follows up fast — so leads stop slipping away.",
    signal: "Recover missed revenue",
  },
  {
    name: "SignalOS",
    href: "/agents",
    category: "Intelligence",
    description:
      "Shows founders which actions are creating real sales, and which ones are just noise.",
    signal: "Clarify the signal",
  },
  {
    name: "ContentOS",
    href: "/agents",
    category: "Authority",
    description:
      "Turns your expertise into published content on a repeatable system, instead of by hand.",
    signal: "Scale authority",
  },
  {
    name: "PodcastOS",
    href: "/agents",
    category: "Media",
    description:
      "A system that takes founder-led media from recording to published, without the manual slog.",
    signal: "Systemize your media",
  },
  {
    name: "ClientOS",
    href: "/agents",
    category: "Operations",
    description:
      "Smooth client onboarding, clear delivery, and clean handoffs — so fewer details get dropped.",
    signal: "Stabilize delivery",
  },
  {
    name: "SalesOS",
    href: "/agents",
    category: "Pipeline",
    description:
      "Qualifies leads, books them, and keeps sales follow-up steady for founder-led teams.",
    signal: "Tighten pipeline",
  },
] as const;

export const responseOsFlow = [
  {
    step: "01",
    title: "Capture",
    description:
      "Every inbound inquiry, form fill, missed call, and message enters one recovery path instead of scattering across tools.",
  },
  {
    step: "02",
    title: "Qualify",
    description:
      "ResponseOS reads intent, urgency, fit, and missing context so the next action is based on signal, not guesswork.",
  },
  {
    step: "03",
    title: "Route",
    description:
      "Qualified opportunities move to the right follow-up, booking path, operator, or nurture sequence with a clear status.",
  },
  {
    step: "04",
    title: "Recover",
    description:
      "The system closes the response gap, records outcomes, and shows where revenue was recovered or still leaking.",
  },
] as const;

export const proofSignals = [
  {
    metric: "+38%",
    label: "More replies to missed leads after ResponseOS.",
  },
  {
    metric: "<9 min",
    label: "Typical time to the first reply on hot leads.",
  },
  {
    metric: "1 inbox",
    label: "Every channel pulled into one view.",
  },
] as const;

export const caseStudies = [
  {
    title: "Local service pipeline recovery",
    description:
      "A founder-led service business needed faster inbound response and clearer lead status. The system map exposed follow-up leaks before a tool was added.",
    outcome: "Follow-up gap identified",
  },
  {
    title: "Expertise to authority engine",
    description:
      "A consulting brand had strong expertise but weak publishing rhythm. The operating model turned founder ideas into repeatable content and offers.",
    outcome: "Content operating loop defined",
  },
  {
    title: "Attribution signal cleanup",
    description:
      "A growth team could see activity but not causality. The audit separated vanity metrics from pipeline signals and clarified the next system layer.",
    outcome: "Signal scorecard created",
  },
] as const;

export const workshops = [
  {
    title: "AI Readiness for Founder-Led Teams",
    description:
      "Diagnose the workflows, data quality, SOP maturity, and adoption blockers that determine whether AI will create leverage.",
    format: "Live operator session",
  },
  {
    title: "Revenue Recovery Systems",
    description:
      "Map where missed calls, slow follow-up, weak routing, and unclear ownership create revenue leaks inside the business.",
    format: "Systems workshop",
  },
  {
    title: "Signal Over Noise Operating Model",
    description:
      "Turn scattered marketing, sales, and delivery activity into a practical signal model that guides founder decisions.",
    format: "Executive working session",
  },
] as const;

export const diagnosticDimensions = [
  "Workflow clarity",
  "Data quality",
  "Follow-up speed",
  "SOP maturity",
  "Tool fragmentation",
  "Team adoption",
] as const;

export const agentsProofStrip = {
  quote: {
    body: "We did not need another tool. We needed a system that owned the follow-up. ResponseOS closed the gap in three weeks.",
    attribution: "Founder, professional services, $1.2M run-rate",
  },
  stats: [
    { metric: "+38%", label: "Reply rate lift on missed inquiries" },
    { metric: "<9 min", label: "Median time-to-first-response on high-intent leads" },
    { metric: "$214K", label: "Recovered revenue, first 90 days (representative deployment)" },
  ],
} as const;

export const systemComparison = {
  rows: [
    "Business diagnosis before tooling",
    "Owns the operating workflow",
    "Routing and decision logic",
    "Measurable outcomes",
  ],
  columns: [
    { label: "Generic automation", recommended: false, marks: [false, false, false, false] },
    { label: "Chatbot package", recommended: false, marks: [false, false, false, false] },
    { label: "Agent system", recommended: true, marks: [true, true, true, true] },
  ],
} as const;
