import { testimonials } from "../../data/testimonials";

function SuccessStories() {
  return (
    <section className="bg-chadi-cream py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900">
          Success Stories
        </h2>

        <p className="mt-4 text-lg text-gray-600">
          Inspiring stories of lives transformed through CHADI International's
          programs and community initiatives.
        </p>

        <div className="mt-14 grid gap-8 text-left md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.name}
              className="rounded-2xl bg-white p-8 shadow-sm"
            >
              <p className="leading-7 text-gray-600">"{testimonial.quote}"</p>
              <footer className="mt-6">
                <p className="font-bold text-chadi-green">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SuccessStories;
