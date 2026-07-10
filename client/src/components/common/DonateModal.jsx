import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { verifyPayment } from "../../services/api";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const PRESET_AMOUNTS = [2000, 5000, 10000, 25000];

function DonateModal({ open, onClose }) {
  const [amount, setAmount] = useState("5000");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);
  const [result, setResult] = useState(null);

  const configured = Boolean(PAYSTACK_PUBLIC_KEY) && typeof window !== "undefined" && window.PaystackPop;

  if (!open) return null;

  const handlePay = (event) => {
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
      metadata: { name },
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-chadi-ink/60 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-chadi-cream p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-chadi-ink/50 hover:text-chadi-ink"
          aria-label="Close"
        >
          <FaTimes size={18} />
        </button>

        <p className="font-serif text-xs uppercase tracking-[3px] text-chadi-green/70">
          CHADI International
        </p>
        <h3 className="mt-2 font-serif text-3xl text-chadi-ink">Give Today</h3>
        <p className="mt-2 text-sm text-chadi-ink/60">
          Secure checkout by card or bank transfer, powered by Paystack.
        </p>

        <form onSubmit={handlePay} className="mt-6 space-y-4">
          <input
            type="text"
            required
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-chadi-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-chadi-green"
          />
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-chadi-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-chadi-green"
          />
          <input
            type="number"
            min="100"
            step="100"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-lg border border-chadi-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-chadi-green"
          />

          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(String(preset))}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                  Number(amount) === preset
                    ? "border-chadi-green bg-chadi-green text-white"
                    : "border-chadi-ink/20 text-chadi-ink/70 hover:border-chadi-green"
                }`}
              >
                ₦{preset.toLocaleString()}
              </button>
            ))}
          </div>

          {!configured ? (
            <p className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800">
              Online payment isn't configured on this site yet. Please use the Contact page instead.
            </p>
          ) : (
            <button
              type="submit"
              disabled={paying}
              className="w-full rounded-lg bg-chadi-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-chadi-green disabled:opacity-60"
            >
              {paying ? "Processing..." : `Give ₦${Number(amount || 0).toLocaleString()}`}
            </button>
          )}

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
