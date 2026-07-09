import ResourceManager from "../../components/admin/ResourceManager";
import { eventsApi } from "../../services/api";

const fields = [
  { name: "title", label: "Title", required: true },
  { name: "date", label: "Date", required: true, hint: "e.g. August 12, 2026" },
  { name: "location", label: "Location" },
  { name: "type", label: "Type", hint: "e.g. Health, Education, Volunteer" },
  { name: "description", label: "Description", type: "textarea", fullWidth: true },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "date", label: "Date" },
  { key: "location", label: "Location" },
  { key: "type", label: "Type" },
];

function ManageEvents() {
  return (
    <ResourceManager
      title="Events"
      description="Manage upcoming events shown on the homepage and Events page."
      api={eventsApi}
      fields={fields}
      columns={columns}
    />
  );
}

export default ManageEvents;
