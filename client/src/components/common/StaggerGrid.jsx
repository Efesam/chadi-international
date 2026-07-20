import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

/**
 * Wraps a grid/list of cards so they reveal one after another as the
 * section scrolls into view, instead of all appearing at once. Wrap each
 * card in <StaggerItem> inside this.
 */
function StaggerGrid({ children, className = "" }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={container}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}

export default StaggerGrid;
