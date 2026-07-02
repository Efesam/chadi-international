import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

import aboutImage from "../../assets/about.jpg";

function AboutPreview() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

        {/* LEFT IMAGE */}

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .8 }}
        >
          <img
            src={aboutImage}
            alt="About CHADI"
            className="h-[650px] w-full rounded-3xl object-cover shadow-2xl"
          />
        </motion.div>

        {/* RIGHT */}

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .8 }}
        >

          <span className="font-semibold uppercase tracking-[4px] text-chadi-gold">
            About Us
          </span>

          <h2 className="mt-5 text-5xl font-black text-chadi-green">
            Transforming Communities Through Action
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            CHADI International is a humanitarian and development
            organization committed to creating sustainable solutions
            that improve lives through education, healthcare,
            climate action, innovation, youth empowerment and
            humanitarian assistance.
          </p>

          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-4">
              <FaCheckCircle className="text-2xl text-chadi-green" />
              <p>Community Development Programs</p>
            </div>

            <div className="flex items-center gap-4">
              <FaCheckCircle className="text-2xl text-chadi-green" />
              <p>Quality Education Initiatives</p>
            </div>

            <div className="flex items-center gap-4">
              <FaCheckCircle className="text-2xl text-chadi-green" />
              <p>Healthcare & Humanitarian Support</p>
            </div>

            <div className="flex items-center gap-4">
              <FaCheckCircle className="text-2xl text-chadi-green" />
              <p>Environmental Sustainability</p>
            </div>

          </div>

          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-3 rounded-xl bg-chadi-green px-8 py-4 font-semibold text-white transition hover:bg-green-900"
          >
            Learn More

            <FaArrowRight />

          </Link>

        </motion.div>

      </div>
    </section>
  );
}

export default AboutPreview;
