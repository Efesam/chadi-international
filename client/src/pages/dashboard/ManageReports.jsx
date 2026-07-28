import ResourceManager from "../../components/admin/ResourceManager";
import { reportsApi } from "../../services/api";

const fields = [
  { name: "title", label: "Title", required: true, hint: "e.g. 2025 Annual Report" },
  { name: "year", label: "Year" },
  { name: "file", label: "Report File (PDF)", type: "file", required: true },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "year", label: "Year" },
];

function ManageReports() {
  return (
    <ResourceManager
      title="Reports"
      description="Upload annual reports and financial statements shown as downloads on the Transparency page."
      api={reportsApi}
      fields={fields}
      columns={columns}
      emptyMessage="No reports uploaded yet."
    />
  );
}

export default ManageReports;
