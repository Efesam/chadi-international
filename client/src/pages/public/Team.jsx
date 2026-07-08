import PageHeader from "../../components/common/PageHeader";
import TeamCard from "../../components/ui/TeamCard";
import { team } from "../../data/team";

function Team() {
  return (
    <>
      <PageHeader
        title="Our Team"
        subtitle="Meet the dedicated people behind CHADI."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">

            {team.map((member) => (
              <TeamCard
                key={member.id}
                member={member}
              />
            ))}

          </div>

        </div>
      </section>
    </>
  );
}

export default Team;
