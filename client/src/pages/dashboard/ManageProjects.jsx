import { useEffect, useMemo, useState } from "react";
import ResourceManager from "../../components/admin/ResourceManager";
import { projectsApi, getProjectDonationSummaries } from "../../services/api";

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
  {
    name: "budget",
    label: "Fundraising Goal (NGN)",
    type: "number",
    hint: "Optional target amount for this project. Shown publicly as a progress bar against funds raised.",
  },
  { name: "summary", label: "Summary", type: "textarea", fullWidth: true },
  {
    name: "donationLetter",
    label: "Donation Letter",
    type: "textarea",
    fullWidth: true,
    hint: 'The personal thank-you message on a receipt when someone donates to this specific project - separate paragraphs with a blank line, and use {name}, {title}, {location} and {beneficiaries} as placeholders. Left blank, a letter built from this project\'s Summary/Beneficiaries/Location above is used instead.',
  },
  {
    name: "media",
    label: "Media Gallery",
    type: "repeater",
    itemLabel: "Photo or Video",
    hint: "Add as many photos or videos as you like - shown in a gallery on the project's page.",
    itemFields: [
      { name: "url", label: "File", type: "media" },
      { name: "type", label: "Type (auto-detected on upload; set manually if pasting a URL)", type: "select", options: ["image", "video"] },
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

const baseColumns = [
  { key: "title", label: "Title" },
  { key: "program", label: "Program" },
  { key: "location", label: "Location" },
  { key: "status", label: "Status" },
];

const currency = (value) => `₦${Number(value || 0).toLocaleString()}`;

function buildProjectEmail(project) {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  return {
    subject: `New update: ${project.title}`,
    heading: project.title,
    message: project.summary || `See the latest on CHADI International's ${project.title} project.`,
    ctaText: "View Project",
    ctaUrl: `${siteUrl}/projects/${project.slug}`,
  };
}

function ManageProjects() {
  // Fetched once up front (rather than per-row) so the Raised column doesn't
  // fire one request per project - see GET /payments/project-summaries.
  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    getProjectDonationSummaries()
      .then(setSummaries)
      .catch(() => {});
  }, []);

  const columns = useMemo(
    () => [
      ...baseColumns,
      { key: "budget", label: "Goal", render: (item) => (item.budget ? currency(item.budget) : "—") },
      {
        key: "raised",
        label: "Raised",
        render: (item) => currency(summaries[item.id]?.totalRaised),
      },
      {
        key: "spent",
        label: "Spent",
        render: (item) => currency((item.spending || []).reduce((sum, entry) => sum + Number(entry.amount || 0), 0)),
      },
    ],
    [summaries]
  );

  return (
    <ResourceManager
      title="Projects"
      description="Manage the projects shown on the public Projects and Gallery pages."
      api={projectsApi}
      fields={fields}
      columns={columns}
      notify={buildProjectEmail}
    />
  );
}

export default ManageProjects;
