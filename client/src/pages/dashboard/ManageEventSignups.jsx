import SubmissionManager from "../../components/admin/SubmissionManager";
import { eventSignupsApi } from "../../services/api";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "eventTitle", label: "Event" },
  {
    key: "createdAt",
    label: "Signed Up",
    render: (item) => new Date(item.createdAt).toLocaleDateString(),
  },
];

function ManageEventSignups() {
  return (
    <SubmissionManager
      title="Event Sign-Ups"
      description="Sign-ups submitted through event cards on the public Events page."
      api={eventSignupsApi}
      columns={columns}
      emptyMessage="No event sign-ups yet."
    />
  );
}

export default ManageEventSignups;
