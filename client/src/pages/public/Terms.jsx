import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Reveal from "../../components/common/Reveal";
import Newsletter from "../../components/common/Newsletter";

const SIMPLE_SECTION_KEYS = ["usage", "content"];
const AFTER_DONATIONS_KEYS = ["thirdParty", "liability", "governingLaw", "changes"];

function Terms() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t("terms.seoTitle")}
        path="/terms"
        description={t("terms.seoDescription")}
      />

      <PageHeader
        title={t("terms.title")}
        subtitle={t("terms.subtitle")}
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <Reveal className="mx-auto max-w-4xl space-y-8 px-6 leading-8 text-gray-600 dark:text-gray-300">
          <p className="rounded-xl bg-chadi-cream p-5 text-sm text-gray-600 dark:text-gray-300">
            {t("terms.disclaimer")}
          </p>

          {SIMPLE_SECTION_KEYS.map((key) => (
            <div key={key}>
              <h2 className="text-xl font-bold text-chadi-green dark:text-chadi-lightgreen">{t(`terms.${key}.title`)}</h2>
              <p className="mt-3">{t(`terms.${key}.body`)}</p>
            </div>
          ))}

          <div>
            <h2 className="text-xl font-bold text-chadi-green dark:text-chadi-lightgreen">{t("terms.donations.title")}</h2>
            <p className="mt-3">
              {t("terms.donations.body")}{" "}
              <Link to="/contact" className="font-semibold text-chadi-green underline dark:text-chadi-lightgreen">
                {t("terms.donations.contactLink")}
              </Link>{" "}
              {t("terms.donations.bodyEnd")}
            </p>
          </div>

          {AFTER_DONATIONS_KEYS.map((key) => (
            <div key={key}>
              <h2 className="text-xl font-bold text-chadi-green dark:text-chadi-lightgreen">{t(`terms.${key}.title`)}</h2>
              <p className="mt-3">{t(`terms.${key}.body`)}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <Newsletter />
    </>
  );
}

export default Terms;
