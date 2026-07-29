import { useState } from "react";
import { FaHandsHelping } from "react-icons/fa";
import { submitVolunteerApplication } from "../../services/api";
import Modal from "./Modal";
import Honeypot from "./Honeypot";

function VolunteerModal({ open, onClose, project }) {
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
        message: "Thank you! CHADI will reach out about volunteering for this project.",
      });
      setName("");
      setEmail("");
      setLocation("");
      setMessage("");
      setHpField("");
    } catch {
      setResult({ type: "error", message: "We could not submit this right now. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="volunteer-modal-title">
        <p className="text-xs font-bold uppercase tracking-[3px] text-chadi-gold-dark">
          CHADI International
        </p>
        <h3 id="volunteer-modal-title" className="mt-2 text-3xl font-bold text-chadi-green">
          Volunteer
        </h3>
        {project?.title ? (
          <p className="mt-2 text-sm text-gray-600">
            For: <span className="font-semibold text-chadi-green">{project.title}</span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            Tell us a bit about yourself and how you'd like to help.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Honeypot value={hpField} onChange={(event) => setHpField(event.target.value)} />
          <input
            type="text"
            required
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
          />
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
          />
          <input
            type="text"
            placeholder="State / location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
          />
          <textarea
            placeholder="Anything you'd like us to know? (optional)"
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
            {submitting ? "Submitting..." : "Sign Up to Volunteer"}
          </button>

          {result && (
            <p
              className={`text-sm font-semibold ${
                result.type === "success" ? "text-chadi-green" : "text-red-600"
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
