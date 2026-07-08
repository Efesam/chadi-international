import { Link } from "react-router-dom";

function ProgramCard({ program }) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl">
      <div className="text-5xl">
        {program.icon}
      </div>

      <h3 className="mt-6 text-2xl font-bold text-chadi-green">
        {program.title}
      </h3>

      <p className="mt-2 font-semibold text-chadi-gold">
        {program.category}
      </p>

      <p className="mt-5 text-gray-600">
        {program.description}
      </p>

      <Link
        to={`/programs/${program.slug}`}
        className="mt-6 inline-block font-semibold text-chadi-green hover:text-chadi-gold"
      >
        Learn More →
      </Link>
    </div>
  );
}

export default ProgramCard;
