// Error monitoring and analytics, both entirely opt-in via env vars. Neither
// loads anything (or costs any bundle weight beyond this tiny module) until
// the corresponding VITE_* variable is set - mirrors how DonateModal treats
// an unset Paystack key: the feature quietly does nothing instead of
// breaking, and works for real the moment real credentials are provided.

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;

let sentryReady = false;
let analyticsEnabled = false;

/**
 * Call once at startup (see main.jsx). Only sets up error monitoring -
 * treated as essential/security tooling, not gated by cookie consent.
 * Analytics is separate (see enableAnalytics) since CookieConsent decides
 * when that's allowed to load.
 */
export async function initMonitoring() {
  if (!SENTRY_DSN) return;

  const Sentry = await import("@sentry/react");
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: import.meta.env.MODE,
  });
  sentryReady = true;
}

/**
 * Loads Plausible. Called by CookieConsent once the visitor has accepted
 * (or already had, on an earlier visit) - never fires on its own.
 */
export function enableAnalytics() {
  if (!PLAUSIBLE_DOMAIN || analyticsEnabled) return;
  analyticsEnabled = true;

  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = PLAUSIBLE_DOMAIN;
  script.src = "https://plausible.io/js/script.js";
  document.head.appendChild(script);
}

/**
 * Reports a caught error (e.g. from an error boundary) to Sentry if
 * configured; otherwise just logs it, same as before this existed.
 */
export async function reportError(error, extra) {
  console.error("[error]", error, extra);

  if (!SENTRY_DSN) return;

  if (!sentryReady) return; // initMonitoring() hasn't resolved yet - nothing to report to

  const Sentry = await import("@sentry/react");
  Sentry.captureException(error, { extra });
}

/** Records an SPA page view with Plausible. No-op if analytics isn't configured. */
export function trackPageview() {
  if (!PLAUSIBLE_DOMAIN || typeof window.plausible !== "function") return;
  window.plausible("pageview");
}
