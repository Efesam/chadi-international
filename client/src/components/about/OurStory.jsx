import { FaArrowRight } from "react-icons/fa";
import aboutImage from "../../assets/about.jpg";
import Reveal from "../common/Reveal";

function OurStory() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        <Reveal direction="left" className="relative">
          <img
            src={aboutImage}
            alt="CHADI Community Outreach"
            loading="lazy"
            className="w-full rounded-3xl shadow-xl"
          />
          <div className="absolute bottom-2 right-2 flex h-24 w-24 items-center justify-center rounded-full bg-chadi-green p-4 text-center text-xs font-bold uppercase leading-tight tracking-wide text-white shadow-xl sm:-bottom-6 sm:-right-6 sm:h-32 sm:w-32 sm:text-sm">
            Hope Alive
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.15}>

          <span className="font-semibold uppercase tracking-widest text-chadi-gold-dark">
            About CHADI
          </span>

          <h2 className="mt-4 text-4xl font-bold text-chadi-green sm:text-5xl">
            Empowering Lives.
            <br />
            Transforming Communities.
          </h2>

          <p className="mt-8 leading-8 text-gray-600">
            Caleb Hope Alive Development Initiative (CHADI) is a
            non-profit organization dedicated to empowering
            marginalized individuals and underserved communities
            across Nigeria through sustainable development,
            education, healthcare, innovation, and humanitarian
            interventions.
          </p>

          <p className="mt-6 leading-8 text-gray-600">
            We believe every individual deserves dignity,
            opportunity, quality healthcare, education,
            and hope regardless of where they live or
            the circumstances surrounding them.
          </p>

          <blockquote className="mt-8 border-l-4 border-chadi-green pl-6 text-lg italic leading-relaxed text-gray-700">
            &ldquo;We restore dignity, create opportunity, and bring hope
            alive &mdash; through action.&rdquo;
          </blockquote>

          <a
            href="#journey"
            className="group mt-8 inline-flex items-center gap-2 font-semibold text-chadi-green transition hover:text-chadi-gold-dark"
          >
            Read our story
            <FaArrowRight size={14} className="transition group-hover:translate-x-1" />
          </a>

        </Reveal>

      </div>
    </section>
  );
}

export default OurStory;
