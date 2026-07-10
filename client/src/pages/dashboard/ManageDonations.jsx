import SubmissionManager from "../../components/admin/SubmissionManager";
import { donationsApi } from "../../services/api";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "type",
    label: "Type",
    render: (item) => (item.type === "payment" ? "Paid Donation" : "Interest Only"),
  },
  {
    key: "detail",
    label: "Amount / Interest",
    render: (item) =>
      item.type === "payment"
        ? `₦${Number(item.amount || 0).toLocaleString()} (${item.channel || "card"})`
        : item.interest,
  },
  {
    key: "createdAt",
    label: "Date",
    render: (item) => new Date(item.createdAt).toLocaleDateString(),
  },
];

function ManageDonations() {
  return (
    <SubmissionManager
      title="Donations"
      description="Paid donations (verified via Paystack) and donation interest submitted through the Donate page."
      api={donationsApi}
      columns={columns}
      emptyMessage="No donations or donation interest submitted yet."
    />
  );
}

export default ManageDonations;
