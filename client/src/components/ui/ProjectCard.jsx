import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block overflow-hidden border border-chadi-ink/10 bg-white transition hover:border-chadi-green"
    >
      <div className="relative h-56 overflow-hidden bg-chadi-ink/5">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-6">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
          <span className="text-chadi-green">{project.program}</span>
          <span className="text-chadi-ink/40">{project.location}</span>
        </div>

        <h3 className="font-serif text-2xl text-chadi-ink">{project.title}</h3>

        <p className="leading-6 text-chadi-ink/60">{project.summary}</p>

        <div className="flex items-center justify-between border-t border-chadi-ink/10 pt-4 text-sm">
          <span className="text-chadi-ink/50">{project.status}</span>
          <span className="font-semibold text-chadi-ink">
            {project.beneficiaries}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
