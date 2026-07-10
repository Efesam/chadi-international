import { useState } from "react";
import { Link } from "react-router-dom";
import DonateModal from "../common/DonateModal";

function CallToAction() {
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <section className="bg-chadi-green py-20 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-6 lg:flex-row lg:items-end">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[4px] text-chadi-lightgreen">
            Get Involved
          </p>
          <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">
            Ready to back lasting community impact?
          </h2>
          <p className="mt-5 leading-8 text-white/75">
            Volunteer your time, partner your organization, or give directly
            &mdash; every path leads to practical action on the ground.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setDonateOpen(true)}
            className="rounded-full bg-chadi-gold px-7 py-3.5 font-semibold text-chadi-ink transition hover:bg-white"
          >
            Donate Now
          </button>
          <Link
            to="/volunteer"
            className="rounded-full border border-white/40 px-7 py-3.5 font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            Volunteer
          </Link>
        </div>
      </div>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </section>
  );
}

export default CallToAction;
