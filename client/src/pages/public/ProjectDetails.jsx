import { useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import PageHeader from "../../components/common/PageHeader";
import DetailSkeleton from "../../components/common/DetailSkeleton";
import DonateModal from "../../components/common/DonateModal";
import { useCollection } from "../../hooks/useCollection";
import { projectsApi, getProjectDonationSummary } from "../../services/api";

function ProjectDetails() {
  const { slug } = useParams();
  const [donateOpen, setDonateOpen] = useState(false);
  const { data: project, loading, error } = useCollection(() => projectsApi.get(slug), [slug]);
  const { data: summary } = useCollection(
    () => (project ? getProjectDonationSummary(project.id) : Promise.resolve(null)),
    [project?.id]
  );

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !project) {
    return (
      <section className="bg-white py-28 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold text-chadi-green">
            Project Not Found
          </h1>
          <p className="mt-4 text-gray-600">
            Please return to the projects page to explore CHADI's work.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader title={project.title} subtitle={project.program} />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-96 w-full rounded-3xl object-cover shadow-lg md:h-[500px]"
          />

          <div className="mt-12 grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-bold text-chadi-green">
                About this Project
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                {project.summary}
              </p>

              <div className="mt-10 rounded-3xl bg-chadi-cream p-8">
                <h3 className="text-2xl font-bold text-chadi-green">
                  Objectives
                </h3>
                <ul className="mt-4 list-disc space-y-3 pl-6 text-gray-600">
                  <li>Empower marginalized individuals and families.</li>
                  <li>Improve community wellbeing through practical support.</li>
                  <li>Promote sustainable development with local participation.</li>
                  <li>Create measurable impact for underserved communities.</li>
                </ul>
              </div>
            </div>

            <aside className="rounded-3xl bg-gray-50 p-8 shadow-lg">
              <h3 className="text-2xl font-bold">Project Details</h3>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="text-gray-500">Program</p>
                  <p className="font-semibold">{project.program}</p>
                </div>

                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-semibold">{project.location}</p>
                </div>

                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-semibold">{project.status}</p>
                </div>

                <div>
                  <p className="text-gray-500">Beneficiaries</p>
                  <p className="font-semibold">{project.beneficiaries}</p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Raised for this project</p>
                <p className="mt-1 text-3xl font-bold text-chadi-green">
                  ₦{Number(summary?.totalRaised || 0).toLocaleString()}
                </p>
                {summary?.donorCount > 0 && (
                  <p className="mt-1 text-xs text-gray-400">
                    from {summary.donorCount} supporter{summary.donorCount === 1 ? "" : "s"}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setDonateOpen(true)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-chadi-gold px-6 py-3 font-semibold text-black transition hover:scale-105"
                >
                  <FaHeart size={14} />
                  Donate to this Project
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <DonateModal
        open={donateOpen}
        onClose={() => setDonateOpen(false)}
        project={{ id: project.id, title: project.title }}
      />
    </>
  );
}

export default ProjectDetails;
