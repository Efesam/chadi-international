import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowLeft } from "react-icons/fa";
import Seo from "../../components/common/Seo";
import DetailSkeleton from "../../components/common/DetailSkeleton";
import DonateForm from "../../components/common/DonateForm";
import Reveal from "../../components/common/Reveal";
import { useCollection } from "../../hooks/useCollection";
import { projectsApi, getProjectDonationSummary } from "../../services/api";

/**
 * A dedicated full page for donating to one specific project - project
 * donations used to open in the same popup as a general donation
 * (DonateModal), which read as unprofessional for a real payment form and
 * behaved awkwardly on some screens. The general/non-project donate flow
 * (triggered from the navbar, hero, etc.) still uses the popup - see
 * DonateModal.jsx - since there's no project story to make room for there.
 */
function ProjectDonate() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: project, loading, error } = useCollection(() => projectsApi.get(slug, i18n.language), [slug, i18n.language]);
  const { data: summary } = useCollection(
    () => (project ? getProjectDonationSummary(project.id) : Promise.resolve(null)),
    [project?.id]
  );

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !project) {
    return (
      <section className="bg-white py-28 text-center dark:bg-gray-900">
        <Seo title={t("projectDetails.notFoundTitle")} noindex />
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold text-chadi-green dark:text-chadi-lightgreen">
            {t("projectDetails.notFoundTitle")}
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {t("projectDetails.notFoundDescription")}
          </p>
        </div>
      </section>
    );
  }

  const totalRaised = Number(summary?.totalRaised || 0);
  const budget = Number(project.budget || 0);
  const goalProgress = budget > 0 ? Math.min((totalRaised / budget) * 100, 100) : 0;

  return (
    <>
      <Seo
        title={t("donate.projectDonate.seoTitle", { title: project.title })}
        path={`/donate/${slug}`}
        description={project.summary || t("projectDetails.seoFallbackDescription", { title: project.title })}
        image={project.image}
      />

      <section className="bg-gray-50 py-12 dark:bg-gray-950 sm:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Link
            to={`/projects/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-chadi-green dark:text-gray-400 dark:hover:text-chadi-lightgreen"
          >
            <FaArrowLeft size={12} />
            {t("donate.projectDonate.backToProject")}
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-5 lg:items-start">
            {/* Story column */}
            <Reveal direction="left" className="lg:col-span-3">
              <div className="overflow-hidden rounded-3xl shadow-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-72 w-full object-cover sm:h-96"
                />
              </div>

              <span className="mt-6 inline-block rounded-full bg-chadi-green px-4 py-2 text-sm font-semibold text-white">
                {project.program}
              </span>

              <h1 className="mt-4 text-3xl font-bold text-chadi-green dark:text-chadi-lightgreen sm:text-4xl">
                {project.title}
              </h1>

              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">{project.summary}</p>

              <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("projectDetails.location")}</p>
                  <p className="font-semibold">{project.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("projectDetails.status")}</p>
                  <p className="font-semibold">{project.status}</p>
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("projectDetails.beneficiaries")}</p>
                  <p className="font-semibold">{project.beneficiaries}</p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("projectDetails.raised")}</p>
                <p className="mt-1 text-3xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                  ₦{totalRaised.toLocaleString()}
                </p>
                {summary?.donorCount > 0 && (
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {t("projectDetails.fromSupporters", { count: summary.donorCount })}
                  </p>
                )}

                {budget > 0 && (
                  <div className="mt-4">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <div className="h-full rounded-full bg-chadi-gold" style={{ width: `${goalProgress}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {t("projectDetails.goalProgress", { percent: Math.round(goalProgress), budget: budget.toLocaleString() })}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Donate form column - sticky on desktop so it stays in view
                alongside the story as the donor scrolls. */}
            <Reveal direction="right" delay={0.15} className="lg:col-span-2">
              <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-gray-800 lg:sticky lg:top-24">
                <h2 className="text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                  {t("donate.projectDonate.giveHeading")}
                </h2>
                <DonateForm
                  project={{ id: project.id, title: project.title }}
                  showHeader={false}
                  onDone={() => navigate(`/projects/${slug}`)}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProjectDonate;
