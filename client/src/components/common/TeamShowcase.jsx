import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { teamApi } from "../../services/api";
import Reveal from "./Reveal";
import StaggerGrid, { StaggerItem } from "./StaggerGrid";
import CardGridSkeleton from "./CardGridSkeleton";
import bgImage from "../../assets/projects/help.jpg";

function TeamPreviewCard({ member }) {
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
      <div className="h-56 overflow-hidden">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-chadi-green to-[#1c3d16] text-4xl font-bold tracking-wide text-white/90">
            {initials}
          </div>
        )}
      </div>
      <div className="p-5 text-center">
        <h3 className="font-bold text-chadi-green">{member.name}</h3>
        <p className="mt-1 text-sm text-chadi-gold-dark">{member.role}</p>
      </div>
    </div>
  );
}

/**
 * A "meet the team" teaser used on both the homepage and About page -
 * pulls real, admin-editable team data (featured members if any are marked,
 * otherwise the first few) instead of being a plain CTA with no faces.
 */
function TeamShowcase({ limit = 4 }) {
  const { data, loading } = useCollection(teamApi.list);
  const team = data || [];
  // Featured members lead the lineup, but the grid is always backfilled with
  // the rest of the team so a single featured leader doesn't leave a sparse,
  // one-card row.
  const featured = team.filter((member) => member.featured);
  const others = team.filter((member) => !member.featured);
  const shown = [...featured, ...others].slice(0, limit);

  if (!loading && shown.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden bg-gray-50 bg-cover bg-center py-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-white/92" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <h2 className="text-4xl font-bold text-chadi-green sm:text-5xl">
            Meet Our Team
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-gray-600">
            Behind every successful community transformation is a passionate
            team committed to creating lasting impact.
          </p>
        </Reveal>

        {loading ? (
          <div className="mt-14">
            <CardGridSkeleton count={4} columns={4} />
          </div>
        ) : (
          <StaggerGrid className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((member) => (
              <StaggerItem key={member.id}>
                <TeamPreviewCard member={member} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}

        <Reveal delay={0.2}>
          <Link
            to="/team"
            className="mt-12 inline-block rounded-xl bg-chadi-green px-8 py-4 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
          >
            Meet the Full Team
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export default TeamShowcase;
