import { useTranslation } from "react-i18next";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";

const TIMELINE_KEYS = [
  { key: "founded", year: "2021" },
  { key: "health", year: "2022" },
  { key: "youth", year: "2023" },
  { key: "expansion", year: "2024" },
];

function ImpactTimeline() {
  const { t } = useTranslation();
  const timeline = TIMELINE_KEYS.map(({ key, year }) => ({
    year,
    title: t(`about.timeline.${key}.title`),
    description: t(`about.timeline.${key}.description`),
  }));

  return (
    <section id="journey" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="text-center text-4xl font-bold text-chadi-green sm:text-5xl dark:text-chadi-lightgreen">
            {t("about.timeline.title")}
          </h2>
        </Reveal>

        <StaggerGrid className="mt-16 space-y-10">
          {timeline.map((item) => (
            <StaggerItem key={item.year}>
              <div className="rounded-3xl bg-white p-8 shadow dark:bg-gray-800">
                <span className="text-lg font-bold text-chadi-gold-dark dark:text-chadi-gold">
                  {item.year}
                </span>

                <h3 className="mt-2 text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

export default ImpactTimeline;
