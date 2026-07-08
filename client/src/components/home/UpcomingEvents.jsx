import { Link } from "react-router-dom";
import { events } from "../../data/events";

function UpcomingEvents() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-widest text-chadi-gold">
            Events
          </p>
          <h2 className="mt-3 text-4xl font-bold text-chadi-green">
            Upcoming Activities
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="rounded-xl bg-chadi-cream p-6 shadow-sm"
            >
              <p className="font-semibold text-chadi-gold">{event.date}</p>
              <h3 className="mt-3 text-2xl font-bold text-chadi-green">
                {event.title}
              </h3>
              <p className="mt-2 text-gray-600">{event.location}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/events"
            className="inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white"
          >
            See Events
          </Link>
        </div>
      </div>
    </section>
  );
}

export default UpcomingEvents;
