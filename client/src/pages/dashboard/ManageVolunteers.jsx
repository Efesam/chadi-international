import SubmissionManager from "../../components/admin/SubmissionManager";
import { volunteersApi } from "../../services/api";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "project",
    label: "Project",
    render: (item) => item.projectTitle || "General",
  },
  { key: "area", label: "Area of Interest" },
  {
    key: "createdAt",
    label: "Applied",
    render: (item) => new Date(item.createdAt).toLocaleDateString(),
  },
];

function ManageVolunteers() {
  return (
    <SubmissionManager
      title="Volunteer Applications"
      description="Applications submitted through the public Volunteer page."
      api={volunteersApi}
      columns={columns}
      emptyMessage="No volunteer applications yet."
    />
  );
}

export default ManageVolunteers;
