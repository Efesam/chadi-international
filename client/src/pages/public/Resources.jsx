import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import Newsletter from "../../components/common/Newsletter";

const RESOURCE_KEYS = ["nutritionGuide", "volunteerChecklist", "projectIntake"];

function Resources() {
  const { t } = useTranslation();
  const resources = RESOURCE_KEYS.map((key) => ({
    key,
    title: t(`resources.${key}.title`),
    description: t(`resources.${key}.description`),
  }));

  return (
    <>
      <Seo
        title={t("resources.seoTitle")}
        path="/resources"
        description={t("resources.seoDescription")}
      />

      <PageHeader
        title={t("resources.title")}
        subtitle={t("resources.subtitle")}
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <StaggerGrid className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <StaggerItem key={resource.key}>
              <article className="rounded-xl border border-chadi-lightgreen bg-chadi-cream p-8">
                <h2 className="text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                  {resource.title}
                </h2>
                <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
                  {resource.description}
                </p>
                <Link
                  to="/contact"
                  className="mt-6 inline-block font-semibold text-chadi-green hover:text-chadi-gold-dark dark:text-chadi-lightgreen dark:hover:text-chadi-gold"
                >
                  {t("resources.requestButton")}
                </Link>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <Newsletter />
    </>
  );
}

export default Resources;
