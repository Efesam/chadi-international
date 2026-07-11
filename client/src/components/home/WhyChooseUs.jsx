import {
  FaHandsHelping,
  FaUsers,
  FaLightbulb,
  FaGlobeAfrica,
} from "react-icons/fa";

const reasons = [
  {
    icon: FaHandsHelping,
    title: "Community Driven",
    description:
      "Every intervention is designed together with local communities to ensure lasting impact.",
  },
  {
    icon: FaUsers,
    title: "Inclusive Development",
    description:
      "We empower marginalized individuals regardless of age, gender or disability.",
  },
  {
    icon: FaLightbulb,
    title: "Innovation",
    description:
      "Technology, creativity and research guide our programs for sustainable development.",
  },
  {
    icon: FaGlobeAfrica,
    title: "Sustainable Impact",
    description:
      "Our projects focus on long-term transformation instead of temporary relief.",
  },
];

function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <h2 className="text-5xl font-bold text-chadi-green">
            Why CHADI International?
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Creating sustainable change through innovation,
            partnerships and community leadership.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <div
                key={index}
                className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-3 hover:shadow-xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-chadi-green text-white">
                  <Icon size={28} />
                </div>

                <h3 className="mb-4 text-2xl font-bold">
                  {reason.title}
                </h3>

                <p className="text-gray-600 leading-7">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;