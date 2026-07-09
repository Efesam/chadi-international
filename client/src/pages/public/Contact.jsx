import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { sendContactMessage, getSettings } from "../../services/api";
import { useCollection } from "../../hooks/useCollection";

function Contact() {
  const [status, setStatus] = useState("");
  const { data: settings } = useCollection(getSettings);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setStatus("Sending...");

    try {
      await sendContactMessage(Object.fromEntries(formData.entries()));
      event.currentTarget.reset();
      setStatus("Message sent. CHADI will follow up soon.");
    } catch {
      setStatus("Message could not be sent right now. Please try again.");
    }
  };

  return (
    <>
      <PageHeader
        title="Contact CHADI"
        subtitle="Reach out for partnerships, volunteering, donations and program inquiries."
      />

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-4xl font-bold text-chadi-green">
              Let us hear from you
            </h2>
            <p className="mt-6 leading-8 text-gray-600">
              CHADI works with communities, volunteers, donors and partners to
              deliver programs where they are needed most.
            </p>

            <div className="mt-10 space-y-5">
              <div>
                <p className="font-semibold text-chadi-green">Email</p>
                <p className="text-gray-600">
                  {settings?.contactEmail || "info@chadiinternational.org"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-chadi-green">Focus Region</p>
                <p className="text-gray-600">
                  {settings?.focusRegion || "Nigeria and underserved African communities"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-chadi-green">Office Hours</p>
                <p className="text-gray-600">
                  {settings?.officeHours || "Monday to Friday, 9:00 AM - 5:00 PM"}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-chadi-cream p-8 shadow-lg lg:col-span-2"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="font-semibold text-gray-700">Full Name</span>
                <input
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                  type="text"
                  name="name"
                  required
                />
              </label>

              <label className="block">
                <span className="font-semibold text-gray-700">Email</span>
                <input
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                  type="email"
                  name="email"
                  required
                />
              </label>
            </div>

            <label className="mt-6 block">
              <span className="font-semibold text-gray-700">Subject</span>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                type="text"
                name="subject"
                required
              />
            </label>

            <label className="mt-6 block">
              <span className="font-semibold text-gray-700">Message</span>
              <textarea
                className="mt-2 min-h-40 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
                name="message"
                required
              />
            </label>

            <button
              type="submit"
              className="mt-8 rounded-lg bg-chadi-green px-8 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
            >
              Send Message
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

export default Contact;
