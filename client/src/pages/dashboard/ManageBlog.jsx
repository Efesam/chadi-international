import ResourceManager from "../../components/admin/ResourceManager";
import { blogApi } from "../../services/api";

const CATEGORIES = [
  "Community Stories",
  "Health & Nutrition",
  "Education & Skills",
  "Women & Girls",
  "Poverty & Livelihood",
  "Climate & Environment",
  "Mental Health & Sickle Cell",
  "SORVCEST",
];

const CAMPAIGNS = ["STILLHERE Stories", "SORVCEST Stories"];

const fields = [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug", required: true, hint: "Used in the post's URL, e.g. a-mothers-second-chance" },
  { name: "image", label: "Cover Image", type: "image" },
  { name: "category", label: "Category", type: "select", options: CATEGORIES },
  {
    name: "campaign",
    label: "Campaign",
    type: "select",
    options: CAMPAIGNS,
    hint: "Optional - tags this post as part of a named campaign, shown on the post and filterable on the public Blog page.",
  },
  {
    name: "seoTopic",
    label: "SEO Topic",
    hint: 'A specific search topic this post targets, e.g. "Sickle cell prevention" or "Depression awareness" - used in the post\'s meta description, not shown to readers.',
  },
  { name: "author", label: "Author" },
  { name: "date", label: "Date", hint: "e.g. July 5, 2026" },
  { name: "featured", label: "Featured on homepage", type: "checkbox" },
  { name: "excerpt", label: "Excerpt", type: "textarea", fullWidth: true },
  { name: "content", label: "Full Post", type: "richtext" },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "campaign", label: "Campaign" },
  { key: "date", label: "Date" },
];

function buildBlogEmail(post) {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  return {
    subject: `New on the blog: ${post.title}`,
    heading: post.title,
    message: post.excerpt || `Read the latest from CHADI International: ${post.title}.`,
    ctaText: "Read Post",
    ctaUrl: `${siteUrl}/blog/${post.slug}`,
  };
}

function ManageBlog() {
  return (
    <ResourceManager
      title="Blog"
      description="Manage the stories shown on the public Blog page and featured on the homepage."
      api={blogApi}
      fields={fields}
      columns={columns}
      notify={buildBlogEmail}
    />
  );
}

export default ManageBlog;
