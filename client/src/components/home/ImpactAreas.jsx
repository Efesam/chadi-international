import SectionTitle from "../ui/SectionTitle";

const areas = [
  {
    title: "Education",
    percentage: 85,
  },
  {
    title: "Healthcare",
    percentage: 72,
  },
  {
    title: "Women Empowerment",
    percentage: 65,
  },
  {
    title: "Climate Action",
    percentage: 48,
  },
];

function ImpactAreas() {
  return (
    <section className="bg-chadi-cream py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          center
          eyebrow="Our Impact"
          title="Creating Sustainable Change"
          description="Every project contributes to healthier communities, better education, stronger families, and sustainable development."
        />

        <div className="mt-16 space-y-8">
          {areas.map((area) => (
            <div key={area.title}>
              <div className="mb-2 flex justify-between font-semibold">
                <span>{area.title}</span>
                <span>{area.percentage}%</span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-white">
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
