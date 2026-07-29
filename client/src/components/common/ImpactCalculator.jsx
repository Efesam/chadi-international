import { useMemo, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { IMPACT_TIERS } from "../../data/impactTiers";
import Reveal from "./Reveal";
import DonateModal from "./DonateModal";

const MIN = 1000;
const MAX = 50000;
const STEP = 500;

/**
 * Slide-to-see-your-impact calculator. The unit counts are a straightforward
 * proportional read of the same cost-per-outcome figures already shown as
 * DonateModal's preset buttons (see data/impactTiers.js) - not new claims,
 * just the existing ones scaled to whatever amount the visitor picks.
 */
function ImpactCalculator() {
  const [amount, setAmount] = useState(10000);
  const [donateOpen, setDonateOpen] = useState(false);

  const impact = useMemo(() => {
    // The most specific tier this amount can fully cover, falling back to
    // the cheapest tier (scaled down) if the amount is below all of them.
    const tier = [...IMPACT_TIERS].reverse().find((t) => amount >= t.amount) || IMPACT_TIERS[0];
    const count = Math.max(1, Math.round(amount / tier.amount));
    return { count, unit: count === 1 ? tier.unit : tier.unitPlural };
  }, [amount]);

  return (
    <section className="bg-chadi-cream py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="font-semibold uppercase tracking-widest text-chadi-gold-dark">See Your Impact</p>
          <h2 className="mt-3 text-4xl font-bold text-chadi-green sm:text-5xl">
            What Your Donation Provides
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Slide to see what your contribution could mean for a community.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 rounded-3xl bg-white p-8 shadow-lg sm:p-12">
          <p className="text-5xl font-black text-chadi-green sm:text-6xl">
            ₦{amount.toLocaleString()}
          </p>

          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            aria-label="Donation amount"
            className="mt-8 h-2 w-full cursor-pointer appearance-none rounded-full bg-chadi-lightgreen accent-chadi-green"
          />

          <div className="mt-3 flex justify-between text-xs font-semibold text-gray-400">
            <span>₦{MIN.toLocaleString()}</span>
            <span>₦{MAX.toLocaleString()}</span>
          </div>

          <p className="mt-8 text-xl leading-8 text-gray-700">
            That could provide{" "}
            <span className="font-bold text-chadi-green">
              {impact.count} {impact.unit}
            </span>
            .
          </p>

          <button
            type="button"
            onClick={() => setDonateOpen(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-chadi-green px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-chadi-gold hover:text-black"
          >
            <FaHeart />
            Donate ₦{amount.toLocaleString()}
          </button>
        </Reveal>
      </div>

      <DonateModal key={amount} open={donateOpen} onClose={() => setDonateOpen(false)} initialAmount={amount} />
    </section>
  );
}

export default ImpactCalculator;
