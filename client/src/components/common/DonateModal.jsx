import { useState } from "react";
import { FaTimes, FaShieldAlt } from "react-icons/fa";
import { verifyPayment, recordDonationInterest } from "../../services/api";
import { useModalA11y } from "../../hooks/useModalA11y";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const PRESET_AMOUNTS = [
  { amount: 2000, label: "Provides a nutrition kit" },
  { amount: 5000, label: "Supports a health outreach" },
  { amount: 10000, label: "Trains a child in a new skill" },
  { amount: 25000, label: "Supports a family for a month" },
];

function DonateModal({ open, onClose, project }) {
  const [frequency, setFrequency] = useState("once");
  const [amount, setAmount] = useState("5000");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);
  const [result, setResult] = useState(null);

  // Called unconditionally (hooks can't follow an early return) - it's a
  // no-op internally whenever `open` is false.
  const containerRef = useModalA11y(open, onClose);

  const configured = Boolean(PAYSTACK_PUBLIC_KEY) && typeof window !== "undefined" && window.PaystackPop;

  if (!open) return null;

  const activeLabel = PRESET_AMOUNTS.find((p) => p.amount === Number(amount))?.label;

  const handlePayOnce = (event) => {
    event.preventDefault();

    const nairaAmount = Number(amount);
    if (!nairaAmount || nairaAmount < 100) {
      setResult({ type: "error", message: "Please enter an amount of at least ₦100." });
      return;
    }

    setPaying(true);
    setResult(null);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: Math.round(nairaAmount * 100),
      currency: "NGN",
      metadata: { name, projectId: project?.id, projectTitle: project?.title },
      callback: (response) => {
        verifyPayment(response.reference)
          .then((data) => {
            setResult({
              type: "success",
              message: `Thank you! Your donation of ₦${data.amount.toLocaleString()} was received.`,
            });
          })
          .catch(() => {
            setResult({
              type: "error",
              message:
                "Payment went through but we could not confirm it automatically. Please contact us with your reference: " +
                response.reference,
            });
          })
          .finally(() => setPaying(false));
      },
      onClose: () => setPaying(false),
    });

    handler.openIframe();
  };

  // Recurring billing isn't wired up to Paystack subscriptions yet, so a
  // "monthly" pledge is recorded as interest for CHADI's team to follow up
  // on directly, rather than silently charging a one-time payment and
  // calling it recurring.
  const handleJoinMonthly = async (event) => {
    event.preventDefault();
    setPaying(true);
    setResult(null);

    try {
      await recordDonationInterest({
        name,
        email,
        interest: `Hope Alive Circle - Monthly ₦${Number(amount).toLocaleString()}`,
        projectId: project?.id,
        projectTitle: project?.title,
      });
      setResult({
        type: "success",
        message: "Thank you for joining Hope Alive Circle! CHADI will reach out to set up your monthly giving.",
      });
    } catch {
      setResult({ type: "error", message: "We could not save this right now. Please try again." });
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="donate-modal-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes size={18} />
        </button>

        <p className="text-xs font-bold uppercase tracking-[3px] text-chadi-gold">
          CHADI International
        </p>
        <h3 id="donate-modal-title" className="mt-2 text-3xl font-bold text-chadi-green">
          Give Today
        </h3>
        {project?.title ? (
          <p className="mt-2 text-sm text-gray-600">
            Supporting: <span className="font-semibold text-chadi-green">{project.title}</span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            You're not just giving money &mdash; you're giving hope, dignity and a second chance.
          </p>
        )}

        <div className="mt-5 flex rounded-lg bg-gray-100 p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setFrequency("once")}
            className={`flex-1 rounded-md py-2 transition ${
              frequency === "once" ? "bg-white text-chadi-green shadow-sm" : "text-gray-500"
            }`}
          >
            One-time
          </button>
          <button
            type="button"
            onClick={() => setFrequency("monthly")}
            className={`flex-1 rounded-md py-2 transition ${
              frequency === "monthly" ? "bg-white text-chadi-green shadow-sm" : "text-gray-500"
            }`}
          >
            Monthly &mdash; Hope Alive Circle
          </button>
        </div>

        <form onSubmit={frequency === "once" ? handlePayOnce : handleJoinMonthly} className="mt-5 space-y-4">
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
            type="number"
            min="100"
            step="100"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-chadi-green"
          />

          <div className="grid grid-cols-2 gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset.amount}
                type="button"
                onClick={() => setAmount(String(preset.amount))}
                className={`rounded-lg border px-3 py-2 text-left transition ${
                  Number(amount) === preset.amount
                    ? "border-chadi-green bg-chadi-green/5"
                    : "border-gray-200 hover:border-chadi-green"
                }`}
              >
                <span className="block text-sm font-bold text-chadi-green">
                  ₦{preset.amount.toLocaleString()}
                </span>
                <span className="block text-[11px] leading-tight text-gray-500">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>

          {activeLabel && (
            <p className="text-xs font-semibold text-chadi-green">{activeLabel}</p>
          )}

          {frequency === "once" && !configured ? (
            <p className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800">
              Online payment isn't configured on this site yet. Please use the Contact page instead.
            </p>
          ) : (
            <button
              type="submit"
              disabled={paying}
              className="w-full rounded-lg bg-chadi-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
            >
              {paying
                ? "Processing..."
                : frequency === "once"
                ? `Give ₦${Number(amount || 0).toLocaleString()}`
                : "Join Hope Alive Circle"}
            </button>
          )}

          <p className="flex items-center justify-center gap-2 text-center text-xs text-gray-400">
            <FaShieldAlt /> Secured by Paystack &middot; join our community of CHADI supporters
          </p>

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
      </div>
    </div>
  );
}

export default DonateModal;
