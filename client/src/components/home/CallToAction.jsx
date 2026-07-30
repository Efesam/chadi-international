import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import DonateModal from "../common/DonateModal";
import Reveal from "../common/Reveal";
import ctaImage from "../../assets/projects/miycn.jpg";

function CallToAction() {
  const { t } = useTranslation();
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <section
      className="relative overflow-hidden bg-chadi-green bg-cover bg-center py-20 text-white"
      style={{ backgroundImage: `url(${ctaImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-chadi-green/95 via-chadi-green/85 to-chadi-green/60" />

      <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 lg:flex-row lg:items-center">
        <Reveal direction="left">
          <div>
            <h2 className="text-4xl font-bold">
              {t("home.callToAction.title")}
            </h2>
            <p className="mt-4 max-w-3xl text-white/85">
              {t("home.callToAction.description")}
            </p>
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.15}>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/volunteer"
              className="rounded-lg bg-chadi-gold px-6 py-3 font-semibold text-black transition hover:scale-105"
            >
              {t("home.callToAction.volunteer")}
            </Link>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDonateOpen(true)}
              className="rounded-lg border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-chadi-green"
            >
              {t("home.callToAction.donate")}
            </motion.button>
          </div>
        </Reveal>
      </div>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </section>
  );
}

export default CallToAction;
