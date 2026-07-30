import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { FaBullseye, FaEye } from "react-icons/fa";
import Reveal from "../common/Reveal";
import bgImage from "../../assets/projects/green-africa.jpg";

function VisionMission() {
  const { t } = useTranslation();

  return (
    <section
      className="relative overflow-hidden bg-gray-50 bg-cover bg-center py-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/93" />

      <div className="relative mx-auto max-w-7xl px-6">

        <Reveal>
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-chadi-green sm:text-5xl dark:text-chadi-lightgreen">
              {t("home.visionMission.title")}
            </h2>

            <p className="mt-5 text-lg text-gray-600 dark:text-gray-300">
              {t("home.visionMission.subtitle")}
            </p>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-2">

          <Reveal direction="left">
            <motion.div
              whileHover={{ y: -6 }}
              className="h-full rounded-3xl bg-chadi-green p-10 text-white shadow-xl"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaEye className="mb-6 text-5xl text-chadi-gold" />
              </motion.div>

              <h3 className="text-3xl font-bold mb-5">
                {t("home.visionMission.vision.title")}
              </h3>

              <p className="text-lg leading-8">
                {t("home.visionMission.vision.description")}
              </p>
            </motion.div>
          </Reveal>

          <Reveal direction="right">
            <motion.div
              whileHover={{ y: -6 }}
              className="h-full rounded-3xl bg-chadi-gold p-10 shadow-xl"
            >
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaBullseye className="mb-6 text-5xl text-chadi-green" />
              </motion.div>

              <h3 className="text-3xl font-bold mb-5 text-chadi-green">
                {t("home.visionMission.mission.title")}
              </h3>

              <p className="text-lg leading-8 text-gray-800">
                {t("home.visionMission.mission.description")}
              </p>
            </motion.div>
          </Reveal>

        </div>

      </div>
    </section>
  );
}

export default VisionMission;
