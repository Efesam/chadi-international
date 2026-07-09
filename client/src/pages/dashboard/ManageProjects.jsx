import ResourceManager from "../../components/admin/ResourceManager";
import { projectsApi } from "../../services/api";

const fields = [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug", required: true, hint: "Used in the project URL, e.g. community-miycn" },
  { name: "image", label: "Image URL", hint: "e.g. /uploads/projects/miycn.jpg" },
  { name: "program", label: "Program" },
  { name: "location", label: "Location" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Ongoing", "Completed"],
  },
  { name: "beneficiaries", label: "Beneficiaries" },
  { name: "featured", label: "Featured on homepage", type: "checkbox" },
  { name: "summary", label: "Summary", type: "textarea", fullWidth: true },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "program", label: "Program" },
  { key: "location", label: "Location" },
  { key: "status", label: "Status" },
];

function ManageProjects() {
  return (
    <ResourceManager
      title="Projects"
      description="Manage the projects shown on the public Projects and Gallery pages."
      api={projectsApi}
      fields={fields}
      columns={columns}
    />
  );
}

export default ManageProjects;
