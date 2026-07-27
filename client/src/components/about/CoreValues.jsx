import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";

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

        <Reveal>
          <h2 className="text-center text-4xl font-bold text-chadi-green sm:text-5xl">
            Our Core Values
          </h2>
        </Reveal>

        <StaggerGrid className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {values.map((value) => (

            <StaggerItem key={value.title}>
              <div className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2">

                <h3 className="text-2xl font-bold text-chadi-green">
                  {value.title}
                </h3>

                <p className="mt-4 text-gray-600">
                  {value.description}
                </p>

              </div>
            </StaggerItem>

          ))}

        </StaggerGrid>

      </div>

    </section>
  );
}

export default CoreValues;
