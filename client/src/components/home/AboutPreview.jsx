import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import aboutImage from "../../assets/about.jpg";

function AboutPreview() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <motion.img
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          src={aboutImage}
          alt="About CHADI"
          className="rounded-3xl shadow-2xl"
        />

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-semibold uppercase tracking-[4px] text-chadi-gold">
            ABOUT US
          </span>

          <h2 className="mt-5 text-5xl font-black text-chadi-green">
            Creating Sustainable Impact Across Communities
          </h2>

          <p className="mt-8 leading-8 text-gray-600">
            CHADI International is a nonprofit organization dedicated to
            improving lives through education, healthcare, innovation,
            environmental sustainability, humanitarian assistance and youth
            empowerment.
          </p>

          <p className="mt-6 leading-8 text-gray-600">
            We believe lasting change happens when communities become active
            participants in their own development.
          </p>

          <Link
            to="/about"
            className="mt-10 inline-block rounded-xl bg-chadi-green px-8 py-4 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutPreview;