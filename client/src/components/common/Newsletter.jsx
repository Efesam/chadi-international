import { useState } from "react";
import { subscribeToNewsletter } from "../../services/api";
import Reveal from "./Reveal";
import newsletterImage from "../../assets/projects/sorces-classroom-1.jpg";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Sending...");

    try {
      await subscribeToNewsletter({ email });
      setEmail("");
      setStatus("Thanks for subscribing.");
    } catch {
      setStatus("We could not subscribe you right now. Please try again.");
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-chadi-green bg-cover bg-center py-20 text-white"
      style={{ backgroundImage: `url(${newsletterImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-chadi-green/75 via-chadi-green/85 to-chadi-green/90" />
      <Reveal className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-bold">
          Stay Updated
        </h2>

        <p className="mt-4 text-lg text-gray-200">
          Subscribe to receive updates on our projects, events and impact stories.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex max-w-xl flex-col gap-4 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 rounded-xl px-5 py-4 text-black outline-none"
          />

          <button
            type="submit"
            className="rounded-xl bg-chadi-gold px-8 py-4 font-semibold text-black transition hover:scale-105"
          >
            Subscribe
          </button>
        </form>

        {status && (
          <p className="mt-4 text-sm font-semibold text-chadi-lightgreen">
            {status}
          </p>
        )}
      </Reveal>
    </section>
  );
}

export default Newsletter;
