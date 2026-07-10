import { useCollection } from "../../hooks/useCollection";
import { projectsApi } from "../../services/api";
import ProjectCard from "../ui/ProjectCard";

function FeaturedProjects() {
  const { data, loading } = useCollection(projectsApi.list);
  const featured = (data || []).filter((project) => project.featured);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[4px] text-chadi-green">
            Our Projects
          </p>

          <h2 className="mt-5 text-4xl leading-tight text-chadi-ink sm:text-5xl">
            Creating sustainable impact
          </h2>

          <p className="mt-6 text-lg leading-8 text-chadi-ink/60">
            Through practical programs and strategic partnerships, CHADI is
            transforming lives across underserved communities.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-chadi-ink/50">Loading projects...</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProjects;
