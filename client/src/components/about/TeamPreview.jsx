import { Link } from "react-router-dom";

function TeamPreview() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-5xl font-bold text-chadi-green">
          Meet Our Leadership
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-gray-600">
          Behind every successful community transformation is a passionate team
          committed to creating lasting impact.
        </p>

        <Link
          to="/team"
          className="mt-10 inline-block rounded-xl bg-chadi-green px-8 py-4 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
        >
          Meet the Team
        </Link>
      </div>
    </section>
  );
}

export default TeamPreview;
