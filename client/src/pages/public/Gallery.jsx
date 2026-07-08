import PageHeader from "../../components/common/PageHeader";
import { projects } from "../../data/projects";

function Gallery() {
  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="A glimpse into CHADI programs, projects and community impact."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 9).map((project) => (
              <figure
                key={project.id}
                className="overflow-hidden rounded-xl bg-chadi-cream shadow-sm"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-72 w-full object-cover"
                />
                <figcaption className="p-5 font-semibold text-chadi-green">
                  {project.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Gallery;
