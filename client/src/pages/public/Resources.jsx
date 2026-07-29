import { Link } from "react-router-dom";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import Newsletter from "../../components/common/Newsletter";

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
      <Seo
        title="Resources"
        path="/resources"
        description="Guides, checklists and helpful materials from CHADI International's programs."
      />

      <PageHeader
        title="Resources"
        subtitle="Guides, checklists and helpful materials for CHADI programs."
      />

      <section className="bg-white py-20">
        <StaggerGrid className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <StaggerItem key={resource.title}>
              <article className="rounded-xl border border-chadi-lightgreen bg-chadi-cream p-8">
                <h2 className="text-2xl font-bold text-chadi-green">
                  {resource.title}
                </h2>
                <p className="mt-4 leading-7 text-gray-600">
                  {resource.description}
                </p>
                <Link
                  to="/contact"
                  className="mt-6 inline-block font-semibold text-chadi-green hover:text-chadi-gold-dark"
                >
                  Request Resource
                </Link>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <Newsletter />
    </>
  );
}

export default Resources;
