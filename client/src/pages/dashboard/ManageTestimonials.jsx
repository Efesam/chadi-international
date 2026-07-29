import ResourceManager from "../../components/admin/ResourceManager";
import { testimonialsApi } from "../../services/api";

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "location", label: "Location" },
  { name: "image", label: "Photo", type: "image", hint: "Leave blank to show initials" },
  { name: "quote", label: "Quote", type: "textarea", required: true, fullWidth: true },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "location", label: "Location" },
  { key: "quote", label: "Quote" },
];

function ManageTestimonials() {
  return (
    <ResourceManager
      title="Testimonials"
      description="Manage the quotes shown in the Success Stories section on the homepage."
      api={testimonialsApi}
      fields={fields}
      columns={columns}
      emptyMessage="No testimonials yet. Add your first quote."
    />
  );
}

export default ManageTestimonials;
