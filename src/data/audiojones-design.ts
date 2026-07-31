export const agentSystems = [
  {
    name: "ResponseOS",
    href: "/agents/responseos",
    category: "Revenue",
    description:
      "Revenue recovery infrastructure that captures missed inquiries, qualifies intent, and routes follow-up before pipeline leaks.",
    signal: "Recover missed revenue",
  },
  {
    name: "SignalOS",
    href: "/agents",
    category: "Intelligence",
    description:
      "Business signal clarity for founders who need to see which actions are creating real pipeline and which ones are noise.",
    signal: "Clarify the signal",
  },
  {
    name: "ContentOS",
    href: "/agents",
    category: "Authority",
    description:
      "A repeatable content operating layer that turns founder expertise into published proof, distribution, and campaign assets.",
    signal: "Scale authority",
  },
  {
    name: "PodcastOS",
    href: "/agents",
    category: "Media",
    description:
      "A production and repurposing system for founder-led media that moves ideas from recording to market without manual drag.",
    signal: "Operationalize media",
  },
  {
    name: "ClientOS",
    href: "/agents",
    category: "Operations",
    description:
      "Client onboarding, delivery visibility, and handoff automation for service businesses that need fewer dropped details.",
    signal: "Stabilize delivery",
  },
  {
    name: "SalesOS",
    href: "/agents",
    category: "Pipeline",
    description:
      "Lead qualification, booking, and sales follow-up infrastructure for founder-led teams with inconsistent response cadence.",
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
      "Follow-up, booking, callback, and human-escalation paths keep legitimate opportunities from disappearing after the first response.",
  },
  {
    step: "05",
    title: "Learn",
    description:
      "Attribution and recovery reporting compare agreed outcomes with the client baseline so the managed workflow can be improved with evidence.",
  },
] as const;

export const proofSignals = [
  {
    metric: "Target KPI",
    label: "First-response time measured against the client baseline.",
  },
  {
    metric: "Tracked outcome",
    label: "Qualified opportunities recovered by source and workflow.",
  },
  {
    metric: "Operational goal",
    label: "One accountable recovery path for every legitimate inquiry.",
  },
] as const;

export const caseStudies = [
  {
    title: "Local service pipeline recovery",
    description:
      "A founder-led service business needed faster inbound response and clearer lead status. The system map exposed follow-up leaks before a tool was added.",
    outcome: "Illustrative workflow — not a client result",
  },
  {
    title: "Expertise to authority engine",
    description:
      "A consulting brand had strong expertise but weak publishing rhythm. The operating model turned founder ideas into repeatable content and offers.",
    outcome: "Illustrative workflow — not a client result",
  },
  {
    title: "Attribution signal cleanup",
    description:
      "A growth team could see activity but not causality. The audit separated vanity metrics from pipeline signals and clarified the next system layer.",
    outcome: "Illustrative workflow — not a client result",
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
    body: "The operating question is whether every legitimate inquiry has an accountable next action, not whether another tool was installed.",
    attribution: "ResponseOS operating principle — not a client result",
  },
  stats: proofSignals,
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
