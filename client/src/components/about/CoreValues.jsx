const values = [
  {
    title: "Compassion",
    description:
      "Serving humanity with empathy and love."
  },
  {
    title: "Integrity",
    description:
      "Transparency and accountability in everything we do."
  },
  {
    title: "Innovation",
    description:
      "Creating sustainable solutions for community challenges."
  },
  {
    title: "Inclusion",
    description:
      "Ensuring everyone has equal opportunities."
  },
  {
    title: "Excellence",
    description:
      "Delivering impactful programs with quality."
  },
  {
    title: "Collaboration",
    description:
      "Working together with partners and communities."
  }
];

function CoreValues() {
  return (
    <section className="bg-gray-50 py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-center text-5xl font-bold text-chadi-green">
          Our Core Values
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {values.map((value) => (

            <div
              key={value.title}
              className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2"
            >

              <h3 className="text-2xl font-bold text-chadi-green">
                {value.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {value.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default CoreValues;
