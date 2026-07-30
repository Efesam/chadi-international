import { Link } from "react-router-dom";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import volunteerImage from "../../assets/projects/green-africa.jpg";
import partnerImage from "../../assets/projects/clean-water.jpg";
import donateImage from "../../assets/projects/maternal-health.jpg";
import Newsletter from "../../components/common/Newsletter";

const opportunities = [
  {
    title: "Volunteer",
    image: volunteerImage,
    description:
      "Contribute your time, skills and field support to community programs.",
    action: "Start Volunteering",
    path: "/volunteer",
  },
  {
    title: "Partner With Us",
    image: partnerImage,
    description:
      "Collaborate on projects that improve education, health and livelihoods.",
    action: "Discuss Partnership",
    path: "/contact",
  },
  {
    title: "Donate",
    image: donateImage,
    description:
      "Support program delivery for children, women, youth and vulnerable families.",
    action: "Make a Donation",
    path: "/donate",
  },
];

function GetInvolved() {
  return (
    <>
      <Seo
        title="Get Involved"
        path="/get-involved"
        description="Discover ways to volunteer, partner with, or donate to CHADI International and help create lasting community impact."
      />

      <PageHeader
        title="Get Involved"
        subtitle="Join CHADI in creating practical, sustainable community impact."
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          <StaggerGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((item) => (
              <StaggerItem key={item.title}>
                <div className="overflow-hidden rounded-3xl bg-chadi-cream shadow-lg">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-8">
                    <h2 className="text-3xl font-bold text-chadi-green">
                      {item.title}
                    </h2>
                    <p className="mt-5 leading-7 text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                    <Link
                      to={item.path}
                      className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
                    >
                      {item.action}
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default GetInvolved;
