import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";

const partnerTypes = [
  "Community organizations",
  "Schools and learning centers",
  "Health institutions",
  "Corporate sponsors",
  "Faith and civic groups",
  "Research and innovation partners",
];

function Partners() {
  return (
    <>
      <PageHeader
        title="Partners"
        subtitle="Partnerships help CHADI reach farther and serve communities better."
      />

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold text-chadi-green">
              Work With CHADI
            </h2>
            <p className="mt-6 leading-8 text-gray-600">
              We partner with groups that care about health, education,
              livelihoods, protection, climate action and community resilience.
              Together we can plan, fund and deliver programs with measurable
              local value.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white"
            >
              Become a Partner
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {partnerTypes.map((type) => (
              <div
                key={type}
                className="rounded-xl bg-chadi-cream p-6 font-semibold text-chadi-green shadow-sm"
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Partners;
