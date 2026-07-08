import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import ProjectCard from "../../components/ui/ProjectCard";
import { projects } from "../../data/projects";

function Projects() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(projects.map((project) => project.program)),
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.summary.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || project.program === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <PageHeader
        title="Our Projects"
        subtitle="Empowering Marginalised Individuals & Underserved Communities"
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">

          {/* Search */}

          <div className="mb-8">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border px-5 py-4 outline-none focus:border-chadi-green"
            />
          </div>

          {/* Categories */}

          <div className="mb-12 flex flex-wrap gap-3">

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

          </div>

          {/* Grid */}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}

          </div>

        </div>
      </section>
    </>
  );
}
export default Projects;
