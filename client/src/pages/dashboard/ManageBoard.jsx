import ResourceManager from "../../components/admin/ResourceManager";
import { boardApi } from "../../services/api";

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "role", label: "Role", required: true, hint: "e.g. Board Chair, Trustee" },
  { name: "image", label: "Photo", type: "image", hint: "Leave blank to show initials" },
  { name: "bio", label: "Bio", type: "textarea", fullWidth: true },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
];

function ManageBoard() {
  return (
    <ResourceManager
      title="Board of Directors"
      description="Manage the board/trustee members shown on the public Governance page."
      api={boardApi}
      fields={fields}
      columns={columns}
      emptyMessage="No board members added yet."
    />
  );
}

export default ManageBoard;
