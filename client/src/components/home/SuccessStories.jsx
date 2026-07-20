import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { testimonials } from "../../data/testimonials";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";

function SuccessStories() {
  return (
    <section className="overflow-hidden bg-chadi-cream py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <h2 className="text-4xl font-bold text-gray-900">
            Success Stories
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-4 text-lg text-gray-600">
            Inspiring stories of lives transformed through CHADI International's
            programs and community initiatives.
          </p>
        </Reveal>

        <StaggerGrid className="mt-14 grid gap-8 text-left md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <motion.blockquote
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative h-full rounded-2xl bg-white p-8 shadow-sm hover:shadow-xl"
              >
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block text-chadi-gold"
                >
                  <FaQuoteLeft size={22} />
                </motion.span>

                <p className="mt-4 leading-7 text-gray-600">"{testimonial.quote}"</p>
                <footer className="mt-6">
                  <p className="font-bold text-chadi-green">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </footer>
              </motion.blockquote>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

export default SuccessStories;
