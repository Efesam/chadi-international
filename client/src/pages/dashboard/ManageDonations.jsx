import { useState } from "react";
import toast from "react-hot-toast";
import SubmissionManager from "../../components/admin/SubmissionManager";
import {
  donationsApi,
  cancelSubscription,
  reconcilePayments,
  importReconciledPayment,
  refundDonation,
} from "../../services/api";

const TYPE_LABELS = {
  payment: "One-Time Donation",
  subscription: "Hope Alive Circle (Monthly)",
};

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "type",
    label: "Type",
    render: (item) => TYPE_LABELS[item.type] || "Interest Only",
  },
  {
    key: "detail",
    label: "Amount / Interest",
    render: (item) =>
      item.type === "payment" || item.type === "subscription"
        ? `₦${Number(item.amount || 0).toLocaleString()}${item.type === "subscription" ? "/mo" : ""} (${item.channel || "card"})`
        : item.interest,
  },
  {
    key: "status",
    label: "Status",
    render: (item) => {
      if (item.refunded) {
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Refunded</span>
        );
      }

      if (item.type !== "subscription") return "—";

      return (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            item.subscriptionStatus === "active"
              ? "bg-green-100 text-green-700"
              : item.subscriptionStatus === "cancelled"
              ? "bg-gray-100 text-gray-600"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {item.subscriptionStatus === "active"
            ? "Active"
            : item.subscriptionStatus === "cancelled"
            ? "Cancelled"
            : "Activating..."}
        </span>
      );
    },
  },
  {
    key: "project",
    label: "Project",
    render: (item) => item.projectTitle || "General",
  },
  {
    key: "createdAt",
    label: "Date",
    render: (item) => new Date(item.createdAt).toLocaleDateString(),
  },
];

function CancelSubscriptionButton({ item, onUpdated }) {
  const [cancelling, setCancelling] = useState(false);

  if (item.type !== "subscription" || item.subscriptionStatus === "cancelled") return null;

  const handleCancel = async () => {
    if (!window.confirm(`Cancel ${item.name}'s Hope Alive Circle subscription? This cannot be undone.`)) return;

    setCancelling(true);
    try {
      await cancelSubscription(item.id);
      onUpdated({ subscriptionStatus: "cancelled" });
      toast.success("Subscription cancelled");
    } catch (err) {
      toast.error(err.message || "Could not cancel this subscription");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={cancelling}
      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
    >
      {cancelling ? "Cancelling..." : "Cancel Subscription"}
    </button>
  );
}

function RefundButton({ item, onUpdated }) {
  const [refunding, setRefunding] = useState(false);

  if ((item.type !== "payment" && item.type !== "subscription") || item.refunded) return null;

  const handleRefund = async () => {
    if (
      !window.confirm(
        `Refund ${item.name}'s ₦${Number(item.amount || 0).toLocaleString()} donation via Paystack? This cannot be undone.`
      )
    ) {
      return;
    }

    setRefunding(true);
    try {
      await refundDonation(item.id);
      onUpdated({ refunded: true, refundedAt: new Date().toISOString() });
      toast.success("Refund issued");
    } catch (err) {
      toast.error(err.message || "Could not process this refund");
    } finally {
      setRefunding(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRefund}
      disabled={refunding}
      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
    >
      {refunding ? "Refunding..." : "Refund"}
    </button>
  );
}

/**
 * Cross-checks Paystack's own transaction list against local donations, for
 * catching anything the webhook and the donor's own browser both missed
 * (e.g. today's placeholder-secret-key incident, or a brief outage). Kept
 * collapsed by default since it round-trips to Paystack - staff open it when
 * they suspect something's missing rather than on every page load.
 */
function ReconcilePanel({ onImported }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(null);
  const [importingRef, setImportingRef] = useState(null);

  const handleCheck = async () => {
    setOpen(true);
    setLoading(true);
    setError("");

    try {
      const result = await reconcilePayments();
      setMissing(result.missing);
    } catch (err) {
      setError(err.message || "Could not reach Paystack");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (reference) => {
    setImportingRef(reference);
    try {
      await importReconciledPayment(reference);
      setMissing((prev) => prev.filter((txn) => txn.reference !== reference));
      toast.success("Imported");
      onImported();
    } catch (err) {
      toast.error(err.message || "Could not import this transaction");
    } finally {
      setImportingRef(null);
    }
  };

  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-chadi-green">Reconcile with Paystack</h2>
          <p className="mt-1 text-sm text-gray-500">
            Checks Paystack's own transaction list for anything successful there but missing from this list.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCheck}
          disabled={loading}
          className="rounded-lg bg-chadi-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check Paystack"}
        </button>
      </div>

      {open && (
        <div className="mt-5 border-t border-gray-100 pt-5">
          {loading ? (
            <p className="text-sm text-gray-500">Checking Paystack's transaction history...</p>
          ) : error ? (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          ) : missing?.length === 0 ? (
            <p className="text-sm font-semibold text-chadi-green">
              Nothing missing - every successful Paystack transaction is recorded here.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-yellow-700">
                {missing.length} transaction{missing.length === 1 ? "" : "s"} found on Paystack but not recorded here:
              </p>
              {missing.map((txn) => (
                <div
                  key={txn.reference}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-chadi-cream p-4"
                >
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">
                      {txn.currency === "USD" ? "$" : "₦"}
                      {Number(txn.amount || 0).toLocaleString()} &middot; {txn.email || "no email"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {txn.reference} &middot; {txn.channel} &middot; {new Date(txn.paidAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImport(txn.reference)}
                    disabled={importingRef === txn.reference}
                    className="rounded-lg bg-chadi-green px-4 py-2 text-xs font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
                  >
                    {importingRef === txn.reference ? "Importing..." : "Import"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ManageDonations() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <ReconcilePanel onImported={() => setRefreshKey((k) => k + 1)} />
      <SubmissionManager
        key={refreshKey}
        title="Donations"
        description="Paid donations (verified via Paystack), Hope Alive Circle monthly subscriptions, and donation interest submitted through the Donate page."
        api={donationsApi}
        columns={columns}
        emptyMessage="No donations or donation interest submitted yet."
        renderDetailFooter={(item, onUpdated) => (
          <div className="flex flex-wrap gap-3">
            <CancelSubscriptionButton item={item} onUpdated={onUpdated} />
            <RefundButton item={item} onUpdated={onUpdated} />
          </div>
        )}
      />
    </div>
  );
}

export default ManageDonations;
