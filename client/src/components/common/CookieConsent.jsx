import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { enableAnalytics } from "../../lib/monitoring";

const STORAGE_KEY = "chadi_cookie_consent";

/**
 * A minimal consent banner for the one thing on this site consent actually
 * gates: Plausible pageview analytics (see lib/monitoring.js). The site
 * itself sets no cookies of its own - the admin session token lives in
 * localStorage, not a cookie - so there's nothing else to block here.
 * Paystack's checkout popup may set its own cookies on its own domain,
 * which is covered in the Privacy Policy rather than this banner.
 */
function CookieConsent() {
  const { t } = useTranslation();
  const [choice, setChoice] = useState(() => localStorage.getItem(STORAGE_KEY));

  useEffect(() => {
    if (choice === "accepted") enableAnalytics();
  }, [choice]);

  const respond = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    setChoice(value);
  };

  if (choice) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[900] border-t border-chadi-green/10 bg-white p-5 dark:bg-gray-900 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:p-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
          {t("common.cookieConsent.message")}{" "}
          <Link to="/privacy" className="font-semibold text-chadi-green underline dark:text-chadi-lightgreen">
            {t("common.cookieConsent.privacyLink")}
          </Link>{" "}
          {t("common.cookieConsent.messageEnd")}
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => respond("declined")}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 transition hover:border-gray-400"
          >
            {t("common.cookieConsent.decline")}
          </button>
          <button
            type="button"
            onClick={() => respond("accepted")}
            className="rounded-lg bg-chadi-green px-5 py-2 text-sm font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
          >
            {t("common.cookieConsent.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
