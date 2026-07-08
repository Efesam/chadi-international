import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";

function Careers() {
  return (
    <>
      <PageHeader
        title="Careers"
        subtitle="Join a mission-driven team serving underserved communities."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-chadi-green">
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
        </div>
      </section>
    </>
  );
}

export default Careers;
