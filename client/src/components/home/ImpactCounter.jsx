import { FaProjectDiagram, FaUsers, FaHandsHelping, FaGlobeAfrica } from "react-icons/fa";
import { useCollection } from "../../hooks/useCollection";
import { getSettings } from "../../services/api";
import StatCard from "../ui/StatCard";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";

// Stats content (labels/numbers) comes from the CMS settings; icons stay
// fixed locally since they aren't serializable through the API.
const icons = [FaProjectDiagram, FaUsers, FaHandsHelping, FaGlobeAfrica];

function ImpactCounter() {
  const { data: settings, loading } = useCollection(getSettings);
  const stats = settings?.stats || [];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Our Impact in Numbers
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600">
              Every project represents lives transformed and communities empowered.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <StaggerGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StaggerItem key={stat.label}>
                <StatCard
                  stat={{
                    number: stat.value,
                    suffix: "+",
                    label: stat.label,
                    icon: icons[index % icons.length],
                  }}
                />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </section>
  );
}

export default ImpactCounter;
