declare namespace NodeJS {
  interface ProcessEnv {
    MAILERLITE_TOKEN?: string;
    MAILERLITE_WEBHOOK_SECRET?: string;
    GODADDY_API_KEY?: string;
    GODADDY_API_SECRET?: string;
  }
}