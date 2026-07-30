import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { FaQuoteLeft } from "react-icons/fa";
import { useCollection } from "../../hooks/useCollection";
import { testimonialsApi } from "../../services/api";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";
import CardGridSkeleton from "../common/CardGridSkeleton";
import bgImage from "../../assets/projects/food-security.jpg";

function SuccessStories() {
  const { t, i18n } = useTranslation();
  const { data, loading } = useCollection(() => testimonialsApi.list(i18n.language), [i18n.language]);
  const testimonials = data || [];

  return (
    <section
      className="relative overflow-hidden bg-chadi-cream bg-cover bg-center py-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-chadi-cream/90" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-50">
            {t("home.successStories.title")}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {t("home.successStories.subtitle")}
          </p>
        </Reveal>

        {loading ? (
          <div className="mt-14">
            <CardGridSkeleton count={3} columns={3} />
          </div>
        ) : testimonials.length === 0 ? (
          <p className="mt-14 text-gray-500 dark:text-gray-400">{t("home.successStories.empty")}</p>
        ) : (
          <StaggerGrid className="mt-14 grid gap-8 text-left md:grid-cols-3">
            {testimonials.map((testimonial) => {
              const initials = testimonial.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2);

              return (
                <StaggerItem key={testimonial.id}>
                  <motion.blockquote
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative h-full rounded-2xl bg-white p-8 shadow-sm hover:shadow-xl dark:bg-gray-800"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-block text-chadi-gold-dark dark:text-chadi-gold"
                    >
                      <FaQuoteLeft size={22} />
                    </motion.span>

                    <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">"{testimonial.quote}"</p>

                    <footer className="mt-6 flex items-center gap-3">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          loading="lazy"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chadi-green text-sm font-bold text-white">
                          {initials}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-chadi-green dark:text-chadi-lightgreen">{testimonial.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                      </div>
                    </footer>
                  </motion.blockquote>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        )}
      </div>
    </section>
  );
}

export default SuccessStories;
