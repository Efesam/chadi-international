import { motion } from "framer-motion";
import {
  FaHandsHelping,
  FaUsers,
  FaLightbulb,
  FaGlobeAfrica,
} from "react-icons/fa";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";

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

        <Reveal>
          <div className="mb-16 text-center">
            <h2 className="text-5xl font-bold text-chadi-green">
              Why CHADI International?
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              Creating sustainable change through innovation,
              partnerships and community leadership.
            </p>
          </div>
        </Reveal>

        <StaggerGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full rounded-3xl bg-white p-8 shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-chadi-green text-white"
                  >
                    <Icon size={28} />
                  </motion.div>

                  <h3 className="mb-4 text-2xl font-bold">
                    {reason.title}
                  </h3>

                  <p className="text-gray-600 leading-7">
                    {reason.description}
                  </p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

      </div>
    </section>
  );
}

export default WhyChooseUs;
