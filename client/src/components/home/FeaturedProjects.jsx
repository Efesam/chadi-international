import { useTranslation } from "react-i18next";
import { useCollection } from "../../hooks/useCollection";
import { projectsApi } from "../../services/api";
import ProjectCard from "../ui/ProjectCard";
import CardGridSkeleton from "../common/CardGridSkeleton";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";

function FeaturedProjects() {
  const { t, i18n } = useTranslation();
  const { data, loading } = useCollection(() => projectsApi.list(i18n.language), [i18n.language]);
  const featured = (data || []).filter((project) => project.featured);

  if (!loading && featured.length === 0) return null;

  // Anchor section: the actual work is the most important thing on this
  // page, so it gets the most vertical air of any content section.
  return (
    <section className="bg-white py-28 dark:bg-gray-900 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="font-semibold uppercase tracking-widest text-chadi-gold-dark dark:text-chadi-gold">
              {t("home.featuredProjects.eyebrow")}
            </span>

            <h2 className="mt-4 text-4xl font-bold text-chadi-green dark:text-chadi-lightgreen sm:text-5xl">
              {t("home.featuredProjects.title")}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              {t("home.featuredProjects.subtitle")}
            </p>
          </div>
        </Reveal>

        {loading ? (
          <CardGridSkeleton count={3} columns={3} />
        ) : (
          <StaggerGrid className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </section>
  );
}

export default FeaturedProjects;
