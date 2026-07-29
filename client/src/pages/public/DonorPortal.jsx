import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Reveal from "../../components/common/Reveal";
import {
  getDonorToken,
  donorLogout,
  requestDonorLink,
  getDonorDonations,
  cancelDonorSubscription,
  downloadDonorReceipt,
} from "../../services/api";

const TYPE_LABELS = {
  payment: "One-Time Donation",
  subscription: "Hope Alive Circle (Monthly)",
};

function formatAmount(entry) {
  const amount = Number(entry.amount || 0).toLocaleString();
  if (entry.currency === "USD") return `$${amount}`;
  return `₦${amount}`;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await requestDonorLink(email);
      setSent(true);
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-chadi-cream p-8 text-center">
        <p className="font-semibold text-chadi-green">
          If that email has made a donation with us, we've sent a sign-in link to it.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Check your inbox (and spam folder) for a link from CHADI International. It expires in 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-chadi-cream p-8">
      <label className="block">
        <span className="text-sm font-semibold text-gray-700">Email address</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Email Me a Sign-In Link"}
      </button>
      <p className="text-center text-xs text-gray-500">
        Use the same email address you donated with. No password needed.
      </p>
    </form>
  );
}

function DonationRow({ entry, onCancelled }) {
  const [downloading, setDownloading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadDonorReceipt(entry.id, `CHADI-receipt-${entry.reference || entry.id}.pdf`);
    } catch (error) {
      toast.error(error.message || "Could not download receipt");
    } finally {
      setDownloading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this recurring donation? This can't be undone.")) return;
    setCancelling(true);
    try {
      await cancelDonorSubscription(entry.id);
      toast.success("Subscription cancelled");
      onCancelled(entry.id);
    } catch (error) {
      toast.error(error.message || "Could not cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = entry.type === "subscription" && entry.subscriptionStatus === "active";

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-4 pr-4 text-sm text-gray-600">
        {new Date(entry.createdAt).toLocaleDateString()}
      </td>
      <td className="py-4 pr-4 text-sm font-medium text-gray-900">
        {TYPE_LABELS[entry.type] || entry.type}
      </td>
      <td className="py-4 pr-4 text-sm font-semibold text-chadi-green">
        {formatAmount(entry)}
        {entry.type === "subscription" && "/mo"}
      </td>
      <td className="py-4 pr-4 text-sm">
        {entry.type === "subscription" ? (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              entry.subscriptionStatus === "active"
                ? "bg-green-100 text-green-700"
                : entry.subscriptionStatus === "cancelled"
                ? "bg-gray-100 text-gray-600"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {entry.subscriptionStatus === "active"
              ? "Active"
              : entry.subscriptionStatus === "cancelled"
              ? "Cancelled"
              : "Activating..."}
          </span>
        ) : (
          "—"
        )}
      </td>
      <td className="py-4 text-right text-sm">
        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="rounded-lg border border-chadi-green px-3 py-1.5 text-xs font-semibold text-chadi-green transition hover:bg-chadi-green hover:text-white disabled:opacity-60"
          >
            {downloading ? "Downloading..." : "Download Receipt"}
          </button>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              {cancelling ? "Cancelling..." : "Cancel"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function DonorDashboard({ onLogout }) {
  const [donations, setDonations] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDonorDonations()
      .then(setDonations)
      .catch((err) => setError(err.message || "Could not load your donation history"));
  }, []);

  const handleCancelled = (id) => {
    setDonations((prev) => prev.map((d) => (d.id === id ? { ...d, subscriptionStatus: "cancelled" } : d)));
  };

  const handleLogout = () => {
    donorLogout();
    onLogout();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-chadi-green">Your Giving History</h2>
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-gray-500 hover:text-chadi-green"
        >
          Sign out
        </button>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      {!error && donations === null && (
        <p className="text-sm text-gray-500">Loading your donations...</p>
      )}

      {!error && donations !== null && donations.length === 0 && (
        <div className="rounded-2xl bg-chadi-cream p-8 text-center text-sm text-gray-600">
          No donations found for this email yet.
        </div>
      )}

      {!error && donations !== null && donations.length > 0 && (
        <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((entry) => (
                <DonationRow key={entry.id} entry={entry} onCancelled={handleCancelled} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DonorPortal() {
  const [signedIn, setSignedIn] = useState(() => Boolean(getDonorToken()));

  return (
    <>
      <Seo
        title="Donor Portal"
        path="/donor-portal"
        description="Sign in to view your CHADI International donation history, download tax receipts, and manage recurring giving."
      />

      <PageHeader
        title="Donor Portal"
        subtitle="View your donation history, download receipts, and manage recurring giving."
      />

      <section className="bg-white py-16">
        <Reveal className="mx-auto max-w-3xl px-6">
          {signedIn ? (
            <DonorDashboard onLogout={() => setSignedIn(false)} />
          ) : (
            <LoginForm />
          )}
        </Reveal>
      </section>
    </>
  );
}

export default DonorPortal;
