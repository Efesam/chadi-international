import { motion } from "motion/react";
import { FaHeart, FaBalanceScale, FaLightbulb, FaUsers, FaMedal, FaHandshake } from "react-icons/fa";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";
import bgImage from "../../assets/projects/start.jpg";

const values = [
  {
    icon: FaHeart,
    title: "Compassion",
    description: "Serving humanity with empathy and love.",
  },
  {
    icon: FaBalanceScale,
    title: "Integrity",
    description: "Transparency and accountability in everything we do.",
  },
  {
    icon: FaLightbulb,
    title: "Innovation",
    description: "Creating sustainable solutions for community challenges.",
  },
  {
    icon: FaUsers,
    title: "Inclusion",
    description: "Ensuring everyone has equal opportunities.",
  },
  {
    icon: FaMedal,
    title: "Excellence",
    description: "Delivering impactful programs with quality.",
  },
  {
    icon: FaHandshake,
    title: "Collaboration",
    description: "Working together with partners and communities.",
  },
];

function CoreValues() {
  return (
    <section
      className="relative overflow-hidden bg-gray-50 bg-cover bg-center py-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/93" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <h2 className="text-center text-4xl font-bold text-chadi-green sm:text-5xl dark:text-chadi-lightgreen">
            Our Core Values
          </h2>
        </Reveal>

        <StaggerGrid className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <StaggerItem key={value.title}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full rounded-3xl bg-white p-8 shadow-lg hover:shadow-xl dark:bg-gray-800"
                >
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-chadi-green text-white"
                  >
                    <Icon size={26} />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-chadi-green">
                    {value.title}
                  </h3>

                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    {value.description}
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

export default CoreValues;
