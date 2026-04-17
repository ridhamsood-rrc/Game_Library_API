import rateLimit from "express-rate-limit";
 
type Subscription = "free" | "premium"
 
const RATE_LIMITS = {
    free: 5,
    premium: 100
}
 
export const rateLimitBySubscription = () => rateLimit({
    windowMs: 60 * 1000,
    max: (req, res) => {
        const subscription = res.locals.subscription as Subscription

        return RATE_LIMITS[subscription]
    },
    keyGenerator: (req, res) => {
      return `ip-${res.locals.uid}`
    },
    message: {
        error: "Rate Limit reached",
        upgrade: "Upgrade to premium to get access to all the games in the library."
    }
})