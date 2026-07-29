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
 * just popping in immediately on page load. Renders a <motion.div> by
 * default; pass `as="form"` (or any intrinsic tag) plus that element's own
 * props (e.g. onSubmit) when the animated wrapper needs to be that element
 * itself rather than an extra wrapping div.
 */
function Reveal({ children, direction = "up", delay = 0, duration = 0.6, className = "", as = "div", ...rest }) {
  const offset = DIRECTIONS[direction] || DIRECTIONS.up;
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
