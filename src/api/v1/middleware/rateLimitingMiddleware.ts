import rateLimit from 'express-rate-limit';
import { RATE_LIMITS, Subscription } from '../../../../config/rateLimitConfig';

export const rateLimitBySubscription = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: (req, res) => {
    const subscription = (res.locals.subscription || 'guest') as Subscription;
    return RATE_LIMITS[subscription] || 5;
  },
  keyGenerator: (req, res) => {
    if(res.locals.uid) {
        return `user-${res.locals.uid}` }
        return`ip-${req.ip}`;
  },
  message: {
    error: "Rate Limit reached",
    upgrade: "Upgrade to premium to get access to all the games in the library.",
  },
});