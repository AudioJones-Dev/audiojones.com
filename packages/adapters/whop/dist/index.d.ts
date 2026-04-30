export interface WhopClient {
    fetch: (path: string, init?: RequestInit) => Promise<Response>;
    users: {
        getUser: (params: {
            userId: string;
        }) => Promise<unknown>;
        getCurrentUser: () => Promise<unknown>;
    };
    payments: {
        list: (params?: {
            company_id?: string;
            limit?: number;
            page?: number;
        }) => Promise<unknown>;
        get: (paymentId: string) => Promise<unknown>;
    };
    subscriptions: {
        list: (params?: {
            company_id?: string;
            limit?: number;
            page?: number;
        }) => Promise<unknown>;
        get: (subscriptionId: string) => Promise<unknown>;
    };
    access: {
        checkIfUserHasAccessToExperience: (params: {
            experienceId: string;
            userId: string;
        }) => Promise<unknown>;
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
    verifyUserToken: (headers: Headers) => Promise<{
        userId: string;
    }>;
}
export declare function getWhopClient(): WhopClient;
export declare function verifyWhopSignature(rawBody: string, signature: string): void;
export type WhopWebhookEvent = {
    type: string;
    data: unknown;
    created_at: string;
    id: string;
};
export declare function parseWhopWebhook(rawBody: string, signature: string): WhopWebhookEvent;
//# sourceMappingURL=index.d.ts.map