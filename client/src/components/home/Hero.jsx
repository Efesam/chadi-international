import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaHeart } from "react-icons/fa";
import heroImage from "../../assets/hero.jpg";
import DonateModal from "../common/DonateModal";
import { useCollection } from "../../hooks/useCollection";
import { getSettings } from "../../services/api";

function Hero() {
  const [donateOpen, setDonateOpen] = useState(false);
  const { data: settings } = useCollection(getSettings);
  const beneficiaries = settings?.stats?.find((s) => s.label === "Beneficiaries")?.value;

  return (
    <section className="relative min-h-screen overflow-hidden bg-chadi-green">

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-24 lg:px-12">

        <div className="grid w-full items-center gap-3 lg:grid-cols-[42%_58%]">

          {/* ================= TEXT ================= */}

          <motion.div
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="text-left"
          >

            <span className="inline-block rounded-full bg-chadi-gold px-7 py-2 text-xs font-bold uppercase tracking-[4px] text-black">
              CHADI INTERNATIONAL
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-5xl">
              Hope is not enough.
              <span className="block text-chadi-gold">Action is.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
              Millions of underserved people still lack access to health,
              education and opportunity. CHADI is changing that &mdash; one
              life, one community at a time.
            </p>

            {beneficiaries && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white">
                <FaHeart className="text-chadi-gold" size={12} />
                Over {Number(beneficiaries).toLocaleString()}+ lives impacted so far
              </p>
            )}

            <div className="mt-10 flex flex-wrap gap-5">

              <button
                type="button"
                onClick={() => setDonateOpen(true)}
                className="group flex items-center gap-3 rounded-xl bg-chadi-gold px-7 py-4 font-semibold text-black transition duration-300 hover:scale-105"
              >
                <FaHeart />
                Donate Now
              </button>

              <Link
                to="/get-involved"
                className="group flex items-center gap-3 rounded-xl border-2 border-white px-7 py-4 font-semibold text-white transition duration-300 hover:bg-white hover:text-chadi-green"
              >
                Join the Mission

                <FaArrowRight className="transition group-hover:translate-x-2" />

              </Link>

            </div>

          </motion.div>

          {/* ================= IMAGE ================= */}

          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex items-end justify-center lg:justify-end"
          >

            <img
              src={heroImage}
              alt="CHADI International"
              className="h-[85vh] w-auto object-contain sm:h-[90vh] lg:h-[90vh] xl:h-[110vh]"
            />

          </motion.div>

        </div>

      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-chadi-green to-transparent" />

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />

    </section>
  );
}

export default Hero;
