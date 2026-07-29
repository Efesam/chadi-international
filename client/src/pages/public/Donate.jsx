import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import { recordDonationInterest } from "../../services/api";
import DonateModal from "../../components/common/DonateModal";
import Reveal from "../../components/common/Reveal";
import Newsletter from "../../components/common/Newsletter";
import Honeypot from "../../components/common/Honeypot";
import ImpactCalculator from "../../components/common/ImpactCalculator";

function InterestForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitting(true);

    try {
      await recordDonationInterest(Object.fromEntries(formData.entries()));
      form.reset();
      toast.success("Thanks. CHADI will contact you with details.");
    } catch {
      toast.error("We could not save this right now. Please use the contact page.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-chadi-cream p-8 shadow-lg"
    >
      <h3 className="text-2xl font-bold text-chadi-green">Other Ways to Give</h3>
      <p className="mt-4 text-gray-600">
        Interested in corporate sponsorship or a program
        partnership? Share your details and CHADI will follow up.
      </p>

      <Honeypot />
      <input
        className="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        name="name"
        placeholder="Full name"
        required
      />
      <input
        className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        name="email"
        type="email"
        placeholder="Email address"
        required
      />
      <select
        className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
        name="interest"
        defaultValue=""
        required
      >
        <option value="" disabled>
          Donation interest
        </option>
        <option>Corporate sponsorship</option>
        <option>Program partnership</option>
        <option>In-kind donation</option>
      </select>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-chadi-gold hover:text-black disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Submit Interest"}
      </button>

      <Link
        to="/contact"
        className="ml-4 inline-block font-semibold text-chadi-green hover:text-chadi-gold-dark"
      >
        Contact instead
      </Link>
    </form>
  );
}

function Donate() {
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <>
      <Seo
        title="Donate"
        path="/donate"
        description="Support CHADI International's work with underserved communities through a secure online donation."
      />

      <PageHeader
        title="Donate"
        subtitle="Support CHADI's work with underserved communities."
      />

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
          <Reveal direction="left">
            <div>
              <h2 className="text-3xl font-bold text-chadi-green sm:text-4xl">
                Help Sustain Community Impact
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Your donation helps CHADI provide nutrition education, learning
                support, emergency relief, youth development and community
                wellbeing programs.
              </p>

              <button
                type="button"
                onClick={() => setDonateOpen(true)}
                className="mt-8 rounded-full bg-chadi-green px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-chadi-gold hover:text-black"
              >
                Donate Now
              </button>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.15}>
            <div className="space-y-8">
              <InterestForm />
            </div>
          </Reveal>
        </div>
      </section>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />

      <ImpactCalculator />

      <Newsletter />
    </>
  );
}

export default Donate;
