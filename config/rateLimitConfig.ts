export type Subscription = "guest" | "free" | "premium"

export const RATE_LIMITS: Record<Subscription, number> = {
    guest: 5,
    free: 10,
    premium: 100,
};
