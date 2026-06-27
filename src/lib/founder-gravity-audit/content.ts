import type {
  FounderGravityCta,
  FounderGravityQuestion,
  FounderGravitySegment,
  GravityLayerId,
} from "./types";

export const FOUNDER_GRAVITY_ASSET = {
  asset: "Founder Gravity Audit",
  recordType: "asset",
  assetType: "Diagnostic",
  productizationLane: "Lead Magnet / Diagnostic Tool",
  targetLane: "None",
  productReadinessStage: "Research",
  monetizationModel: "None",
  gtmMotion: "Diagnostic",
} as const;

export const GRAVITY_LAYERS: Record<GravityLayerId, string> = {
  decision: "Decision Gravity",
  approval: "Approval Gravity",
  accountability: "Accountability Gravity",
  revenue: "Revenue Gravity",
  memory: "Operational Memory Gravity",
  execution: "Execution Gravity",
};

export const SEGMENT_DEFINITIONS: Record<FounderGravitySegment, string> = {
  Orbit:
    "Operational mass is concentrated around a single point, creating continuity risk when the founder is unavailable.",
  "High Pull":
    "Multiple operating layers still pull decisions, quality control, revenue, or context back to the founder.",
  Drift:
    "Delegation exists in parts of the business, but real operating behavior still routes back through hidden founder dependency.",
  Stabilizing:
    "Dependency is actively being reduced, with specific fragility zones that still need reinforcement.",
  Distributed:
    "Operational authority and memory are broadly distributed, with the founder less central to daily continuity.",
};

export const SEGMENT_PREVIEW_COPY: Record<FounderGravitySegment, string> = {
  Orbit:
    "The full report maps which layers create the greatest continuity risk and where intervention would reduce dependency fastest.",
  "High Pull":
    "The full report identifies the highest-risk concentration points, with special attention to revenue and decision flow.",
  Drift:
    "The full report separates what has been delegated on paper from what still routes back to you in practice.",
  Stabilizing:
    "The full report identifies the operating areas where systems exist but still need reinforcement.",
  Distributed:
    "The full report identifies what is already distributed and where your operating model may be useful as a reference pattern.",
};

export const SEGMENT_CTAS: Record<FounderGravitySegment, FounderGravityCta> = {
  Orbit: {
    label: "Schedule an Operational Intelligence Review",
    event: "consultation_booked",
    href: "/book-a-call?source=founder-gravity-audit&segment=orbit",
    pathway: "executive_consulting",
  },
  "High Pull": {
    label: "Schedule an Operational Intelligence Review",
    event: "consultation_booked",
    href: "/book-a-call?source=founder-gravity-audit&segment=high-pull",
    pathway: "executive_consulting",
  },
  Drift: {
    label: "Explore Founder Intelligence Systems",
    event: "trial_or_subscription_interest",
    href: "/solutions?source=founder-gravity-audit&segment=drift",
    pathway: "founder_intelligence_systems",
  },
  Stabilizing: {
    label: "Add ResponseOS to your operational stack",
    event: "responseos_interest",
    href: "/agents/responseos?source=founder-gravity-audit&segment=stabilizing",
    pathway: "responseos_extension",
  },
  Distributed: {
    label: "Join the operator network",
    event: "partnership_interest",
    href: "/book-a-call?source=founder-gravity-audit&segment=distributed&intent=operator-network",
    pathway: "operator_network",
  },
};

const scale5 = [
  { value: "0", label: "Almost never", score: 0 },
  { value: "1", label: "Occasionally", score: 1 },
  { value: "2", label: "About half the time", score: 2 },
  { value: "3", label: "Often", score: 3 },
  { value: "4", label: "Nearly always", score: 4 },
];

const inverseAutonomy = [
  { value: "0", label: "Almost all of it can keep moving", score: 0 },
  { value: "1", label: "Most of it can keep moving", score: 1 },
  { value: "2", label: "Some areas can keep moving", score: 2 },
  { value: "3", label: "Only routine work can keep moving", score: 3 },
  { value: "4", label: "Very little can keep moving without me", score: 4 },
];

