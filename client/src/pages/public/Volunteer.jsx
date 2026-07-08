import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { submitVolunteerApplication } from "../../services/api";

function Volunteer() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setStatus("Submitting...");

    try {
      await submitVolunteerApplication(Object.fromEntries(formData.entries()));
      event.currentTarget.reset();
      setStatus("Application received. CHADI will reach out soon.");
    } catch {
      setStatus("We could not submit this right now. Please try again.");
    }
  };

  return (
    <>
      <PageHeader
        title="Volunteer"
        subtitle="Use your skills, time and compassion to support CHADI communities."
      />

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-3">
          <div>
            <h2 className="text-4xl font-bold text-chadi-green">
              Volunteer Areas
            </h2>
            <ul className="mt-6 space-y-4 leading-7 text-gray-600">
              <li>Community outreach and mobilization</li>
              <li>Health and nutrition education</li>
              <li>Digital skills and mentorship</li>
              <li>Media, communications and storytelling</li>
              <li>Research, monitoring and evaluation</li>
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-chadi-cream p-8 shadow-lg lg:col-span-2"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <input
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                name="name"
                placeholder="Full name"
                required
              />
              <input
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                name="email"
                type="email"
                placeholder="Email address"
                required
              />
              <input
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                name="phone"
                placeholder="Phone number"
              />
              <input
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                name="location"
                placeholder="Location"
              />
            </div>

            <select
              className="mt-5 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              name="area"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Area of interest
              </option>
              <option>Community outreach</option>
              <option>Health and nutrition</option>
              <option>Education and mentoring</option>
              <option>Media and communications</option>
              <option>Research and data</option>
            </select>

            <textarea
              className="mt-5 min-h-36 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
              name="message"
              placeholder="Tell us about your experience or motivation"
            />

            <button
              type="submit"
              className="mt-6 rounded-lg bg-chadi-green px-8 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
            >
              Submit Application
            </button>

            {status && (
              <p className="mt-4 font-semibold text-chadi-green">{status}</p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

export default Volunteer;
