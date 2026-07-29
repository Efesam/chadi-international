import ResourceManager from "../../components/admin/ResourceManager";
import { teamApi } from "../../services/api";

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "role", label: "Role", required: true },
  { name: "department", label: "Department", hint: "Team members are grouped by department on the public Team page" },
  { name: "email", label: "Email", type: "email" },
  { name: "linkedin", label: "LinkedIn URL" },
  { name: "twitter", label: "Twitter / X URL" },
  { name: "image", label: "Photo", type: "image", hint: "Leave blank to show initials" },
  {
    name: "featured",
    label: "Featured leadership",
    type: "checkbox",
    hint: "Shown in the spotlight band at the top of the Team page",
  },
  { name: "bio", label: "Bio", type: "textarea", fullWidth: true },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
];

function ManageTeam() {
  return (
    <ResourceManager
      title="Team"
      description="Manage the team members shown on the Team page."
      api={teamApi}
      fields={fields}
      columns={columns}
    />
  );
}

export default ManageTeam;
