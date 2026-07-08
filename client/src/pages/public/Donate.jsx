import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { recordDonationInterest } from "../../services/api";

function Donate() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setStatus("Saving...");

    try {
      await recordDonationInterest(Object.fromEntries(formData.entries()));
      event.currentTarget.reset();
      setStatus("Thanks. CHADI will contact you with donation details.");
    } catch {
      setStatus("We could not save this right now. Please use the contact page.");
    }
  };

  return (
    <>
      <PageHeader
        title="Donate"
        subtitle="Support CHADI's work with underserved communities."
      />

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold text-chadi-green">
              Help Sustain Community Impact
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Your donation helps CHADI provide nutrition education, learning
              support, emergency relief, youth development and community
              wellbeing programs.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-chadi-cream p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-chadi-green">
              Donation Interest
            </h3>
            <p className="mt-4 text-gray-600">
              Share your details and CHADI will follow up with current donation
              channels and partnership options.
            </p>

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
              <option>One-time donation</option>
              <option>Monthly support</option>
              <option>Corporate sponsorship</option>
              <option>Program partnership</option>
            </select>

            <button
              type="submit"
              className="mt-8 rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
            >
              Submit Interest
            </button>

            <Link
              to="/contact"
              className="ml-4 inline-block font-semibold text-chadi-green hover:text-chadi-gold"
            >
              Contact instead
            </Link>

            {status && (
              <p className="mt-4 font-semibold text-chadi-green">{status}</p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

export default Donate;
