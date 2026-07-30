import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHandsHelping } from "react-icons/fa";
import { submitVolunteerApplication } from "../../services/api";
import Modal from "./Modal";
import Honeypot from "./Honeypot";

function VolunteerModal({ open, onClose, project }) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [hpField, setHpField] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      await submitVolunteerApplication({
        name,
        email,
        location,
        area: project?.title ? `Project support - ${project.title}` : "Project support",
        message,
        projectId: project?.id,
        projectTitle: project?.title,
        hp_field: hpField,
      });
      setResult({
        type: "success",
        message: t("common.volunteerModal.successMessage"),
      });
      setName("");
      setEmail("");
      setLocation("");
      setMessage("");
      setHpField("");
    } catch {
      setResult({ type: "error", message: t("common.volunteerModal.errorMessage") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="volunteer-modal-title">
        <p className="text-xs font-bold uppercase tracking-[3px] text-chadi-gold-dark dark:text-chadi-gold">
          CHADI International
        </p>
        <h3 id="volunteer-modal-title" className="mt-2 text-3xl font-bold text-chadi-green dark:text-chadi-lightgreen">
          {t("common.volunteerModal.title")}
        </h3>
        {project?.title ? (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {t("common.volunteerModal.forLabel")} <span className="font-semibold text-chadi-green dark:text-chadi-lightgreen">{project.title}</span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {t("common.volunteerModal.genericSubtitle")}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Honeypot value={hpField} onChange={(event) => setHpField(event.target.value)} />
          <input
            type="text"
            required
            placeholder={t("common.volunteerModal.namePlaceholder")}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
          />
          <input
            type="email"
            required
            placeholder={t("common.volunteerModal.emailPlaceholder")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
          />
          <input
            type="text"
            placeholder={t("common.volunteerModal.locationPlaceholder")}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
          />
          <textarea
            placeholder={t("common.volunteerModal.messagePlaceholder")}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-20 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
          />

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-chadi-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
          >
            <FaHandsHelping />
            {submitting ? t("common.volunteerModal.submitting") : t("common.volunteerModal.submit")}
          </button>

          {result && (
            <p
              className={`text-sm font-semibold ${
                result.type === "success" ? "text-chadi-green dark:text-chadi-lightgreen" : "text-red-600"
              }`}
            >
              {result.message}
            </p>
          )}
        </form>
    </Modal>
  );
}

export default VolunteerModal;
