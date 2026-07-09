import SubmissionManager from "../../components/admin/SubmissionManager";
import { donationsApi } from "../../services/api";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "interest", label: "Interest" },
  {
    key: "createdAt",
    label: "Submitted",
    render: (item) => new Date(item.createdAt).toLocaleDateString(),
  },
];

function ManageDonations() {
  return (
    <SubmissionManager
      title="Donation Interest"
      description="Donation interest submitted through the public Donate page."
      api={donationsApi}
      columns={columns}
      emptyMessage="No donation interest submitted yet."
    />
  );
}

export default ManageDonations;
