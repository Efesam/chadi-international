import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCalendarCheck } from "react-icons/fa";
import { submitEventSignup } from "../../services/api";
import Modal from "./Modal";
import Honeypot from "./Honeypot";

function EventSignupModal({ open, onClose, event }) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hpField, setHpField] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (formEvent) => {
    formEvent.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      await submitEventSignup({
        name,
        email,
        eventId: event?.id,
        eventTitle: event?.title,
        hp_field: hpField,
      });
      setResult({ type: "success", message: t("common.eventSignupModal.successMessage") });
      setName("");
      setEmail("");
      setHpField("");
    } catch {
      setResult({ type: "error", message: t("common.eventSignupModal.errorMessage") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="event-signup-modal-title">
      <p className="text-xs font-bold uppercase tracking-[3px] text-chadi-gold-dark dark:text-chadi-gold">CHADI International</p>
      <h3 id="event-signup-modal-title" className="mt-2 text-3xl font-bold text-chadi-green dark:text-chadi-lightgreen">
        {t("common.eventSignupModal.title")}
      </h3>
      {event?.title && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {t("common.eventSignupModal.forLabel")} <span className="font-semibold text-chadi-green dark:text-chadi-lightgreen">{event.title}</span>
          {event.date && <span className="text-gray-500 dark:text-gray-400"> &middot; {event.date}</span>}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Honeypot value={hpField} onChange={(evt) => setHpField(evt.target.value)} />
        <input
          type="text"
          required
          placeholder={t("common.eventSignupModal.namePlaceholder")}
          value={name}
          onChange={(evt) => setName(evt.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
        />
        <input
          type="email"
          required
          placeholder={t("common.eventSignupModal.emailPlaceholder")}
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
        />

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-chadi-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
        >
          <FaCalendarCheck />
          {submitting ? t("common.eventSignupModal.signingUp") : t("common.eventSignupModal.confirmSignUp")}
        </button>

        {result && (
          <p className={`text-sm font-semibold ${result.type === "success" ? "text-chadi-green dark:text-chadi-lightgreen" : "text-red-600"}`}>
            {result.message}
          </p>
        )}
      </form>
    </Modal>
  );
}

export default EventSignupModal;
