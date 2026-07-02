import { motion } from "framer-motion";
import {
  FaUsers,
  FaHandsHelping,
  FaGlobeAfrica,
  FaSchool,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers />,
    number: "25,000+",
    title: "Lives Impacted",
    description: "Individuals reached through our community programs.",
  },
  {
    icon: <FaSchool />,
    number: "120+",
    title: "Schools Supported",
    description: "Educational institutions strengthened and equipped.",
  },
  {
    icon: <FaHandsHelping />,
    number: "350+",
    title: "Volunteers",
    description: "Dedicated volunteers serving across communities.",
  },
  {
    icon: <FaGlobeAfrica />,
    number: "18",
    title: "Communities",
    description: "Local communities benefiting from our initiatives.",
  },
];

function ImpactCounter() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <span className="font-semibold uppercase tracking-[4px] text-chadi-gold">
            Our Impact
          </span>

          <h2 className="mt-4 text-4xl font-bold text-chadi-green">
            Creating Sustainable Change
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
            Every project we undertake contributes to stronger communities,
            better education, improved healthcare and sustainable livelihoods.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
              }}
              className="rounded-3xl border border-gray-100 bg-chadi-cream p-8 shadow-lg transition hover:-translate-y-3 hover:shadow-2xl"
            >
              <div className="mb-6 inline-flex rounded-full bg-chadi-green p-5 text-4xl text-white">
                {stat.icon}
              </div>

              <h3 className="text-4xl font-black text-chadi-green">
                {stat.number}
              </h3>

              <h4 className="mt-3 text-xl font-semibold">
                {stat.title}
              </h4>

              <p className="mt-4 text-gray-600">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactCounter;