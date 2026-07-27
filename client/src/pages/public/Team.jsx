import { FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import TeamCard from "../../components/ui/TeamCard";
import CardGridSkeleton from "../../components/common/CardGridSkeleton";
import Reveal from "../../components/common/Reveal";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import { useCollection } from "../../hooks/useCollection";
import { teamApi } from "../../services/api";
import Newsletter from "../../components/common/Newsletter";

/** A larger spotlight card for leadership (marked "featured" in the admin) - image beside bio instead of a stacked grid card. */
function FeaturedTeamCard({ member }) {
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="grid overflow-hidden rounded-3xl bg-white shadow-xl sm:grid-cols-[240px_1fr]">
      <div className="h-64 sm:h-full">
        {member.image ? (
          <img src={member.image} alt={member.name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-chadi-green text-5xl font-bold text-white">
            {initials}
          </div>
        )}
      </div>

      <div className="p-8">
        <span className="rounded-full bg-chadi-gold px-4 py-1 text-xs font-bold uppercase tracking-wide text-black">
          Leadership
        </span>
        <h3 className="mt-4 text-3xl font-bold text-chadi-green">{member.name}</h3>
        <p className="mt-1 font-semibold text-chadi-gold-dark">{member.role}</p>
        {member.bio && <p className="mt-4 leading-7 text-gray-600">{member.bio}</p>}

        {(member.email || member.linkedin || member.twitter) && (
          <div className="mt-5 flex gap-3">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                aria-label={`Email ${member.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-chadi-cream text-chadi-green transition hover:bg-chadi-green hover:text-white"
              >
                <FaEnvelope size={14} />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-chadi-cream text-chadi-green transition hover:bg-chadi-green hover:text-white"
              >
                <FaLinkedin size={14} />
              </a>
            )}
            {member.twitter && (
              <a
                href={member.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} on Twitter`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-chadi-cream text-chadi-green transition hover:bg-chadi-green hover:text-white"
              >
                <FaTwitter size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Groups the non-featured members by department, preserving first-appearance order (not alphabetical - matches how they were added). */
function groupByDepartment(members) {
  const order = [];
  const groups = {};

  members.forEach((member) => {
    const department = member.department || "Team";
    if (!groups[department]) {
      groups[department] = [];
      order.push(department);
    }
    groups[department].push(member);
  });

  return order.map((department) => ({ department, members: groups[department] }));
}

function Team() {
  const { data: team, loading, error } = useCollection(teamApi.list);
  const members = team || [];
  const featured = members.filter((member) => member.featured);
  const departmentGroups = groupByDepartment(members.filter((member) => !member.featured));

  return (
    <>
      <Seo
        title="Our Team"
        path="/team"
        description="Meet the dedicated team behind CHADI International's programs and community work."
      />

      <PageHeader
        title="Our Team"
        subtitle="Meet the dedicated people behind CHADI."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <CardGridSkeleton count={6} columns={3} />
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : members.length === 0 ? (
            <p className="text-center text-gray-500">Team profiles are on the way. Check back soon.</p>
          ) : (
            <>
              {featured.length > 0 && (
                <StaggerGrid className={`mb-20 grid gap-8 ${featured.length > 1 ? "lg:grid-cols-2" : "max-w-3xl mx-auto"}`}>
                  {featured.map((member) => (
                    <StaggerItem key={member.id}>
                      <FeaturedTeamCard member={member} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              )}

              {departmentGroups.map(({ department, members: group }) => (
                <div key={department} className="mb-16 last:mb-0">
                  <Reveal>
                    <h2 className="mb-8 border-b border-chadi-lightgreen pb-3 text-2xl font-bold text-chadi-green">
                      {department}
                    </h2>
                  </Reveal>

                  <StaggerGrid className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {group.map((member) => (
                      <StaggerItem key={member.id}>
                        <TeamCard member={member} />
                      </StaggerItem>
                    ))}
                  </StaggerGrid>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default Team;
