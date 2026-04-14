import rateLimit from "express-rate-limit";
import { environment } from "../config/environment.js";

/**
 * Rate limiter for authentication endpoints
 * Max 5 requests per minute per IP
 */
export const authRateLimiter = rateLimit({
  windowMs: environment.rateLimitWindowMs, // 1 minute
  max: environment.rateLimitMaxRequests, // 5 requests
  message: "Too many registration/login attempts, please try again later.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req) => environment.isDevelopment, // Skip rate limiting in development
});
