import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaHeart } from "react-icons/fa";
import heroImage from "../../assets/hero.png";
import DonateModal from "../common/DonateModal";

function Hero() {
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden bg-chadi-ink">
      <div className="absolute inset-0 bg-gradient-to-r from-chadi-ink via-chadi-ink/80 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-24 lg:px-12">
        <div className="grid w-full items-end gap-10 lg:grid-cols-[52%_48%]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <p className="text-xs font-semibold uppercase tracking-[5px] text-chadi-gold">
              CHADI International &mdash; Northeast Nigeria
            </p>

            <h1 className="mt-6 max-w-xl text-5xl leading-[1.1] text-white sm:text-6xl">
              Practical help,
              <br />
              <span className="italic text-chadi-lightgreen">where it's</span>
              <br />
              needed most.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              Nutrition, education and livelihood programs built with
              communities across Gombe, Bauchi, Yobe and Borno &mdash; not for
              them.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => setDonateOpen(true)}
                className="group flex items-center gap-3 rounded-full bg-chadi-gold px-7 py-4 font-semibold text-chadi-ink transition hover:bg-white"
              >
                <FaHeart className="text-chadi-ink/70" />
                Donate Now
              </button>

              <Link
                to="/projects"
                className="group flex items-center gap-2 font-semibold text-white/90 transition hover:text-chadi-gold"
              >
                See our projects
                <FaArrowRight className="transition group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-16 flex gap-10 border-t border-white/15 pt-6 text-white/70">
              <div>
                <p className="font-serif text-3xl text-white">2021</p>
                <p className="mt-1 text-xs uppercase tracking-wide">Founded</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-white">6</p>
                <p className="mt-1 text-xs uppercase tracking-wide">Active programs</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-white">4</p>
                <p className="mt-1 text-xs uppercase tracking-wide">States reached</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="flex items-end justify-center lg:justify-end"
          >
            <img
              src={heroImage}
              alt="CHADI International field work"
              className="h-[70vh] w-auto object-contain sm:h-[78vh] lg:h-[85vh]"
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-chadi-cream/0 via-chadi-ink/0 to-transparent" />

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </section>
  );
}

export default Hero;
