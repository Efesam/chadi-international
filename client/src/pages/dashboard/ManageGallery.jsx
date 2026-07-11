import ResourceManager from "../../components/admin/ResourceManager";
import { galleryApi } from "../../services/api";

const fields = [
  { name: "title", label: "Title", required: true },
  { name: "image", label: "Image", type: "image", required: true },
  { name: "category", label: "Category", hint: "e.g. Health, Education, Events" },
];

const columns = [
  {
    key: "image",
    label: "Preview",
    render: (item) =>
      item.image ? (
        <img src={item.image} alt={item.title} className="h-12 w-16 rounded object-cover" />
      ) : (
        "—"
      ),
  },
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
];

function ManageGallery() {
  return (
    <ResourceManager
      title="Gallery"
      description="Manage the photos shown on the public Gallery page."
      api={galleryApi}
      fields={fields}
      columns={columns}
      emptyMessage="No gallery photos yet. Add your first one to get started."
    />
  );
}

export default ManageGallery;
