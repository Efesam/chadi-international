import ProgramCard from "../ui/ProgramCard";
import { useCollection } from "../../hooks/useCollection";
import { programsApi } from "../../services/api";

function ProgramsSection() {
  const { data: programs, loading, error } = useCollection(programsApi.list);

  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <span className="rounded-full bg-chadi-gold px-5 py-2 text-sm font-semibold">
            Our Flagship Initiatives
          </span>

          <h2 className="mt-6 text-5xl font-bold text-chadi-green">
            Transforming Lives Across Africa
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            CHADI International implements strategic initiatives focused on
            sustainable development, humanitarian response, education,
            healthcare and community empowerment.
          </p>

        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading programs...</p>
        ) : error ? (
          <p className="text-center font-semibold text-red-600">{error}</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default ProgramsSection;