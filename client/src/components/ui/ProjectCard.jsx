import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image */}
      <div className="relative h-60 overflow-hidden bg-gray-200">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <span className="absolute left-5 top-5 rounded-full bg-chadi-green px-4 py-2 text-sm font-semibold text-white">
          {project.program}
        </span>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-chadi-lightgreen px-3 py-1 text-sm font-semibold text-chadi-green">
            {project.status}
          </span>

          <span className="text-sm text-gray-500">
            {project.location}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-chadi-green">
          {project.title}
        </h3>

        <p className="text-gray-600">
          {project.summary}
        </p>

        <div className="pt-2">
          <p className="text-sm text-gray-500">
            Beneficiaries
          </p>

          <p className="font-semibold">
            {project.beneficiaries}
          </p>
        </div>

        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex font-semibold text-chadi-green hover:text-chadi-gold"
        >
          Learn More →
        </Link>
      </div>
    </div>
  );
}

export default ProjectCard;
