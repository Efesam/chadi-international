import aboutImage from "../../assets/about.jpg";
import Reveal from "../common/Reveal";

function OurStory() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        <Reveal direction="left">
          <img
            src={aboutImage}
            alt="CHADI Community Outreach"
            loading="lazy"
            className="rounded-3xl shadow-xl"
          />
        </Reveal>

        <Reveal direction="right" delay={0.15}>

          <span className="font-semibold uppercase tracking-widest text-chadi-gold-dark">
            Our Story
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

        </Reveal>

      </div>
    </section>
  );
}

export default OurStory;
