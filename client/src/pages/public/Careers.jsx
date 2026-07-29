import { Link } from "react-router-dom";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Reveal from "../../components/common/Reveal";
import Newsletter from "../../components/common/Newsletter";
import careersImage from "../../assets/projects/school-support.jpg";

function Careers() {
  return (
    <>
      <Seo
        title="Careers"
        path="/careers"
        description="Explore opportunities to join CHADI International's mission-driven team serving underserved communities."
      />

      <PageHeader
        title="Careers"
        subtitle="Join a mission-driven team serving underserved communities."
      />

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <Reveal direction="left">
            <img
              src={careersImage}
              alt="CHADI team members working with a community"
              loading="lazy"
              className="rounded-3xl shadow-xl"
            />
          </Reveal>

          <Reveal direction="right" delay={0.15} className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-chadi-green sm:text-4xl">
              No open roles right now
            </h2>
            <p className="mt-6 leading-8 text-gray-600">
              CHADI posts opportunities for program, field, research, partnership
              and operations roles when positions become available. Volunteers and
              collaborators are always welcome to introduce themselves.
            </p>
            <Link
              to="/volunteer"
              className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white"
            >
              Volunteer With Us
            </Link>
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default Careers;
