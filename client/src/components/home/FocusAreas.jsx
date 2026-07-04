import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaHeartbeat,
  FaLeaf,
  FaLaptopCode,
  FaHandsHelping,
  FaUsers,
} from "react-icons/fa";

const focusAreas = [
  {
    icon: <FaGraduationCap />,
    title: "Education",
    description:
      "Improving access to quality education, literacy and lifelong learning opportunities.",
  },
  {
    icon: <FaHeartbeat />,
    title: "Healthcare",
    description:
      "Strengthening healthcare systems and improving community well-being.",
  },
  {
    icon: <FaLeaf />,
    title: "Environment",
    description:
      "Promoting climate action, conservation and sustainable environmental practices.",
  },
  {
    icon: <FaLaptopCode />,
    title: "Innovation",
    description:
      "Leveraging technology and innovation to solve social and economic challenges.",
  },
  {
    icon: <FaHandsHelping />,
    title: "Humanitarian Support",
    description:
      "Providing emergency relief and long-term support for vulnerable populations.",
  },
  {
    icon: <FaUsers />,
    title: "Youth Empowerment",
    description:
      "Creating opportunities for leadership, entrepreneurship and skills development.",
  },
];

function FocusAreas() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black text-chadi-green">
            Our Focus Areas
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-gray-600">
            CHADI International develops sustainable solutions that improve
            lives and strengthen communities through integrated development
            programmes.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {focusAreas.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -12,
                scale: 1.03,
              }}
              transition={{ duration: 0.3 }}
              className="group rounded-3xl border border-gray-100 bg-chadi-cream p-10 shadow-lg transition"
            >
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-chadi-green text-4xl text-white transition group-hover:bg-chadi-gold group-hover:text-black">
                {item.icon}
              </div>

              <h3 className="mb-4 text-2xl font-bold text-chadi-green">
                {item.title}
              </h3>

              <p className="leading-8 text-gray-600">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FocusAreas;