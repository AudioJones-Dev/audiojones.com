import { env } from "@aj/config";
import crypto from "node:crypto";

export interface WhopClient {
  fetch: (path: string, init?: RequestInit) => Promise<Response>;
  users: {
    getUser: (params: { userId: string }) => Promise<unknown>;
    getCurrentUser: () => Promise<unknown>;
  };
  payments: {
    list: (params?: { company_id?: string; limit?: number; page?: number }) => Promise<unknown>;
    get: (paymentId: string) => Promise<unknown>;
  };
  subscriptions: {
    list: (params?: { company_id?: string; limit?: number; page?: number }) => Promise<unknown>;
    get: (subscriptionId: string) => Promise<unknown>;
  };
  access: {
    checkIfUserHasAccessToExperience: (params: { experienceId: string; userId: string }) => Promise<unknown>;
  };
  notifications: {
    create: (params: { 
      experience_id?: string; 
      company_id?: string; 
      title: string; 
      content: string; 
      rest_path?: string;
    }) => Promise<unknown>;
  };
  forumPosts: {
    create: (params: {
      experience_id: string;
      content: string;
      pinned?: boolean;
    }) => Promise<unknown>;
  };
  messages: {
    create: (params: {
      channel_id: string;
      content: string;
    }) => Promise<unknown>;
  };
  verifyUserToken: (headers: Headers) => Promise<{ userId: string }>;
}

export function getWhopClient(): WhopClient {
  const apiKey = env.WHOP_API_KEY;
  if (!apiKey) {
    throw new Error("WHOP_API_KEY is not configured");
  }
  const baseUrl = "https://api.whop.com";

  const baseFetch = (path: string, init: RequestInit = {}) => {
    return fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        ...(init.headers || {}),
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
  };

  return {
    fetch: baseFetch,
    
    users: {
      getUser: async ({ userId }) => {
        const response = await baseFetch(`/v2/users/${userId}`);
        return response.json();
      },
      getCurrentUser: async () => {
        const response = await baseFetch("/v2/me");
        return response.json();
      },
    },

    payments: {
      list: async (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.company_id) searchParams.set("company_id", params.company_id);
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.page) searchParams.set("page", params.page.toString());
        
        const response = await baseFetch(`/v2/payments?${searchParams}`);
        return response.json();
      },
      get: async (paymentId) => {
        const response = await baseFetch(`/v2/payments/${paymentId}`);
        return response.json();
      },
    },

    subscriptions: {
      list: async (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.company_id) searchParams.set("company_id", params.company_id);
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.page) searchParams.set("page", params.page.toString());
        
        const response = await baseFetch(`/v2/subscriptions?${searchParams}`);
        return response.json();
      },
      get: async (subscriptionId) => {
        const response = await baseFetch(`/v2/subscriptions/${subscriptionId}`);
        return response.json();
      },
    },

    access: {
      checkIfUserHasAccessToExperience: async ({ experienceId, userId }) => {
        const response = await baseFetch(`/v2/access/experiences/${experienceId}/users/${userId}`);
        return response.json();
      },
    },

    notifications: {
      create: async (params) => {
        const response = await baseFetch("/v2/notifications", {
          method: "POST",
          body: JSON.stringify(params),
        });
        return response.json();
      },
    },

    forumPosts: {
      create: async (params) => {
        const response = await baseFetch("/v2/forum/posts", {
          method: "POST",
          body: JSON.stringify(params),
        });
        return response.json();
      },
    },

    messages: {
      create: async (params) => {
        const response = await baseFetch("/v2/messages", {
          method: "POST",
          body: JSON.stringify(params),
        });
        return response.json();
      },
    },

    verifyUserToken: async (headers) => {
      const token = headers.get("authorization")?.replace("Bearer ", "");
      if (!token) throw new Error("No authorization token");
      
      const response = await baseFetch("/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Invalid token");
      
      const user = await response.json() as { id: string };
      return { userId: user.id };
    },
  };
}

export function verifyWhopSignature(rawBody: string, signature: string): void {
  const secret = env.WHOP_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("WHOP_WEBHOOK_SECRET is not configured");
  }
  const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  
  // Remove 'sha256=' prefix if present
  const cleanSignature = signature.replace("sha256=", "");
  
  if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(cleanSignature))) {
    throw new Error("Invalid Whop webhook signature");
  }
}

export type WhopWebhookEvent = {
  type: string;
  data: unknown;
  created_at: string;
  id: string;
};

export function parseWhopWebhook(rawBody: string, signature: string): WhopWebhookEvent {
  verifyWhopSignature(rawBody, signature);
  return JSON.parse(rawBody);
}