import PageHeader from "../../components/common/PageHeader";
import TeamCard from "../../components/ui/TeamCard";
import { useCollection } from "../../hooks/useCollection";
import { teamApi } from "../../services/api";

function Team() {
  const { data: team, loading, error } = useCollection(teamApi.list);

  return (
    <>
      <PageHeader
        title="Our Team"
        subtitle="Meet the dedicated people behind CHADI."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading team...</p>
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Team;
