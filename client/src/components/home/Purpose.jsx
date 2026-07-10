const approach = [
  {
    title: "Community-driven",
    description: "Every program is designed with the people it serves, not for them.",
  },
  {
    title: "Inclusive by default",
    description: "Age, gender and disability are never a barrier to participation.",
  },
  {
    title: "Built to last",
    description: "We favour durable, local capacity over one-off relief.",
  },
];

function Purpose() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[4px] text-chadi-green">
              Our Purpose
            </p>

            <h2 className="mt-5 max-w-lg text-4xl leading-tight text-chadi-ink sm:text-5xl">
              We exist so that where a person is born doesn't decide what
              they're able to become.
            </h2>

            <p className="mt-8 max-w-lg text-lg leading-8 text-chadi-ink/70">
              CHADI International designs and delivers programs in health,
              education, livelihoods and environmental resilience across
              underserved communities in Northeast Nigeria &mdash; working
              alongside local leaders rather than around them.
            </p>

            <blockquote className="mt-10 border-l-2 border-chadi-gold pl-6 font-serif text-2xl italic leading-snug text-chadi-ink">
              "Sustainable development, innovation, education, healthcare and
              humanitarian interventions &mdash; for the communities most
              often left out."
            </blockquote>
          </div>

          <div className="lg:pt-16">
            <p className="text-xs font-semibold uppercase tracking-[4px] text-chadi-ink/40">
              How we work
            </p>

            <ul className="mt-6 divide-y divide-chadi-ink/10">
              {approach.map((item) => (
                <li key={item.title} className="py-6 first:pt-0">
                  <h3 className="text-xl text-chadi-ink">{item.title}</h3>
                  <p className="mt-2 leading-7 text-chadi-ink/60">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Purpose;
