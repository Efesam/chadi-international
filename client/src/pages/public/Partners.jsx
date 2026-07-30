import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import CardGridSkeleton from "../../components/common/CardGridSkeleton";
import Reveal from "../../components/common/Reveal";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import { useCollection } from "../../hooks/useCollection";
import { partnersApi } from "../../services/api";
import Newsletter from "../../components/common/Newsletter";

const PARTNER_TYPE_KEYS = ["community", "schools", "health", "corporate", "faith", "research"];

function Partners() {
  const { t, i18n } = useTranslation();
  const { data: partners, loading, error } = useCollection(() => partnersApi.list(i18n.language), [i18n.language]);

  return (
    <>
      <Seo
        title={t("partners.seoTitle")}
        path="/partners"
        description={t("partners.seoDescription")}
      />

      <PageHeader
        title={t("partners.title")}
        subtitle={t("partners.subtitle")}
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <Reveal direction="left">
            <h2 className="text-3xl font-bold text-chadi-green sm:text-4xl dark:text-chadi-lightgreen">
              {t("partners.workWithUs")}
            </h2>
            <p className="mt-6 leading-8 text-gray-600 dark:text-gray-300">
              {t("partners.description")}
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white"
            >
              {t("partners.becomePartner")}
            </Link>
          </Reveal>

          <StaggerGrid className="grid gap-4 sm:grid-cols-2">
            {PARTNER_TYPE_KEYS.map((key) => (
              <StaggerItem key={key}>
                <div className="rounded-xl bg-chadi-cream p-6 font-semibold text-chadi-green shadow-sm dark:text-chadi-lightgreen">
                  {t(`partners.types.${key}`)}
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="text-3xl font-bold text-chadi-green sm:text-4xl dark:text-chadi-lightgreen">{t("partners.ourPartners")}</h2>
          </Reveal>

          {loading ? (
            <CardGridSkeleton count={3} columns={3} />
          ) : error ? (
            <p className="mt-8 font-semibold text-red-600">{error}</p>
          ) : partners.length === 0 ? (
            <p className="mt-8 text-gray-500 dark:text-gray-400">
              {t("partners.empty")}
            </p>
          ) : (
            <StaggerGrid className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner) => (
                <StaggerItem key={partner.id}>
                  <a
                    href={partner.website || "#"}
                    target={partner.website ? "_blank" : undefined}
                    rel={partner.website ? "noreferrer" : undefined}
                    className="block rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-gray-800"
                  >
                    {partner.logo && (
                      <img src={partner.logo} alt={partner.name} loading="lazy" className="h-12 object-contain" />
                    )}
                    <p className="mt-4 font-bold text-chadi-green dark:text-chadi-lightgreen">{partner.name}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{partner.type}</p>
                    {partner.description && (
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{partner.description}</p>
                    )}
                  </a>
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default Partners;
