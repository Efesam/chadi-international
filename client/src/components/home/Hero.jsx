import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaHeart } from "react-icons/fa";
import heroImage from "../../assets/hero.jpg";
import DonateModal from "../common/DonateModal";
import { useCollection } from "../../hooks/useCollection";
import { getSettings } from "../../services/api";

/**
 * A full-bleed photographic hero: the photograph fills the whole viewport and
 * carries the emotion, with the copy set over a scrim on the left. This
 * replaced a small photo card floating on a flat green field, where the green
 * was doing the work the photograph should do.
 *
 * object-position sits right of centre on wide screens so the children's faces
 * land in the clear right-hand side rather than under the text column.
 */
function Hero() {
  const { t } = useTranslation();
  const [donateOpen, setDonateOpen] = useState(false);
  const { data: settings } = useCollection(getSettings);
  const beneficiaries = settings?.stats?.find((s) => s.label === "Beneficiaries")?.value;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0d2410]">
      {/* The photograph itself. Absolutely positioned + object-cover, so its
          own aspect ratio can never widen the page (the bug the old
          height-driven hero image had). */}
      <img
        src={heroImage}
        alt="Children in a rural Nigerian community raising their hands at sunset"
        className="absolute inset-0 h-full w-full object-cover object-[60%_center] lg:object-[65%_center]"
      />

      {/* Reading scrim. The midpoint sits at 55% so more of the photograph
          stays visible through the middle of the frame; the top-down layer
          below carries most of the legibility work over the bright sky. The
          right edge keeps a light veil rather than going fully clear, so the
          photo doesn't compete with the copy. */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#041206]/96 via-[#041206]/55 to-[#041206]/25" />

      {/* Extra top-down darkening: the sky occupies the upper half and is by
          far the brightest region the white headline sits against. */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#041206]/45 via-transparent to-transparent" />

      {/* Below lg the copy spans the full width rather than sitting in a left
          column, so it needs an all-over darkener the horizontal scrim above
          can't provide on its own. */}
      <div className="absolute inset-0 bg-[#041206]/40 lg:hidden" />

      {/* Grounds the bottom edge and softens the cut into the next section. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#071a09]/80 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="max-w-xl lg:max-w-2xl"
        >
          <span className="inline-block rounded-full bg-chadi-gold px-7 py-2 text-xs font-bold uppercase tracking-[4px] text-black">
            {t("home.hero.badge")}
          </span>

          <p className="mt-4 text-base font-semibold text-white sm:text-lg">{t("common.orgFullName")}</p>

          <h1 className="mt-6 text-4xl font-black leading-[1.08] text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
            {t("home.hero.title1")}
            <span className="block text-chadi-gold">{t("home.hero.title2")}</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/90">
            {t("home.hero.description")}
          </p>

          {beneficiaries && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm">
              <FaHeart className="text-chadi-gold" size={12} />
              {t("home.hero.impactBadge", { count: Number(beneficiaries).toLocaleString() })}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-5">
            <button
              type="button"
              onClick={() => setDonateOpen(true)}
              className="group flex items-center gap-3 rounded-xl bg-chadi-gold px-7 py-4 font-semibold text-black shadow-lg transition duration-300 hover:scale-105"
            >
              <FaHeart />
              {t("home.hero.donateNow")}
            </button>

            <Link
              to="/get-involved"
              className="group flex items-center gap-3 rounded-xl border-2 border-white/80 px-7 py-4 font-semibold text-white backdrop-blur-sm transition duration-300 hover:bg-white hover:text-chadi-green"
            >
              {t("home.hero.joinMission")}
              <FaArrowRight className="transition group-hover:translate-x-2" />
            </Link>
          </div>
        </motion.div>
      </div>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </section>
  );
}

export default Hero;
