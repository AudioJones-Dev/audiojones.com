/**
 * Central modules configuration for Audio Jones platform
 * 
 * This configuration defines the four core system modules:
 * - Client Delivery
 * - Marketing Automation
 * - AI Optimization
 * - Data Intelligence
 * 
 * Each module includes metadata for use across marketing site,
 * client portal, and admin portal.
 */

export type ModuleId = 
  | "client-delivery"
  | "marketing-automation"
  | "ai-optimization"
  | "data-intelligence";

export type FunnelStage = 
  | "discover"
  | "book"
  | "deliver"
  | "optimize"
  | "retain";

export type Persona = "creator" | "business" | "both";

export interface ModuleConfig {
  id: ModuleId;
  name: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  href: string;
  icon: string;
  gradient: {
    from: string;
    to: string;
  };
  funnelStage: FunnelStage;
  suggestedPersonas: Persona[];
}

export const modules: ModuleConfig[] = [
  {
    id: "client-delivery",
    name: "Client Delivery System",
    tagline: "Project management meets client experience",
    shortDescription: "Seamless onboarding, project tracking, and file delivery for professional creative services.",
    longDescription: "The Client Delivery System handles everything from initial onboarding through final deliverable handoff. Clients get a branded portal for project updates, file access, and milestone tracking. Admins get centralized project management with automated workflows, status tracking, and integrated billing.",
    href: "/systems/client-delivery",
    icon: "📦",
    gradient: {
      from: "#FF4500",
      to: "#FFD700",
    },
    funnelStage: "deliver",
    suggestedPersonas: ["both"],
  },
  {
    id: "marketing-automation",
    name: "Marketing Automation System",
    tagline: "AI-powered content distribution at scale",
    shortDescription: "Multi-channel marketing campaigns with intelligent scheduling and performance tracking.",
    longDescription: "The Marketing Automation System powers content creation, scheduling, and distribution across multiple platforms. From social media to email campaigns to podcast distribution, this system ensures your message reaches your audience at the right time. AI-driven optimization continuously improves performance based on engagement data.",
    href: "/systems/marketing-automation",
    icon: "🚀",
    gradient: {
      from: "#008080",
      to: "#FFD700",
    },
    funnelStage: "discover",
    suggestedPersonas: ["both"],
  },
  {
    id: "ai-optimization",
    name: "AI Optimization System",
    tagline: "Machine learning meets creative strategy",
    shortDescription: "A/B testing, predictive analytics, and ML-driven insights to maximize ROI.",
    longDescription: "The AI Optimization System uses machine learning to test, measure, and optimize every aspect of your digital presence. From headline testing to audience segmentation to content performance prediction, this system continuously learns what works and automatically adjusts strategies to maximize engagement and conversions.",
    href: "/systems/ai-optimization",
    icon: "🤖",
    gradient: {
      from: "#9370DB",
      to: "#FFD700",
    },
    funnelStage: "optimize",
    suggestedPersonas: ["both"],
  },
  {
    id: "data-intelligence",
    name: "Data Intelligence System",
    tagline: "Real-time analytics and business intelligence",
    shortDescription: "Unified dashboards, custom reports, and predictive insights across all platforms.",
    longDescription: "The Data Intelligence System aggregates data from every touchpoint—website, social media, email campaigns, client portals, and billing systems—into a single source of truth. Custom dashboards provide real-time visibility into performance metrics, while predictive analytics help forecast trends and identify opportunities before competitors.",
    href: "/systems/data-intelligence",
    icon: "📊",
    gradient: {
      from: "#4169E1",
      to: "#00CED1",
    },
    funnelStage: "optimize",
    suggestedPersonas: ["both"],
  },
];

/**
 * Get a module by its ID
 */
export function getModuleById(id: ModuleId): ModuleConfig | undefined {
  return modules.find((m) => m.id === id);
}

/**
 * Get modules by funnel stage
 */
export function getModulesByFunnelStage(stage: FunnelStage): ModuleConfig[] {
  return modules.filter((m) => m.funnelStage === stage);
}

/**
 * Get modules by persona
 */
export function getModulesByPersona(persona: Persona): ModuleConfig[] {
  return modules.filter((m) => 
    m.suggestedPersonas.includes(persona) || m.suggestedPersonas.includes("both")
  );
}

/**
 * Get gradient CSS class string for a module
 */
export function getModuleGradient(id: ModuleId): string {
  const mod = getModuleById(id);
  if (!mod) return "from-[#FF4500] to-[#FFD700]";
  return `from-[${mod.gradient.from}] to-[${mod.gradient.to}]`;
}
