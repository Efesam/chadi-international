import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import CardGridSkeleton from "../../components/common/CardGridSkeleton";
import { useCollection } from "../../hooks/useCollection";
import { eventsApi } from "../../services/api";

function Events() {
  const { data: events, loading, error } = useCollection(eventsApi.list);

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Upcoming outreach, training and community engagement activities."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <CardGridSkeleton count={3} columns={3} />
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500">No events scheduled right now. Check back soon.</p>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-xl border border-chadi-lightgreen bg-chadi-cream p-8 shadow-sm"
                >
                  <span className="rounded-full bg-chadi-gold px-4 py-2 text-sm font-bold text-black">
                    {event.type}
                  </span>
                  <h2 className="mt-6 text-2xl font-bold text-chadi-green">
                    {event.title}
                  </h2>
                  <p className="mt-3 font-semibold text-gray-700">
                    {event.date}
                  </p>
                  <p className="mt-1 text-gray-600">{event.location}</p>
                  <p className="mt-5 leading-7 text-gray-600">
                    {event.description}
                  </p>
                </article>
              ))}
            </div>
          )}

          <div className="mt-14 rounded-xl bg-chadi-green p-8 text-white">
            <h2 className="text-3xl font-bold">Host or support an event</h2>
            <p className="mt-4 max-w-3xl text-white/85">
              CHADI collaborates with communities, schools, health teams and
              sponsors to deliver practical field activities.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-block rounded-lg bg-chadi-gold px-6 py-3 font-semibold text-black"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Events;
