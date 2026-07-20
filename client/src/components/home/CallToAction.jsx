import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DonateModal from "../common/DonateModal";
import Reveal from "../common/Reveal";

function CallToAction() {
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <section className="bg-chadi-green py-20 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 lg:flex-row lg:items-center">
        <Reveal direction="left">
          <div>
            <h2 className="text-4xl font-bold">
              Ready to support lasting community impact?
            </h2>
            <p className="mt-4 max-w-3xl text-white/85">
              Volunteer, partner, donate or invite CHADI into a community need
              that deserves practical action.
            </p>
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.15}>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/volunteer"
              className="rounded-lg bg-chadi-gold px-6 py-3 font-semibold text-black transition hover:scale-105"
            >
              Volunteer
            </Link>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setDonateOpen(true)}
              className="rounded-lg border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-chadi-green"
            >
              Donate
            </motion.button>
          </div>
        </Reveal>
      </div>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </section>
  );
}

export default CallToAction;
