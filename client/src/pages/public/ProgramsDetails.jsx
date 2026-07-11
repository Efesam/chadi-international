import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ProgramCard from "../../components/ui/ProgramCard";
import ProjectCard from "../../components/ui/ProjectCard";
import { useCollection } from "../../hooks/useCollection";
import { projectsApi, programsApi } from "../../services/api";

function ProgramsDetails() {
  const { slug } = useParams();
  const { data: projects } = useCollection(projectsApi.list);
  const { data: programs, loading } = useCollection(programsApi.list);

  const program = (programs || []).find((item) => item.slug === slug);

  if (loading) {
    return (
      <section className="bg-white py-28 text-center">
        <p className="text-gray-500">Loading program...</p>
      </section>
    );
  }

  if (!program) {
    return (
      <section className="bg-white py-28 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold text-chadi-green">
            Program Not Found
          </h1>
          <p className="mt-4 text-gray-600">
            Please return to the programs page to explore CHADI initiatives.
          </p>
        </div>
      </section>
    );
  }

  const relatedProjects = (projects || []).filter((project) =>
    project.program.toLowerCase().includes(program.title.toLowerCase()) ||
    program.title.toLowerCase().includes(project.program.toLowerCase()) ||
    (project.summary || "").toLowerCase().includes(program.title.toLowerCase())
  );

  const otherPrograms = (programs || []).filter((item) => item.slug !== program.slug);

  return (
    <>
      <PageHeader
        title={program.title}
        subtitle={program.description}
      />

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-bold text-chadi-green">
              About {program.title}
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              {program.description}
            </p>

            <div className="mt-10 rounded-3xl bg-chadi-cream p-8">
              <h3 className="text-2xl font-bold text-chadi-green">
                Core Focus
              </h3>

              <ul className="mt-4 list-disc space-y-3 pl-6 text-gray-600">
                <li>Reach underserved communities with practical support.</li>
                <li>Build local capacity through training and mentoring.</li>
                <li>Partner with communities for sustainable outcomes.</li>
                <li>Track impact through clear program activities.</li>
              </ul>
            </div>
          </div>

          <aside className="rounded-3xl bg-gray-50 p-8 shadow-lg">
            <h3 className="text-2xl font-bold">
              Program Details
            </h3>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-gray-500">
                  Category
                </p>

                <p className="font-semibold">
                  {program.category}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Initiative
                </p>

                <p className="font-semibold">
                  {program.title}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-4xl font-bold text-chadi-green">
              Related Projects
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl font-bold text-chadi-green">
            Explore More Programs
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherPrograms.slice(0, 3).map((item) => (
              <ProgramCard key={item.id} program={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProgramsDetails;
