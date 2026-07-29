import SubmissionManager from "../../components/admin/SubmissionManager";
import { paymentIssuesApi } from "../../services/api";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "amount",
    label: "Amount",
    render: (item) => (item.amount ? `₦${Number(item.amount).toLocaleString()}${item.frequency === "monthly" ? "/mo" : ""}` : "—"),
  },
  { key: "reference", label: "Reference" },
  {
    key: "createdAt",
    label: "Reported",
    render: (item) => new Date(item.createdAt).toLocaleString(),
  },
];

function ManagePaymentIssues() {
  return (
    <SubmissionManager
      title="Payment Issues"
      description="Payments that went through on Paystack's side but the server could not confirm automatically - the donor was charged, but the donation needs manual follow-up (check the reference in your Paystack dashboard, or use Donations -> Reconcile with Paystack)."
      api={paymentIssuesApi}
      columns={columns}
      emptyMessage="No unconfirmed payments reported. That's a good sign."
    />
  );
}

export default ManagePaymentIssues;
