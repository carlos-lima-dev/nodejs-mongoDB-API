import rateLimit from "express-rate-limit";
// Rate limiter for login attempts
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (15 minutes)
  message: "Too many attempts from this IP, please try again later.",
});
