import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCollection } from "../../hooks/useCollection";
import { eventsApi } from "../../services/api";
import CardGridSkeleton from "../common/CardGridSkeleton";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";
import EventCard from "../ui/EventCard";

function UpcomingEvents() {
  const { t, i18n } = useTranslation();
  const { data, loading } = useCollection(() => eventsApi.list(i18n.language), [i18n.language]);
  const events = (data || []).slice(0, 3);

  if (!loading && events.length === 0) return null;

  return (
    <section className="bg-white py-16 dark:bg-gray-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="font-semibold uppercase tracking-widest text-chadi-gold-dark dark:text-chadi-gold">
              {t("home.upcomingEvents.eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-bold text-chadi-green dark:text-chadi-lightgreen">
              {t("home.upcomingEvents.title")}
            </h2>
          </div>
        </Reveal>

        {loading ? (
          <CardGridSkeleton count={3} columns={3} />
        ) : (
          <StaggerGrid className="grid gap-6 lg:grid-cols-3">
            {events.map((event) => (
              <StaggerItem key={event.id}>
                <EventCard event={event} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}

        <Reveal delay={0.2}>
          <div className="mt-10 text-center">
            <Link
              to="/events"
              className="inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:scale-105"
            >
              {t("home.upcomingEvents.seeEvents")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default UpcomingEvents;
