import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { eventsApi } from "../../services/api";
import CardGridSkeleton from "../common/CardGridSkeleton";

function UpcomingEvents() {
  const { data, loading } = useCollection(eventsApi.list);
  const events = (data || []).slice(0, 3);

  if (!loading && events.length === 0) return null;

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

        {loading ? (
          <CardGridSkeleton count={3} columns={3} />
        ) : (
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
        )}

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
