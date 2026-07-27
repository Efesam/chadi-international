import { useState } from "react";
import toast from "react-hot-toast";
import SubmissionManager from "../../components/admin/SubmissionManager";
import { donationsApi, cancelSubscription } from "../../services/api";

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
    render: (item) =>
      item.type === "subscription" ? (
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
      ) : (
        "—"
      ),
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

function ManageDonations() {
  return (
    <SubmissionManager
      title="Donations"
      description="Paid donations (verified via Paystack), Hope Alive Circle monthly subscriptions, and donation interest submitted through the Donate page."
      api={donationsApi}
      columns={columns}
      emptyMessage="No donations or donation interest submitted yet."
      renderDetailFooter={(item, onUpdated) => <CancelSubscriptionButton item={item} onUpdated={onUpdated} />}
    />
  );
}

export default ManageDonations;
