import { statistics } from "../../data/statistics";
import StatCard from "../ui/StatCard";

function ImpactCounter() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Our Impact in Numbers
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600">
            Every project represents lives transformed and communities empowered.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {statistics.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactCounter;