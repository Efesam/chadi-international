import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaHeart, FaHandsHelping, FaExpand, FaPlay } from "react-icons/fa";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import DetailSkeleton from "../../components/common/DetailSkeleton";
import DonateModal from "../../components/common/DonateModal";
import VolunteerModal from "../../components/common/VolunteerModal";
import Reveal from "../../components/common/Reveal";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import Lightbox from "../../components/common/Lightbox";
import { useCollection } from "../../hooks/useCollection";
import { projectsApi, getProjectDonationSummary } from "../../services/api";
import Newsletter from "../../components/common/Newsletter";

function ProjectDetails() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [donateOpen, setDonateOpen] = useState(false);
  const [volunteerOpen, setVolunteerOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
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

  const media = project.media || [];
  const lightboxItems = project.image
    ? [{ type: "image", url: project.image, caption: project.title }, ...media]
    : media;
  const spending = project.spending || [];

  const navigateLightbox = (delta) => {
    setLightboxIndex((current) => {
      if (current === null) return current;
      const total = lightboxItems.length;
      return (current + delta + total) % total;
    });
  };
  const totalSpent = spending.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalRaised = Number(summary?.totalRaised || 0);
  const budget = Number(project.budget || 0);
  const goalProgress = budget > 0 ? Math.min((totalRaised / budget) * 100, 100) : 0;

  return (
    <>
      <Seo
        title={project.title}
        path={`/projects/${slug}`}
        description={project.summary || t("projectDetails.seoFallbackDescription", { title: project.title })}
        image={project.image}
      />

      <PageHeader title={project.title} subtitle={project.program} />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              aria-label={`View ${project.title} photo fullscreen`}
              className="group relative block h-96 w-full overflow-hidden rounded-3xl shadow-lg md:h-[500px]"
            >
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                <FaExpand
                  size={28}
                  className="text-white opacity-0 transition group-hover:opacity-100"
                />
              </span>
            </button>
          </Reveal>

          <div className="mt-12 grid gap-12 lg:grid-cols-3">
            <Reveal direction="left" className="lg:col-span-2">
              <div>
              <h2 className="text-3xl font-bold text-chadi-green sm:text-4xl dark:text-chadi-lightgreen">
                {t("projectDetails.aboutTitle")}
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                {project.summary}
              </p>

              <div className="mt-10 rounded-3xl bg-chadi-cream p-8">
                <h3 className="text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                  {t("projectDetails.objectivesTitle")}
                </h3>
                <ul className="mt-4 list-disc space-y-3 pl-6 text-gray-600 dark:text-gray-300">
                  <li>{t("projectDetails.objectives.empower")}</li>
                  <li>{t("projectDetails.objectives.wellbeing")}</li>
                  <li>{t("projectDetails.objectives.sustainable")}</li>
                  <li>{t("projectDetails.objectives.impact")}</li>
                </ul>
              </div>

              {media.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                    {t("projectDetails.mediaTitle")}
                  </h3>
                  <StaggerGrid className="mt-5 grid gap-4 sm:grid-cols-2">
                    {media.map((item, index) => (
                      <StaggerItem key={index}>
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(index + 1)}
                          aria-label={
                            item.type === "video"
                              ? `Play ${item.caption || "video"} fullscreen`
                              : `View ${item.caption || "photo"} fullscreen`
                          }
                          className="group block w-full overflow-hidden rounded-2xl bg-gray-100 text-left transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
                        >
                          <div className="relative h-56 w-full overflow-hidden bg-black">
                            {item.type === "video" ? (
                              <>
                                <video
                                  src={item.url}
                                  muted
                                  playsInline
                                  preload="metadata"
                                  className="h-full w-full object-cover opacity-90 transition group-hover:opacity-70"
                                />
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-chadi-green transition group-hover:scale-110">
                                    <FaPlay size={18} className="ml-1" />
                                  </span>
                                </span>
                              </>
                            ) : (
                              <>
                                <img
                                  src={item.url}
                                  alt={item.caption || project.title}
                                  loading="lazy"
                                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                                <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                                  <FaExpand
                                    size={22}
                                    className="text-white opacity-0 transition group-hover:opacity-100"
                                  />
                                </span>
                              </>
                            )}
                          </div>
                          {item.caption && (
                            <figcaption className="p-3 text-sm text-gray-600 dark:text-gray-300">
                              {item.caption}
                            </figcaption>
                          )}
                        </button>
                      </StaggerItem>
                    ))}
                  </StaggerGrid>
                </div>
              )}

              {spending.length > 0 && (
                <div className="mt-10 rounded-3xl border border-chadi-green/20 p-8">
                  <h3 className="text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                    {t("projectDetails.spendingTitle")}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t("projectDetails.spendingIntro")}
                  </p>

                  <ul className="mt-6 divide-y divide-gray-100">
                    {spending.map((item, index) => (
                      <li key={index} className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{item.description}</p>
                          {item.date && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-chadi-green dark:text-chadi-lightgreen">
                          ₦{Number(item.amount || 0).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <p className="font-bold text-gray-800 dark:text-gray-200">{t("projectDetails.totalSpent")}</p>
                    <p className="text-xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                      ₦{totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.15}>
              <aside className="rounded-3xl bg-gray-50 p-8 shadow-lg dark:bg-gray-800">
              <h3 className="text-2xl font-bold">{t("projectDetails.sidebarTitle")}</h3>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{t("projectDetails.program")}</p>
                  <p className="font-semibold">{project.program}</p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">{t("projectDetails.location")}</p>
                  <p className="font-semibold">{project.location}</p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">{t("projectDetails.status")}</p>
                  <p className="font-semibold">{project.status}</p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">{t("projectDetails.beneficiaries")}</p>
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
                      <div
                        className="h-full rounded-full bg-chadi-gold"
                        style={{ width: `${goalProgress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {t("projectDetails.goalProgress", { percent: Math.round(goalProgress), budget: budget.toLocaleString() })}
                    </p>
                  </div>
                )}

                {spending.length > 0 && (
                  <div className="mt-4 space-y-1 border-t border-gray-100 pt-4 text-sm">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>{t("projectDetails.spentSoFar")}</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        ₦{totalSpent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>{t("projectDetails.remaining")}</span>
                      <span className="font-semibold text-chadi-green dark:text-chadi-lightgreen">
                        ₦{Math.max(totalRaised - totalSpent, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setDonateOpen(true)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-chadi-gold px-6 py-3 font-semibold text-black transition hover:scale-105"
                >
                  <FaHeart size={14} />
                  {t("projectDetails.donateButton")}
                </button>

                <button
                  type="button"
                  onClick={() => setVolunteerOpen(true)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-chadi-green px-6 py-3 font-semibold text-chadi-green transition hover:bg-chadi-green hover:text-white dark:border-chadi-lightgreen dark:text-chadi-lightgreen"
                >
                  <FaHandsHelping size={14} />
                  {t("projectDetails.volunteerButton")}
                </button>
              </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <DonateModal
        open={donateOpen}
        onClose={() => setDonateOpen(false)}
        project={{ id: project.id, title: project.title }}
      />

      <VolunteerModal
        open={volunteerOpen}
        onClose={() => setVolunteerOpen(false)}
        project={{ id: project.id, title: project.title }}
      />

      <Lightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={navigateLightbox}
      />

      <Newsletter />
    </>
  );
}

export default ProjectDetails;
