import { useState } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import { sendContactMessage, getSettings } from "../../services/api";
import { useCollection } from "../../hooks/useCollection";
import Reveal from "../../components/common/Reveal";
import Newsletter from "../../components/common/Newsletter";
import contactImage from "../../assets/projects/women-business.jpg";

const socialIcons = {
  facebook: FaFacebookF,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
};

function Contact() {
  const [sending, setSending] = useState(false);
  const { data: settings } = useCollection(getSettings);
  const socials = settings?.socials || {};
  const activeSocials = Object.entries(socials).filter(([, url]) => url);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSending(true);

    try {
      await sendContactMessage(Object.fromEntries(formData.entries()));
      form.reset();
      toast.success("Message sent. CHADI will follow up soon.");
    } catch {
      toast.error("Message could not be sent right now. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Seo
        title="Contact Us"
        path="/contact"
        description="Get in touch with CHADI International for partnerships, volunteering, donations and program inquiries."
      />

      <PageHeader
        title="Contact CHADI"
        subtitle="Reach out for partnerships, volunteering, donations and program inquiries."
      />

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-5">
          <Reveal
            direction="left"
            className="relative overflow-hidden rounded-3xl bg-chadi-green bg-cover bg-center p-8 text-white lg:col-span-2"
            style={{ backgroundImage: `url(${contactImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-chadi-green/85 via-chadi-green/90 to-chadi-green/95" />

            <div className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Let us hear from you
              </h2>
              <p className="mt-6 leading-8 text-white/85">
                CHADI works with communities, volunteers, donors and partners to
                deliver programs where they are needed most.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <FaEnvelope size={16} />
                  </span>
                  <div>
                    <p className="font-semibold text-chadi-gold">Email</p>
                    <p className="text-white/85">
                      {settings?.contactEmail || "info@chadiinternational.org"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <FaMapMarkerAlt size={16} />
                  </span>
                  <div>
                    <p className="font-semibold text-chadi-gold">Focus Region</p>
                    <p className="text-white/85">
                      {settings?.focusRegion || "Nigeria and underserved African communities"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <FaClock size={16} />
                  </span>
                  <div>
                    <p className="font-semibold text-chadi-gold">Office Hours</p>
                    <p className="text-white/85">
                      {settings?.officeHours || "Monday to Friday, 9:00 AM - 5:00 PM"}
                    </p>
                  </div>
                </div>
              </div>

              {activeSocials.length > 0 && (
                <div className="mt-10 flex gap-3 border-t border-white/15 pt-8">
                  {activeSocials.map(([platform, url]) => {
                    const Icon = socialIcons[platform];
                    if (!Icon) return null;

                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`CHADI International on ${platform}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition hover:bg-chadi-gold hover:text-black"
                      >
                        <Icon size={14} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.15} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-chadi-cream p-8 shadow-lg"
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
                disabled={sending}
                className="mt-8 rounded-lg bg-chadi-green px-8 py-3 font-semibold text-white transition hover:scale-105 hover:bg-chadi-gold hover:text-black disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default Contact;
