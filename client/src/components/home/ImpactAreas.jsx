import { useTranslation } from "react-i18next";
import SectionTitle from "../ui/SectionTitle";

const AREA_KEYS = [
  { key: "education", percentage: 85 },
  { key: "healthcare", percentage: 72 },
  { key: "women", percentage: 65 },
  { key: "climate", percentage: 48 },
];

function ImpactAreas() {
  const { t } = useTranslation();
  const areas = AREA_KEYS.map(({ key, percentage }) => ({
    title: t(`home.impactAreas.${key}`),
    percentage,
  }));

  return (
    <section className="bg-chadi-cream py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          center
          eyebrow={t("home.impactAreas.eyebrow")}
          title={t("home.impactAreas.title")}
          description={t("home.impactAreas.description")}
        />

        <div className="mt-16 space-y-8">
          {areas.map((area) => (
            <div key={area.title}>
              <div className="mb-2 flex justify-between font-semibold">
                <span>{area.title}</span>
                <span>{area.percentage}%</span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-white dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-chadi-green"
                  style={{ width: `${area.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactAreas;
