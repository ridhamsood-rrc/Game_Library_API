import rateLimit from "express-rate-limit";
 
export type Subscription = "free" | "premium"
 
export const RATE_LIMITS = {
    free: 5,
    premium: 100
}
 
export const rateLimitBySubscription = (multiplier: number) => rateLimit({
    windowMs: 60 * 1000 * 2,
    max: (req, res) => {
        const subscription = res.locals.subscription as Subscription
        const currentLimit = RATE_LIMITS[subscription]

        if (subscription === "free") {
            return Math.max(1, Math.floor(currentLimit * multiplier))
        }

        return currentLimit
    },
    keyGenerator: (req, res) => {
      return `user-${res.locals.uid}`
    },
    message: {
        error: "Rate Limit reached",
        upgrade: "Upgrade to premium to get access to all the endpoints in the library."
    }
})