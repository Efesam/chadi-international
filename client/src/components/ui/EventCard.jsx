import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

function EventCard({ event }) {
  return (
    <div className="group h-full overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-48 overflow-hidden bg-chadi-green">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/60">
            <FaCalendarAlt size={40} />
          </div>
        )}

        {event.type && (
          <span className="absolute left-5 top-5 rounded-full bg-chadi-gold px-4 py-2 text-sm font-bold text-black">
            {event.type}
          </span>
        )}
      </div>

      <div className="space-y-3 p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-gray-500">
          <span className="flex items-center gap-1.5">
            <FaCalendarAlt size={12} className="text-chadi-green" />
            {event.date}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
              <FaMapMarkerAlt size={12} className="text-chadi-green" />
              {event.location}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-chadi-green">{event.title}</h3>

        {event.description && <p className="leading-7 text-gray-600">{event.description}</p>}
      </div>
    </div>
  );
}

export default EventCard;
