import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { useCollection } from "../../hooks/useCollection";
import { partnersApi } from "../../services/api";

const partnerTypes = [
  "Community organizations",
  "Schools and learning centers",
  "Health institutions",
  "Corporate sponsors",
  "Faith and civic groups",
  "Research and innovation partners",
];

function Partners() {
  const { data: partners, loading, error } = useCollection(partnersApi.list);

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

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-chadi-green">Our Partners</h2>

          {loading ? (
            <p className="mt-8 text-gray-500">Loading partners...</p>
          ) : error ? (
            <p className="mt-8 font-semibold text-red-600">{error}</p>
          ) : partners.length === 0 ? (
            <p className="mt-8 text-gray-500">
              We're building this list. Reach out if your organization would like to partner with CHADI.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.website || "#"}
                  target={partner.website ? "_blank" : undefined}
                  rel={partner.website ? "noreferrer" : undefined}
                  className="block rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {partner.logo && (
                    <img src={partner.logo} alt={partner.name} loading="lazy" className="h-12 object-contain" />
                  )}
                  <p className="mt-4 font-bold text-chadi-green">{partner.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{partner.type}</p>
                  {partner.description && (
                    <p className="mt-3 text-sm text-gray-600">{partner.description}</p>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Partners;
