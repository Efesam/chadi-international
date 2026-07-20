import { motion } from "framer-motion";

const DIRECTIONS = {
  up: { y: 32, x: 0 },
  down: { y: -32, x: 0 },
  left: { y: 0, x: 32 },
  right: { y: 0, x: -32 },
  none: { y: 0, x: 0 },
};

/**
 * Fades and slides an element in as it scrolls into view. Used site-wide
 * for a consistent "content arrives gently" feel instead of everything
 * just popping in immediately on page load.
 */
function Reveal({ children, direction = "up", delay = 0, duration = 0.6, className = "" }) {
  const offset = DIRECTIONS[direction] || DIRECTIONS.up;

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
