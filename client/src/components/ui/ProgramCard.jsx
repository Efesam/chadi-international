import { Link } from "react-router-dom";

function ProgramCard({ program }) {
  const Icon = program.icon;

  return (
    <div className="group overflow-hidden rounded-3xl border bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className={`h-3 ${program.color}`}></div>

      <div className="p-8">

        <div className={`mb-6 inline-flex rounded-2xl p-4 ${program.color}`}>
          <Icon className="text-3xl text-chadi-green" />
        </div>

        <h3 className="mb-4 text-2xl font-bold text-gray-900">
          {program.title}
        </h3>

        <p className="mb-6 text-gray-600 leading-7">
          {program.description}
        </p>

        <span className="inline-block rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
          {program.beneficiaries}
        </span>

        <Link
          to={`/programs/${program.slug}`}
          className="mt-8 inline-flex font-semibold text-chadi-green hover:text-chadi-gold"
        >
          Learn More →
        </Link>

      </div>
    </div>
  );
}

export default ProgramCard;