const timeline = [
  {
    year: "2021",
    title: "CHADI Founded",
    description:
      "CHADI was established to empower underserved communities through sustainable development.",
  },
  {
    year: "2022",
    title: "Health & Nutrition Programs",
    description:
      "Expanded maternal and child health initiatives across rural communities.",
  },
  {
    year: "2023",
    title: "Youth Empowerment",
    description:
      "Launched digital skills and entrepreneurship training for young people.",
  },
  {
    year: "2024",
    title: "Regional Expansion",
    description:
      "Extended projects across several states in Northern Nigeria through strategic partnerships.",
  },
];

function ImpactTimeline() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-5xl font-bold text-chadi-green">
          Our Journey
        </h2>

        <div className="mt-16 space-y-10">
          {timeline.map((item) => (
            <div
              key={item.year}
              className="rounded-3xl border-l-4 border-chadi-gold bg-white p-8 shadow"
            >
              <span className="text-lg font-bold text-chadi-gold">
                {item.year}
              </span>

              <h3 className="mt-2 text-2xl font-bold text-chadi-green">
                {item.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactTimeline;
