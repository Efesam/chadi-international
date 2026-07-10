import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function ProgramCard({ program }) {
  return (
    <Link
      to={`/programs/${program.slug}`}
      className="group block border-t border-chadi-ink/10 py-8 transition first:border-t-0"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[3px] text-chadi-green">
            {program.category}
          </p>
          <h3 className="mt-3 font-serif text-3xl text-chadi-ink">
            {program.title}
          </h3>
          <p className="mt-3 max-w-xl leading-7 text-chadi-ink/60">
            {program.description}
          </p>
        </div>

        <FaArrowRight className="mt-2 shrink-0 text-chadi-ink/30 transition group-hover:translate-x-1 group-hover:text-chadi-green" />
      </div>
    </Link>
  );
}

export default ProgramCard;
