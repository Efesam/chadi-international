import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { recordDonationInterest } from "../../services/api";
import DonateModal from "../../components/common/DonateModal";

function InterestForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("Saving...");

    try {
      await recordDonationInterest(Object.fromEntries(formData.entries()));
      form.reset();
      setStatus("Thanks. CHADI will contact you with details.");
    } catch {
      setStatus("We could not save this right now. Please use the contact page.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-chadi-ink/10 p-8">
      <h3 className="font-serif text-2xl text-chadi-ink">Other Ways to Give</h3>
      <p className="mt-3 leading-7 text-chadi-ink/60">
        Interested in monthly giving, corporate sponsorship or a program
        partnership? Share your details and CHADI will follow up.
      </p>

      <input
        className="mt-6 w-full border border-chadi-ink/15 px-4 py-3 outline-none focus:border-chadi-green"
        name="name"
        placeholder="Full name"
        required
      />
      <input
        className="mt-4 w-full border border-chadi-ink/15 px-4 py-3 outline-none focus:border-chadi-green"
        name="email"
        type="email"
        placeholder="Email address"
        required
      />
      <select
        className="mt-4 w-full border border-chadi-ink/15 px-4 py-3 outline-none focus:border-chadi-green"
        name="interest"
        defaultValue=""
        required
      >
        <option value="" disabled>
          Donation interest
        </option>
        <option>Monthly support</option>
        <option>Corporate sponsorship</option>
        <option>Program partnership</option>
      </select>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-chadi-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-chadi-green"
        >
          Submit Interest
        </button>

        <Link
          to="/contact"
          className="text-sm font-semibold text-chadi-green hover:text-chadi-ink"
        >
          Contact instead
        </Link>
      </div>

      {status && (
        <p className="mt-4 text-sm font-semibold text-chadi-green">{status}</p>
      )}
    </form>
  );
}

function Donate() {
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Donate"
        subtitle="Support CHADI's work with underserved communities."
      />

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl leading-tight text-chadi-ink">
              Help Sustain Community Impact
            </h2>
            <p className="mt-6 text-lg leading-8 text-chadi-ink/60">
              Your donation helps CHADI provide nutrition education, learning
              support, emergency relief, youth development and community
              wellbeing programs.
            </p>

            <button
              type="button"
              onClick={() => setDonateOpen(true)}
              className="mt-8 rounded-full bg-chadi-green px-8 py-4 font-semibold text-white transition hover:bg-chadi-ink"
            >
              Donate Now
            </button>
          </div>

          <InterestForm />
        </div>
      </section>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}

export default Donate;
