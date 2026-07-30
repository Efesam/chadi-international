import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { subscribeToNewsletter } from "../../services/api";
import Modal from "./Modal";
import Honeypot from "./Honeypot";

const SESSION_KEY = "chadi_exit_intent_shown";
const ARM_DELAY_MS = 8000; // don't trigger in the first few seconds of a visit

/**
 * Shows once per browser session, the first time the mouse leaves toward
 * the top of the viewport (the standard "about to close the tab/go back"
 * signal on desktop) - not a signal touch devices produce, so this is
 * effectively desktop-only, which is fine for what it's for.
 */
function ExitIntentPopup() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [hpField, setHpField] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return undefined;

    let armed = false;
    const armTimer = setTimeout(() => {
      armed = true;
    }, ARM_DELAY_MS);

    const handleMouseLeave = (event) => {
      if (!armed || event.clientY > 0) return;
      sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(true);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(armTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await subscribeToNewsletter({ email, hp_field: hpField });
      toast.success(t("common.exitIntent.successToast"));
      setOpen(false);
    } catch {
      toast.error(t("common.exitIntent.errorToast"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)} labelledBy="exit-intent-title">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-chadi-lightgreen text-chadi-green">
          <FaEnvelopeOpenText size={22} />
        </span>
        <h3 id="exit-intent-title" className="mt-4 text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
          {t("common.exitIntent.title")}
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {t("common.exitIntent.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <Honeypot value={hpField} onChange={(event) => setHpField(event.target.value)} />
          <input
            type="email"
            required
            placeholder={t("common.exitIntent.emailPlaceholder")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-chadi-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
          >
            {submitting ? t("common.exitIntent.subscribing") : t("common.exitIntent.keepMeUpdated")}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full text-sm font-semibold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-300"
          >
            {t("common.exitIntent.noThanks")}
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default ExitIntentPopup;
