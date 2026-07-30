import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  FaHandsHelping,
  FaUsers,
  FaLightbulb,
  FaGlobeAfrica,
} from "react-icons/fa";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";

const REASON_ICONS = [FaHandsHelping, FaUsers, FaLightbulb, FaGlobeAfrica];
const REASON_KEYS = ["community", "inclusive", "innovation", "sustainable"];

function WhyChooseUs() {
  const { t } = useTranslation();
  const reasons = REASON_KEYS.map((key, index) => ({
    icon: REASON_ICONS[index],
    title: t(`home.whyChooseUs.${key}.title`),
    description: t(`home.whyChooseUs.${key}.description`),
  }));

  return (
    <section className="bg-gray-50 py-24 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6">

        <Reveal>
          <div className="mb-16 text-center">
            <h2 className="text-5xl font-bold text-chadi-green dark:text-chadi-lightgreen">
              {t("home.whyChooseUs.title")}
            </h2>

            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {t("home.whyChooseUs.subtitle")}
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
                  className="h-full rounded-3xl bg-white p-8 shadow-lg hover:shadow-xl dark:bg-gray-800"
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

                  <p className="text-gray-600 dark:text-gray-300 leading-7">
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