export const FOUNDER_GRAVITY_QUESTIONS: FounderGravityQuestion[] = [
  {
    id: "revenue_band",
    code: "FGA-FIRM-01",
    role: "firmographic",
    stage: "identification",
    prompt: "Which band best describes your current annual revenue?",
    options: [
      { value: "under_250k", label: "Under $250K" },
      { value: "250k_500k", label: "$250K-$500K" },
      { value: "500k_1m", label: "$500K-$1M" },
      { value: "1m_2m", label: "$1M-$2M" },
      { value: "2m_5m", label: "$2M-$5M" },
      { value: "5m_plus", label: "$5M+" },
    ],
  },
  {
    id: "team_size_band",
    code: "FGA-FIRM-02",
    role: "firmographic",
    stage: "identification",
    prompt: "How many people currently depend on your operating direction each week?",
    options: [
      { value: "solo", label: "Just me" },
      { value: "2_5", label: "2-5 people" },
      { value: "6_15", label: "6-15 people" },
      { value: "16_40", label: "16-40 people" },
      { value: "40_plus", label: "More than 40 people" },
    ],
  },
  {
    id: "operating_category",
    code: "FGA-FIRM-03",
    role: "firmographic",
    stage: "identification",
    prompt: "Which operating category best describes your business?",
    options: [
      { value: "expert_service", label: "Expert service firm" },
      { value: "agency", label: "Agency or creative services" },
      { value: "field_service", label: "Field or local service business" },
      { value: "consulting", label: "Consulting or advisory" },
      { value: "hybrid", label: "Hybrid service and product operation" },
    ],
  },
  {
    id: "autonomy_baseline",
    code: "FGA-SELF-01",
    role: "self_perception",
    stage: "identification",
    prompt: "How much of your business can operate for ten business days without your daily input?",
    options: inverseAutonomy,
  },
  {
    id: "availability_bottleneck",
    code: "FGA-SELF-02",
    role: "self_perception",
    stage: "symptom_recognition",
    prompt: "When work slows down, how often is the limiting factor your availability?",
    options: scale5,
  },
  {
    id: "standards_clarity",
    code: "FGA-SELF-03",
    role: "self_perception",
    stage: "symptom_recognition",
    prompt: "How confident are you that your team understands your operating standards without checking with you?",
    options: [
      { value: "0", label: "Very confident", score: 0 },
      { value: "1", label: "Mostly confident", score: 1 },
      { value: "2", label: "Mixed by person or function", score: 2 },
      { value: "3", label: "Not very confident", score: 3 },
      { value: "4", label: "They usually need my context", score: 4 },
    ],
  },
  {
    id: "decision_waits",
    code: "FGA-DG-01",
    role: "layer_item",
    stage: "dependency_mapping",
    layer: "decision",
    weight: 1.5,
    prompt: "In the last 30 days, how often did material decisions wait for your direct input before moving forward?",
    options: scale5,
  },
  {
    id: "decision_landing_zone",
    code: "FGA-DG-02",
    role: "layer_item",
    stage: "dependency_mapping",
    layer: "decision",
    weight: 1,
    prompt: "When a team member has two reasonable options, where does the decision usually land?",
    options: [
      { value: "owned", label: "They choose and document the decision", score: 0 },
      { value: "team", label: "The team decides within clear standards", score: 1 },
      { value: "asks", label: "They usually ask me to confirm", score: 3 },
      { value: "waits", label: "They wait until I decide", score: 4 },
    ],
  },
  {
    id: "routine_review",
    code: "FGA-AG-01",
    role: "layer_item",
    stage: "dependency_mapping",
    layer: "approval",
    weight: 1.5,
    prompt: "What percentage of routine deliverables still receive your review before being considered complete?",
    options: [
      { value: "under_10", label: "Under 10%", score: 0 },
      { value: "10_30", label: "10%-30%", score: 1 },
      { value: "30_60", label: "30%-60%", score: 2 },
      { value: "60_85", label: "60%-85%", score: 3 },
      { value: "85_plus", label: "More than 85%", score: 4 },
    ],
  },
  {
    id: "signoff_categories",
    code: "FGA-AG-02",
    role: "layer_item",
    stage: "dependency_mapping",
    layer: "approval",
    weight: 1,
    prompt: "Which work categories still require your sign-off even when someone else owns execution?",
    options: [
      { value: "none", label: "Almost none; standards decide", score: 0 },
      { value: "sensitive", label: "Only sensitive client or revenue moments", score: 1 },
      { value: "client_facing", label: "Most client-facing work", score: 2 },
      { value: "strategic", label: "Most strategic and client-facing work", score: 3 },
      { value: "most", label: "Most work still routes through me", score: 4 },
    ],
  },
  {
    id: "standards_detection",
    code: "FGA-AC-01",
    role: "layer_item",
    stage: "dependency_mapping",
    layer: "accountability",
    weight: 1.5,
    prompt: "When standards slip, who usually detects and corrects the issue first?",
    options: [
      { value: "owner", label: "The work owner detects and corrects it", score: 0 },
      { value: "peer", label: "A peer or lead catches it", score: 1 },
      { value: "mixed", label: "It depends on the area", score: 2 },
      { value: "founder_detects", label: "I usually catch it first", score: 3 },
      { value: "founder_corrects", label: "I usually catch and correct it", score: 4 },
    ],
  },
  {
    id: "team_enforces_quality",
    code: "FGA-AC-02",
    role: "layer_item",
    stage: "dependency_mapping",
    layer: "accountability",
    weight: 1,
    prompt: "How often does the team enforce quality expectations without your intervention?",
    options: [
      { value: "always", label: "Consistently", score: 0 },
      { value: "often", label: "Often", score: 1 },
      { value: "mixed", label: "In some functions", score: 2 },
      { value: "rarely", label: "Rarely", score: 3 },
      { value: "never", label: "Almost never", score: 4 },
    ],
  },
  {
    id: "renewal_dependency",
    code: "FGA-RG-01",
    role: "layer_item",
    stage: "operational_exposure",
    layer: "revenue",
    weight: 2,
    prompt: "Which client renewal or expansion conversations still depend on your personal relationship?",
    options: [
      { value: "none", label: "None materially depend on me", score: 0 },
      { value: "few", label: "A few high-trust relationships", score: 1 },
      { value: "key_accounts", label: "Several key accounts", score: 2 },
      { value: "most_major", label: "Most major accounts", score: 3 },
      { value: "nearly_all", label: "Nearly all meaningful revenue conversations", score: 4 },
    ],
  },
  {
    id: "revenue_pause",
    code: "FGA-RG-02",
    role: "layer_item",
    stage: "operational_exposure",
    layer: "revenue",
    weight: 2,
    prompt: "If you were unavailable for two weeks, what revenue conversations would likely pause?",
    options: [
      { value: "none", label: "None; ownership is clear", score: 0 },
      { value: "new_complex", label: "Only complex new opportunities", score: 1 },
      { value: "renewals", label: "Some renewals or expansions", score: 2 },
      { value: "pipeline", label: "A meaningful part of active pipeline", score: 3 },
      { value: "critical", label: "Critical revenue motion would stall", score: 4 },
    ],
  },
  {
    id: "operating_source",
    code: "FGA-OM-01",
    role: "layer_item",
    stage: "dependency_mapping",
    layer: "memory",
    weight: 1.5,
    prompt: "Where does the team go first when they need the current version of how work should be done?",
    options: [
      { value: "system", label: "A maintained operating system or SOP library", score: 0 },
      { value: "docs", label: "Docs, but not always current", score: 1 },
      { value: "lead", label: "A team lead or senior operator", score: 2 },
      { value: "founder", label: "They ask me for context", score: 3 },
      { value: "tribal", label: "Mostly memory and repeated explanations", score: 4 },
    ],
  },
  {
    id: "head_context",
    code: "FGA-OM-02",
    role: "layer_item",
    stage: "operational_exposure",
    layer: "memory",
    weight: 2,
    prompt: "Which recurring operating decisions still require context that mainly lives in your head?",
    options: [
      { value: "none", label: "Almost none", score: 0 },
      { value: "exceptions", label: "Only uncommon exceptions", score: 1 },
      { value: "client_context", label: "Client context and tradeoffs", score: 2 },
      { value: "priorities", label: "Priorities, standards, and edge cases", score: 3 },
      { value: "core", label: "Most operating judgment still lives with me", score: 4 },
    ],
  },
  {
    id: "attention_shift",
    code: "FGA-EG-01",
    role: "layer_item",
    stage: "dependency_mapping",
    layer: "execution",
    weight: 1,
    prompt: "When your attention shifts away from a project, what usually happens to pace and quality?",
    options: [
      { value: "holds", label: "Pace and quality hold", score: 0 },
      { value: "minor_drift", label: "Minor drift, quickly corrected", score: 1 },
      { value: "mixed", label: "Some projects hold, others slow", score: 2 },
      { value: "slows", label: "Pace usually slows", score: 3 },
      { value: "drops", label: "Pace and quality both drop", score: 4 },
    ],
  },
  {
    id: "first_slow_workstream",
    code: "FGA-EG-02",
    role: "layer_item",
    stage: "operational_exposure",
    layer: "execution",
    weight: 1.5,
    prompt: "Which active workstreams would slow first if you stopped checking in this week?",
    options: [
      { value: "none", label: "None materially", score: 0 },
      { value: "new", label: "New or ambiguous work", score: 1 },
      { value: "crossfunctional", label: "Cross-functional work", score: 2 },
      { value: "client_delivery", label: "Client delivery or internal execution", score: 3 },
      { value: "most", label: "Most active workstreams", score: 4 },
    ],
  },
  {
    id: "ten_day_risk",
    code: "FGA-SCEN-01",
    role: "scenario",
    stage: "operational_exposure",
    prompt: "You are unreachable for ten business days. Which area creates the first material risk?",
    options: [
      {
        value: "decision",
        label: "Decision flow",
        layerScores: { decision: 4 },
        fragilityZone: "Decision flow",
      },
      {
        value: "revenue",
        label: "Client retention, renewals, or sales",
        layerScores: { revenue: 4 },
        fragilityZone: "Client retention / renewals",
      },
      {
        value: "memory",
        label: "Context, standards, or operating memory",
        layerScores: { memory: 4 },
        fragilityZone: "Operating memory",
      },
      {
        value: "execution",
        label: "Project pace and quality",
        layerScores: { execution: 4 },
        fragilityZone: "Execution continuity",
      },
      {
        value: "none",
        label: "No material area breaks first",
        layerScores: {},
        fragilityZone: "Low immediate fragility",
      },
    ],
  },
  {
    id: "senior_client_decision",
    code: "FGA-SCEN-02",
    role: "scenario",
    stage: "operational_exposure",
    prompt: "A senior client asks for a decision that affects scope, timeline, and revenue. What happens without you?",
    options: [
      { value: "owned", label: "The owner decides within documented boundaries", layerScores: {} },
      { value: "lead_decides", label: "A senior lead decides but may check later", layerScores: { decision: 1, revenue: 1 } },
      { value: "delays", label: "The team delays until I can weigh in", layerScores: { decision: 3, revenue: 3 } },
      { value: "escalates", label: "It escalates immediately to me", layerScores: { decision: 4, revenue: 4 } },
    ],
  },
  {
    id: "missed_standard",
    code: "FGA-SCEN-03",
    role: "scenario",
    stage: "operational_exposure",
    prompt: "A project misses the internal standard. Who notices, decides the fix, and enforces the correction?",
    options: [
      { value: "owner", label: "The work owner handles all three", layerScores: {} },
      { value: "lead", label: "A team lead handles it", layerScores: { accountability: 1 } },
      { value: "founder_notices", label: "I usually notice, then the team fixes", layerScores: { accountability: 3, approval: 2 } },
      { value: "founder_fixes", label: "I notice, decide the fix, and enforce it", layerScores: { accountability: 4, approval: 4 } },
    ],
  },
];

export function getQuestionById(id: string) {
  return FOUNDER_GRAVITY_QUESTIONS.find((question) => question.id === id);
}
