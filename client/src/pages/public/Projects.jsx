import { useState } from "react";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import ProjectCard from "../../components/ui/ProjectCard";
import CardGridSkeleton from "../../components/common/CardGridSkeleton";
import Reveal from "../../components/common/Reveal";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import { useCollection } from "../../hooks/useCollection";
import { projectsApi } from "../../services/api";
import Newsletter from "../../components/common/Newsletter";

function Projects() {
  const { data, loading, error } = useCollection(projectsApi.list);
  const projects = data || [];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(projects.map((project) => project.program)),
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      (project.summary || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || project.program === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Seo
        title="Our Projects"
        path="/projects"
        description="Explore CHADI International's active projects across health, education, livelihood and community development."
      />

      <PageHeader
        title="Our Projects"
        subtitle="Empowering Marginalised Individuals & Underserved Communities"
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <CardGridSkeleton count={6} columns={3} />
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : (
            <>
              {/* Search */}

              <Reveal className="mb-8">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border px-5 py-4 outline-none focus:border-chadi-green"
                />
              </Reveal>

              {/* Categories */}

              <Reveal delay={0.1} className="mb-12 flex flex-wrap gap-3">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`rounded-full px-5 py-2 transition
                    ${
                      category === item
                        ? "bg-chadi-green text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </Reveal>

              {/* Grid */}

              {filteredProjects.length === 0 ? (
                <p className="text-center text-gray-500">No projects match your search.</p>
              ) : (
                <StaggerGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <StaggerItem key={project.id}>
                      <ProjectCard project={project} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              )}
            </>
          )}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
export default Projects;
