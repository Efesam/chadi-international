import { motion } from "framer-motion";

function PageHeader({ title, subtitle }) {
  return (
    <section className="bg-chadi-green pt-36 pb-24 text-white">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-black md:text-6xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mx-auto mt-6 max-w-3xl text-lg text-gray-200"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}

export default PageHeader;