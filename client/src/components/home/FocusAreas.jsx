import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  FaGraduationCap,
  FaHeartbeat,
  FaLeaf,
  FaLaptopCode,
  FaHandsHelping,
  FaUsers,
} from "react-icons/fa";

const FOCUS_ICONS = [<FaGraduationCap />, <FaHeartbeat />, <FaLeaf />, <FaLaptopCode />, <FaHandsHelping />, <FaUsers />];
const FOCUS_KEYS = ["education", "healthcare", "environment", "innovation", "humanitarian", "youth"];

function FocusAreas() {
  const { t } = useTranslation();
  const focusAreas = FOCUS_KEYS.map((key, index) => ({
    icon: FOCUS_ICONS[index],
    title: t(`home.focusAreas.${key}.title`),
    description: t(`home.focusAreas.${key}.description`),
  }));

  return (
    <section className="bg-white py-24 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black text-chadi-green">
            {t("home.focusAreas.title")}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-gray-600 dark:text-gray-300">
            {t("home.focusAreas.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {focusAreas.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -12,
                scale: 1.03,
              }}
              transition={{ duration: 0.3 }}
              className="group rounded-3xl border border-gray-100 bg-chadi-cream p-10 shadow-lg transition"
            >
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-chadi-green text-4xl text-white transition group-hover:bg-chadi-gold group-hover:text-black">
                {item.icon}
              </div>

              <h3 className="mb-4 text-2xl font-bold text-chadi-green">
                {item.title}
              </h3>

              <p className="leading-8 text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FocusAreas;