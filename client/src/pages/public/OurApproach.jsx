import { useTranslation } from "react-i18next";
import { FaArrowRight, FaShieldAlt, FaBolt, FaLeaf } from "react-icons/fa";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Reveal from "../../components/common/Reveal";
import Newsletter from "../../components/common/Newsletter";
import PillarSection from "../../components/approach/PillarSection";
import { PILLARS } from "../../data/pillars";

const MODEL_ICONS = { protect: FaShieldAlt, empower: FaBolt, thrive: FaLeaf };
const MODEL_KEYS = ["protect", "empower", "thrive"];

function OurApproach() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t("ourApproach.seoTitle")}
        path="/our-approach"
        description={t("ourApproach.seoDescription")}
      />

      <PageHeader title={t("ourApproach.pageTitle")} subtitle={t("ourApproach.pageSubtitle")} />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
          <Reveal direction="left">
            <div className="h-full rounded-3xl bg-gray-50 p-8 dark:bg-gray-950">
              <h2 className="text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                {t("ourApproach.theoryOfChange.title")}
              </h2>
              <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
                {t("ourApproach.theoryOfChange.description")}
              </p>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="h-full rounded-3xl bg-gray-50 p-8 dark:bg-gray-950">
              <h2 className="text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                {t("ourApproach.impactStatement.title")}
              </h2>
              <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
                {t("ourApproach.impactStatement.description")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="text-center text-3xl font-bold text-chadi-green sm:text-4xl dark:text-chadi-lightgreen">
              {t("ourApproach.programmeModel.title")}
            </h2>
          </Reveal>

          <div className="mt-14 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
            {MODEL_KEYS.map((key, index) => {
              const Icon = MODEL_ICONS[key];
              return (
                <div key={key} className="flex flex-1 items-center gap-4">
                  <Reveal delay={index * 0.1} className="flex-1">
                    <div className="h-full rounded-2xl bg-white p-6 text-center shadow-md dark:bg-gray-800">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-chadi-green text-white">
                        <Icon size={20} />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-chadi-green dark:text-chadi-lightgreen">
                        {t(`ourApproach.pillars.${key}.name`)}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {t(`ourApproach.programmeModel.${key}`)}
                      </p>
                    </div>
                  </Reveal>

                  {index < MODEL_KEYS.length - 1 && (
                    <FaArrowRight className="hidden shrink-0 text-2xl text-chadi-gold-dark dark:text-chadi-gold lg:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {PILLARS.map((pillar, index) => (
        <PillarSection key={pillar.key} pillar={pillar} index={index} />
      ))}

      <Newsletter />
    </>
  );
}

export default OurApproach;
