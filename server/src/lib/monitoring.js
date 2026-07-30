// Server-side error monitoring, entirely opt-in via SENTRY_DSN - mirrors
// client/src/lib/monitoring.js and this codebase's general pattern for
// optional integrations (Paystack/SMTP/Cloudinary/etc): does nothing at all
// until real credentials are provided, works for real the moment they are.

const SENTRY_DSN = process.env.SENTRY_DSN;

let sentry = null;

/** Call once at startup, before the server starts accepting requests. */
export async function initMonitoring() {
  if (!SENTRY_DSN) return;

  sentry = await import("@sentry/node");
  sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV || "development",
  });
}

/** Reports an error to Sentry if configured; always logs to the console too. */
export function reportError(error, extra) {
  console.error(error);
  sentry?.captureException(error, { extra });
}

/**
 * Flushes any queued Sentry events before the process exits. Crash handlers
 * need this because process.exit() would otherwise cut off the in-flight
 * network request Sentry just started.
 */
export async function flushMonitoring() {
  if (!sentry) return;
  await sentry.flush(2000).catch(() => {});
}
