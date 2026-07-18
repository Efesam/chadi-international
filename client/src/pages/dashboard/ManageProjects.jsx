import ResourceManager from "../../components/admin/ResourceManager";
import { projectsApi } from "../../services/api";

const fields = [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug", required: true, hint: "Used in the project URL, e.g. community-miycn" },
  { name: "image", label: "Cover Image", type: "image" },
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
  {
    name: "media",
    label: "Media Gallery",
    type: "repeater",
    itemLabel: "Photo or Video",
    hint: "Add as many photos or videos as you like - shown in a gallery on the project's page.",
    itemFields: [
      { name: "type", label: "Type", type: "select", options: ["image", "video"] },
      { name: "url", label: "File", type: "media" },
      { name: "caption", label: "Caption" },
    ],
  },
  {
    name: "spending",
    label: "Spending Log",
    type: "repeater",
    itemLabel: "Expense",
    hint: "Records how funds raised for this project have been spent - shown publicly for transparency.",
    itemFields: [
      { name: "date", label: "Date", type: "date" },
      { name: "description", label: "Description" },
      { name: "amount", label: "Amount (NGN)", type: "number" },
    ],
  },
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
