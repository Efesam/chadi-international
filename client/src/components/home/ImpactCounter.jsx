import CountUp from "react-countup";
import { useCollection } from "../../hooks/useCollection";
import { getSettings } from "../../services/api";

function ImpactCounter() {
  const { data: settings, loading } = useCollection(getSettings);
  const stats = settings?.stats || [];

  return (
    <section className="bg-chadi-ink py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[4px] text-chadi-gold">
          The Numbers So Far
        </p>

        {loading ? (
          <p className="mt-8 text-white/50">Loading...</p>
        ) : (
          <div className="mt-8 grid gap-10 divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="pt-8 first:pt-0 sm:pt-0 sm:first:pl-0 sm:pl-10">
                <p className="font-serif text-5xl text-white">
                  <CountUp end={Number(stat.value) || 0} duration={2} separator="," />
                  <span className="text-chadi-gold">+</span>
                </p>
                <p className="mt-2 text-sm uppercase tracking-wide text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ImpactCounter;
