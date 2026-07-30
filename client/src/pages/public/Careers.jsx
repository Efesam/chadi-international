import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Reveal from "../../components/common/Reveal";
import Newsletter from "../../components/common/Newsletter";
import careersImage from "../../assets/projects/school-support.jpg";

function Careers() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t("careers.seoTitle")}
        path="/careers"
        description={t("careers.seoDescription")}
      />

      <PageHeader
        title={t("careers.title")}
        subtitle={t("careers.subtitle")}
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <Reveal direction="left">
            <img
              src={careersImage}
              alt="CHADI team members working with a community"
              loading="lazy"
              className="rounded-3xl shadow-xl"
            />
          </Reveal>

          <Reveal direction="right" delay={0.15} className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-chadi-green sm:text-4xl dark:text-chadi-lightgreen">
              {t("careers.noRoles")}
            </h2>
            <p className="mt-6 leading-8 text-gray-600 dark:text-gray-300">
              {t("careers.description")}
            </p>
            <Link
              to="/volunteer"
              className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white"
            >
              {t("careers.cta")}
            </Link>
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default Careers;
