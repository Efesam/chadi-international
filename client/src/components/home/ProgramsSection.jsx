import ProgramCard from "../ui/ProgramCard";
import { programs } from "../../data/programs";

function ProgramsSection() {
  return (
    <section className="bg-chadi-cream py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[4px] text-chadi-green">
            Flagship Initiatives
          </p>

          <h2 className="mt-5 text-4xl leading-tight text-chadi-ink sm:text-5xl">
            Six programs, one goal.
          </h2>

          <p className="mt-6 text-lg leading-8 text-chadi-ink/60">
            Each initiative targets a specific, practical gap &mdash;
            nutrition, education, livelihoods, or resilience &mdash; identified
            directly with the communities we work in.
          </p>
        </div>

        <div className="mt-8">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProgramsSection;
