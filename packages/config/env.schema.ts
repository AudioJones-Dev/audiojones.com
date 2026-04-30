import { z } from "zod";

export const EnvSchema = z.object({
  // Core app environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  
  // Database — NeonDB (Postgres)
  DATABASE_URL: z.string().min(1).optional(),

  // Email — Resend
  // Format validators are deliberately loose here — Doppler may store values
  // like `Audio Jones <noreply@audiojones.com>` for FROM_EMAIL, and we don't
  // want validateEnv to fail at module load over format quirks. The actual
  // mail send still validates the recipient at request time.
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().min(1).optional(),
  LEAD_NOTIFICATION_EMAIL: z.string().min(1).optional(),
  FROM_EMAIL: z.string().optional(),

  // Sanity CMS
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1).optional(),
  SANITY_API_READ_TOKEN: z.string().min(1).optional(),

  // Supabase — only used if auth/storage/realtime is required
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Whop integration
  WHOP_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_WHOP_APP_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_WHOP_COMPANY_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_WHOP_AGENT_USER_ID: z.string().min(1).optional(),
  WHOP_WEBHOOK_SECRET: z.string().min(1).optional(),
  
  // OpenAI & AI services
  OPENAI_API_KEY: z.string().min(1).optional(),
  
  // MailerLite integration
  MAILERLITE_API_KEY: z.string().min(1).optional(),
  MAILERLITE_GROUP_ID: z.string().min(1).optional(),
  
  // n8n automation (optional — lead capture continues if n8n fails).
  // Loose validation: the runtime fetch fails fast on a bad URL, and we'd
  // rather not block module-load on a typo in Doppler.
  N8N_WEBHOOK_URL: z.string().min(1).optional(),
  N8N_LEAD_WEBHOOK_URL: z.string().min(1).optional(),
  CRM_WEBHOOK_URL: z.string().min(1).optional(),

  // Applied Intelligence diagnostic
  LEAD_FORM_SECRET: z.string().min(1).optional(),
  IP_HASH_SALT: z.string().min(1).optional(),
  
  // Stripe payments
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  
  // ImageKit CDN
  IMAGEKIT_ENDPOINT: z.string().url().optional(),
  IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  
  // Observability & monitoring
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  SENTRY_DSN: z.string().optional(),
  RELEASE: z.string().optional(),
  
  // API base URLs
  API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

// Runtime environment validation
export function validateEnv(env: Record<string, string | undefined>): Env {
  const parsed = EnvSchema.safeParse(env);
  
  if (!parsed.success) {
    console.error("❌ Environment validation failed:");
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    
    // In build mode, log error but don't exit
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE === "phase-production-build") {
      console.warn("⚠️ Build mode: Environment validation failed but continuing...");
      // Return partial env with defaults
      return env as unknown as Env;
    }
    
    process.exit(1);
  }
  
  console.log("✅ Environment validation successful");
  return parsed.data;
}