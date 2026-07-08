import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";

const resources = [
  {
    title: "Nutrition Awareness Guide",
    description:
      "Simple reminders for maternal, infant and young child nutrition sessions.",
  },
  {
    title: "Volunteer Field Checklist",
    description:
      "A quick planning checklist for outreach support and field engagement.",
  },
  {
    title: "Community Project Intake",
    description:
      "Guidance for communities and partners proposing a CHADI-supported project.",
  },
];

function Resources() {
  return (
    <>
      <PageHeader
        title="Resources"
        subtitle="Guides, checklists and helpful materials for CHADI programs."
      />

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          {resources.map((resource) => (
            <article
              key={resource.title}
              className="rounded-xl border border-chadi-lightgreen bg-chadi-cream p-8"
            >
              <h2 className="text-2xl font-bold text-chadi-green">
                {resource.title}
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                {resource.description}
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-block font-semibold text-chadi-green hover:text-chadi-gold"
              >
                Request Resource
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default Resources;
