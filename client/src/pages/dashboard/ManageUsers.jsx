import ResourceManager from "../../components/admin/ResourceManager";
import { usersApi } from "../../services/api";

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "role", label: "Role", type: "select", options: ["admin", "editor"] },
  {
    name: "password",
    label: "Password",
    type: "password",
    hint: "Required when creating a new user. Leave blank when editing to keep the current password.",
  },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
];

function ManageUsers() {
  return (
    <ResourceManager
      title="Admin Users"
      description="Manage who can log in to this dashboard."
      api={usersApi}
      fields={fields}
      columns={columns}
    />
  );
}

export default ManageUsers;
