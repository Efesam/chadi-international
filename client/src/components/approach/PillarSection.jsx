import { useTranslation } from "react-i18next";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";

// Alternates the section background (white/gray-50) the same way every
// other page on the site bands its sections, and alternates the pillar's
// accent color between the two brand colors so Protect/Empower/Thrive read
// as distinct from each other while staying on-brand (no third color).
const ACCENTS = [
  { bg: "bg-white dark:bg-gray-900", icon: "bg-chadi-green text-white", chip: "bg-chadi-green/10 text-chadi-green dark:bg-chadi-green/20 dark:text-chadi-lightgreen" },
  { bg: "bg-gray-50 dark:bg-gray-950", icon: "bg-chadi-gold text-black", chip: "bg-chadi-gold/15 text-chadi-gold-dark dark:bg-chadi-gold/20 dark:text-chadi-gold" },
  { bg: "bg-white dark:bg-gray-900", icon: "bg-chadi-green text-white", chip: "bg-chadi-green/10 text-chadi-green dark:bg-chadi-green/20 dark:text-chadi-lightgreen" },
];

function PillarSection({ pillar, index }) {
  const { t } = useTranslation();
  const Icon = pillar.icon;
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <section className={`${accent.bg} py-20 sm:py-24`}>
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${accent.icon}`}>
              <Icon size={26} />
            </div>

            <h2 className="mt-6 text-3xl font-bold text-chadi-green sm:text-4xl dark:text-chadi-lightgreen">
              {t(`ourApproach.pillars.${pillar.key}.name`)}
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-7 text-gray-600 dark:text-gray-300">
              {t(`ourApproach.pillars.${pillar.key}.description`)}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h3 className="mt-14 text-center text-sm font-bold uppercase tracking-[2px] text-chadi-gold-dark dark:text-chadi-gold">
            {t("ourApproach.flagshipLabel")}
          </h3>
        </Reveal>

        <StaggerGrid className="mt-8 grid gap-6 md:grid-cols-3">
          {pillar.projects.map((project) => (
            <StaggerItem key={project.key}>
              <div className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-lg dark:bg-gray-800">
                <h4 className="text-xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                  {t(`ourApproach.projects.${project.key}.name`)}
                </h4>

                <p className="mt-3 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {t(`ourApproach.projects.${project.key}.description`)}
                </p>

                {project.components.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.components.map((componentKey) => (
                      <span
                        key={componentKey}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${accent.chip}`}
                      >
                        {t(`ourApproach.components.${componentKey}`)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal delay={0.2}>
          <div className="mt-14 rounded-3xl border border-dashed border-chadi-green/30 p-6 text-center dark:border-chadi-lightgreen/30">
            <p className="text-sm font-bold uppercase tracking-[2px] text-chadi-gold-dark dark:text-chadi-gold">
              {t("ourApproach.sdgLabel")}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {pillar.sdgs.map((number) => (
                <span
                  key={number}
                  className="rounded-full bg-chadi-green px-4 py-1.5 text-xs font-semibold text-white dark:bg-chadi-lightgreen dark:text-chadi-green"
                >
                  SDG {number} · {t(`ourApproach.sdgs.${number}`)}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PillarSection;
