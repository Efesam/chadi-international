import rateLimit from "express-rate-limit";

const jsonHandler = (req, res) => {
  res.status(429).json({
    error: "Too many requests. Please wait a bit before trying again.",
  });
};

/**
 * A baseline limit applied to every /api route, as defense-in-depth against
 * general scripted abuse. Generous enough that no real user should ever hit it.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
});

/**
 * Applied to public form submissions (contact, volunteer, newsletter,
 * donation interest). Strict enough to block scripted spam floods, loose
 * enough that a real person submitting a form (even twice, by mistake)
 * never notices it.
 */
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
});

/**
 * Applied to login specifically, to slow down password-guessing attempts
 * without locking out someone who just mistypes their password a few times.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
});
