import { useCollection } from "../../hooks/useCollection";
import { projectsApi } from "../../services/api";
import ProjectCard from "../ui/ProjectCard";
import CardGridSkeleton from "../common/CardGridSkeleton";

function FeaturedProjects() {
  const { data, loading } = useCollection(projectsApi.list);
  const featured = (data || []).filter((project) => project.featured);

  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="font-semibold uppercase tracking-widest text-chadi-gold">
            OUR PROJECTS
          </span>

          <h2 className="mt-4 text-5xl font-bold text-chadi-green">
            Creating Sustainable Impact
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
            Through innovative programs and strategic partnerships,
            CHADI International is transforming lives across underserved
            communities.
          </p>
        </div>

        {loading ? (
          <CardGridSkeleton count={3} columns={3} />
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
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
