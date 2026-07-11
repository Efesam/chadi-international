import ResourceManager from "../../components/admin/ResourceManager";
import { programsApi } from "../../services/api";

const fields = [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug", required: true, hint: "Used in the program URL, e.g. miycn" },
  { name: "category", label: "Category" },
  { name: "icon", label: "Icon (emoji)", hint: "e.g. ❤️" },
  { name: "description", label: "Description", type: "textarea", fullWidth: true },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
];

function ManagePrograms() {
  return (
    <ResourceManager
      title="Programs"
      description="Manage the flagship programs shown on the public Programs page."
      api={programsApi}
      fields={fields}
      columns={columns}
    />
  );
}

export default ManagePrograms;
