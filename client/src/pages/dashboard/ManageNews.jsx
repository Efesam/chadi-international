import ResourceManager from "../../components/admin/ResourceManager";
import { newsApi } from "../../services/api";

const fields = [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug", required: true, hint: "Used in the article URL" },
  { name: "category", label: "Category" },
  { name: "date", label: "Date", hint: "e.g. July 5, 2026" },
  { name: "author", label: "Author" },
  { name: "image", label: "Image", type: "image" },
  { name: "excerpt", label: "Excerpt", type: "textarea", fullWidth: true },
  { name: "content", label: "Full Article", type: "richtext" },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "date", label: "Date" },
];

function ManageNews() {
  return (
    <ResourceManager
      title="News"
      description="Manage news articles shown on the public News page."
      api={newsApi}
      fields={fields}
      columns={columns}
    />
  );
}

export default ManageNews;
