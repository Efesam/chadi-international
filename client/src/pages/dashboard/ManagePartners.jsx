import ResourceManager from "../../components/admin/ResourceManager";
import { partnersApi } from "../../services/api";

const fields = [
  { name: "name", label: "Partner Name", required: true },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: [
      "Community organization",
      "School or learning center",
      "Health institution",
      "Corporate sponsor",
      "Faith or civic group",
      "Research or innovation partner",
    ],
  },
  { name: "website", label: "Website URL" },
  { name: "logo", label: "Logo URL" },
  { name: "description", label: "Description", type: "textarea", fullWidth: true },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "website", label: "Website" },
];

function ManagePartners() {
  return (
    <ResourceManager
      title="Partners"
      description="Manage the partner organizations shown on the public Partners page."
      api={partnersApi}
      fields={fields}
      columns={columns}
      emptyMessage="No partners yet. Add your first partner organization."
    />
  );
}

export default ManagePartners;
