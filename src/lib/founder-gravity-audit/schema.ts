import { z } from "zod";

const optionalString = z.string().trim().optional();

export const founderGravityAuditLeadSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
  displayName: z.string().trim().min(1, "Display name is required"),
  entityName: z.string().trim().min(1, "Entity name is required"),
  consentToContact: z.boolean().refine((value) => value === true, {
    message: "Consent is required.",
  }),
  sessionId: z.string().trim().min(8).max(120),
  answers: z.record(z.string(), z.string()).refine(
    (answers) => Object.keys(answers).length >= 12,
    "At least 12 diagnostic answers are required.",
  ),
  durationSeconds: z.number().int().min(0).max(86_400).optional(),
  attribution: z
    .object({
      acquisitionChannel: optionalString,
      sourcePage: optionalString,
      referrer: optionalString,
      landingPath: optionalString,
      utmSource: optionalString,
      utmMedium: optionalString,
      utmCampaign: optionalString,
      utmTerm: optionalString,
      utmContent: optionalString,
    })
    .optional(),
  events: z
    .array(
      z.object({
        event: z.string().trim().min(1).max(80),
        timestamp: z.string().trim().min(1).max(80),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .max(50)
    .optional(),
  website_url: z.string().optional(),
});

export type FounderGravityAuditLeadSchemaInput = z.infer<
  typeof founderGravityAuditLeadSchema
>;
