import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import CardGridSkeleton from "../../components/common/CardGridSkeleton";
import Reveal from "../../components/common/Reveal";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import EventCard from "../../components/ui/EventCard";
import { useCollection } from "../../hooks/useCollection";
import { eventsApi } from "../../services/api";
import Newsletter from "../../components/common/Newsletter";
import ctaImage from "../../assets/projects/sorcest.jpg";

function Events() {
  const { t, i18n } = useTranslation();
  const { data, loading, error } = useCollection(() => eventsApi.list(i18n.language), [i18n.language]);
  const events = data || [];
  const [type, setType] = useState("All");

  const types = ["All", ...new Set(events.map((event) => event.type).filter(Boolean))];
  const filteredEvents = type === "All" ? events : events.filter((event) => event.type === type);

  return (
    <>
      <Seo
        title={t("events.seoTitle")}
        path="/events"
        description={t("events.seoDescription")}
      />

      <PageHeader
        title={t("events.title")}
        subtitle={t("events.subtitle")}
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <CardGridSkeleton count={3} columns={3} />
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">{t("events.empty")}</p>
          ) : (
            <>
              {types.length > 2 && (
                <Reveal className="mb-10 flex flex-wrap gap-3">
                  {types.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setType(item)}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        type === item
                          ? "bg-chadi-green text-white"
                          : "bg-gray-100 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {item === "All" ? t("events.allFilter") : item}
                    </button>
                  ))}
                </Reveal>
              )}

              {filteredEvents.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">{t("events.noMatch")}</p>
              ) : (
                <StaggerGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <StaggerItem key={event.id}>
                      <EventCard event={event} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              )}
            </>
          )}

          <Reveal
            className="relative mt-14 overflow-hidden rounded-xl bg-chadi-green bg-cover bg-center p-8 text-white"
            style={{ backgroundImage: `url(${ctaImage})` }}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-chadi-green/95 via-chadi-green/85 to-chadi-green/60" />
            <div className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">{t("events.cta.title")}</h2>
              <p className="mt-4 max-w-3xl text-white/85">
                {t("events.cta.description")}
              </p>
              <Link
                to="/contact"
                className="mt-8 inline-block rounded-lg bg-chadi-gold px-6 py-3 font-semibold text-black"
              >
                {t("events.cta.button")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default Events;
