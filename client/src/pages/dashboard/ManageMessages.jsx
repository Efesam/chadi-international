import SubmissionManager from "../../components/admin/SubmissionManager";
import { messagesApi } from "../../services/api";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "subject", label: "Subject" },
  {
    key: "createdAt",
    label: "Received",
    render: (item) => new Date(item.createdAt).toLocaleDateString(),
  },
];

function ManageMessages() {
  return (
    <SubmissionManager
      title="Contact Messages"
      description="Messages submitted through the public Contact form."
      api={messagesApi}
      columns={columns}
      emptyMessage="No messages yet."
    />
  );
}

export default ManageMessages;
