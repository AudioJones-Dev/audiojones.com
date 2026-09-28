declare namespace NodeJS {
  interface ProcessEnv {
    WHOP_API_KEY?: string;
    WHOP_WEBHOOK_SECRET?: string;
    MAILERLITE_TOKEN?: string;
    MAILERLITE_WEBHOOK_SECRET?: string;
    RESEND_NEWSLETTER_SEGMENT_ID?: string;
    RESEND_NEWSLETTER_TOPIC_ID?: string;
    RESEND_NEWSLETTER_EVENT?: string;
    NEXT_PUBLIC_NEWSLETTER_DISABLED?: string;
    GODADDY_API_KEY?: string;
    GODADDY_API_SECRET?: string;
  }
}
