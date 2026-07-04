function Newsletter() {
  return (
    <section className="bg-chadi-green py-20 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-bold">
          Stay Updated
        </h2>

        <p className="mt-4 text-lg text-gray-200">
          Subscribe to receive updates on our projects, events and impact stories.
        </p>

        <form className="mx-auto mt-10 flex max-w-xl flex-col gap-4 sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-xl px-5 py-4 text-black outline-none"
          />

          <button
            className="rounded-xl bg-chadi-gold px-8 py-4 font-semibold text-black transition hover:scale-105"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;