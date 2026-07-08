import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";

const opportunities = [
  {
    title: "Volunteer",
    description:
      "Contribute your time, skills and field support to community programs.",
    action: "Start Volunteering",
    path: "/volunteer",
  },
  {
    title: "Partner With Us",
    description:
      "Collaborate on projects that improve education, health and livelihoods.",
    action: "Discuss Partnership",
    path: "/contact",
  },
  {
    title: "Donate",
    description:
      "Support program delivery for children, women, youth and vulnerable families.",
    action: "Make a Donation",
    path: "/donate",
  },
];

function GetInvolved() {
  return (
    <>
      <PageHeader
        title="Get Involved"
        subtitle="Join CHADI in creating practical, sustainable community impact."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {opportunities.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-chadi-cream p-8 shadow-lg"
              >
                <h2 className="text-3xl font-bold text-chadi-green">
                  {item.title}
                </h2>
                <p className="mt-5 leading-7 text-gray-600">
                  {item.description}
                </p>
                <Link
                  to={item.path}
                  className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
                >
                  {item.action}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default GetInvolved;
