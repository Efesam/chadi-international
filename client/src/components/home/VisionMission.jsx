import { motion } from "framer-motion";
import { FaBullseye, FaEye } from "react-icons/fa";
import Reveal from "../common/Reveal";

function VisionMission() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <Reveal>
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-chadi-green sm:text-5xl">
              Our Purpose
            </h2>

            <p className="mt-5 text-lg text-gray-600">
              Creating lasting impact by empowering marginalized individuals and
              underserved communities.
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
                Vision
              </h3>

              <p className="text-lg leading-8">
                Empowering marginalized individuals and underserved communities
                through sustainable development, innovation, education,
                healthcare and humanitarian interventions.
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
                Mission
              </h3>

              <p className="text-lg leading-8 text-gray-800">
                To design and implement innovative programs that improve health,
                education, livelihoods, environmental sustainability, peace,
                technology access and community resilience across Africa.
              </p>
            </motion.div>
          </Reveal>

        </div>

      </div>
    </section>
  );
}

export default VisionMission;
