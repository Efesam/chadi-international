import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { recordDonationInterest, verifyPayment } from "../../services/api";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

function DonationForm() {
  const [amount, setAmount] = useState("5000");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);
  const [result, setResult] = useState(null);

  const configured = Boolean(PAYSTACK_PUBLIC_KEY) && typeof window !== "undefined" && window.PaystackPop;

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
      amount: Math.round(nairaAmount * 100), // Paystack expects the amount in kobo
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
    <form onSubmit={handlePay} className="rounded-3xl bg-white p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-chadi-green">Make a Donation</h3>
      <p className="mt-4 text-gray-600">
        Give securely by card or bank transfer via Paystack.
      </p>

      <label className="mt-6 block">
        <span className="text-sm font-semibold text-gray-700">Full name</span>
        <input
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-gray-700">Email address</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-gray-700">Amount (NGN)</span>
        <input
          type="number"
          min="100"
          step="100"
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {[2000, 5000, 10000, 25000].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(String(preset))}
            className="rounded-lg border border-chadi-green px-4 py-2 text-sm font-semibold text-chadi-green hover:bg-chadi-green hover:text-white"
          >
            ₦{preset.toLocaleString()}
          </button>
        ))}
      </div>

      {!configured ? (
        <p className="mt-6 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
          Online payment isn't configured on this site yet. Please use the "Other Ways to Give" form instead, or contact us directly.
        </p>
      ) : (
        <button
          type="submit"
          disabled={paying}
          className="mt-8 w-full rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
        >
          {paying ? "Processing..." : `Pay ₦${Number(amount || 0).toLocaleString()}`}
        </button>
      )}

      {result && (
        <p
          className={`mt-4 font-semibold ${
            result.type === "success" ? "text-chadi-green" : "text-red-600"
          }`}
        >
          {result.message}
        </p>
      )}
    </form>
  );
}

function InterestForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("Saving...");

    try {
      await recordDonationInterest(Object.fromEntries(formData.entries()));
      form.reset();
      setStatus("Thanks. CHADI will contact you with details.");
    } catch {
      setStatus("We could not save this right now. Please use the contact page.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-chadi-cream p-8 shadow-lg"
    >
      <h3 className="text-2xl font-bold text-chadi-green">Other Ways to Give</h3>
      <p className="mt-4 text-gray-600">
        Interested in monthly giving, corporate sponsorship or a program
        partnership? Share your details and CHADI will follow up.
      </p>

      <input
        className="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        name="name"
        placeholder="Full name"
        required
      />
      <input
        className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        name="email"
        type="email"
        placeholder="Email address"
        required
      />
      <select
        className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        name="interest"
        defaultValue=""
        required
      >
        <option value="" disabled>
          Donation interest
        </option>
        <option>Monthly support</option>
        <option>Corporate sponsorship</option>
        <option>Program partnership</option>
      </select>

      <button
        type="submit"
        className="mt-8 rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
      >
        Submit Interest
      </button>

      <Link
        to="/contact"
        className="ml-4 inline-block font-semibold text-chadi-green hover:text-chadi-gold"
      >
        Contact instead
      </Link>

      {status && (
        <p className="mt-4 font-semibold text-chadi-green">{status}</p>
      )}
    </form>
  );
}

function Donate() {
  return (
    <>
      <PageHeader
        title="Donate"
        subtitle="Support CHADI's work with underserved communities."
      />

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold text-chadi-green">
              Help Sustain Community Impact
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Your donation helps CHADI provide nutrition education, learning
              support, emergency relief, youth development and community
              wellbeing programs.
            </p>
          </div>

          <div className="space-y-8">
            <DonationForm />
            <InterestForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default Donate;
