import ResourceManager from "../../components/admin/ResourceManager";
import { storiesApi } from "../../services/api";

const fields = [
  { name: "title", label: "Title", required: true },
  { name: "personName", label: "Featured Person" },
  { name: "program", label: "Related Program" },
  { name: "image", label: "Image", type: "image" },
  { name: "excerpt", label: "Short Excerpt", type: "textarea" },
  { name: "content", label: "Full Story", type: "richtext" },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "personName", label: "Person" },
  { key: "program", label: "Program" },
];

function ManageStories() {
  return (
    <ResourceManager
      title="Stories"
      description="Manage success stories shown on the public Stories page."
      api={storiesApi}
      fields={fields}
      columns={columns}
      emptyMessage="No stories yet. Add your first success story."
    />
  );
}

export default ManageStories;
