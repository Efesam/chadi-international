import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Reveal from "../../components/common/Reveal";
import Newsletter from "../../components/common/Newsletter";

const BEFORE_RIGHTS_KEYS = ["collect", "cookies", "usage", "sharing", "retention"];
const AFTER_RIGHTS_KEYS = ["children", "changes"];

function Privacy() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t("privacy.seoTitle")}
        path="/privacy"
        description={t("privacy.seoDescription")}
      />

      <PageHeader
        title={t("privacy.title")}
        subtitle={t("privacy.subtitle")}
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <Reveal className="mx-auto max-w-4xl space-y-8 px-6 leading-8 text-gray-600 dark:text-gray-300">
          <p className="rounded-xl bg-chadi-cream p-5 text-sm text-gray-600 dark:text-gray-300">
            {t("privacy.lastUpdated")}
          </p>

          {BEFORE_RIGHTS_KEYS.map((key) => (
            <div key={key}>
              <h2 className="text-xl font-bold text-chadi-green dark:text-chadi-lightgreen">{t(`privacy.${key}.title`)}</h2>
              <p className="mt-3">{t(`privacy.${key}.body`)}</p>
            </div>
          ))}

          <div>
            <h2 className="text-xl font-bold text-chadi-green dark:text-chadi-lightgreen">{t("privacy.rights.title")}</h2>
            <p className="mt-3">
              {t("privacy.rights.body")}{" "}
              <Link to="/contact" className="font-semibold text-chadi-green underline dark:text-chadi-lightgreen">
                {t("privacy.rights.contactLink")}
              </Link>
              .
            </p>
          </div>

          {AFTER_RIGHTS_KEYS.map((key) => (
            <div key={key}>
              <h2 className="text-xl font-bold text-chadi-green dark:text-chadi-lightgreen">{t(`privacy.${key}.title`)}</h2>
              <p className="mt-3">{t(`privacy.${key}.body`)}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <Newsletter />
    </>
  );
}

export default Privacy;
