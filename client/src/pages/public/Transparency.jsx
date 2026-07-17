import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import AllocationChart from "../../components/ui/AllocationChart";
import { useCollection } from "../../hooks/useCollection";
import { getSettings } from "../../services/api";

function Transparency() {
  const { data: settings, loading } = useCollection(getSettings);
  const allocation = settings?.fundAllocation || [];

  return (
    <>
      <PageHeader
        title="Our Commitment"
        subtitle="Transparency. Accountability. Impact."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-lg leading-8 text-gray-600">
            We are committed to using every resource responsibly and
            ensuring measurable, lasting impact in the communities we serve.
            Every donation is tracked from the moment it's given to the
            outcome it helps create.
          </p>

          <div className="mt-14 rounded-3xl bg-chadi-cream p-10">
            <h2 className="text-2xl font-bold text-chadi-green">
              Where Your Donation Goes
            </h2>

            {loading ? (
              <p className="mt-6 text-gray-500">Loading...</p>
            ) : allocation.length > 0 ? (
              <div className="mt-8">
                <AllocationChart data={allocation} />
              </div>
            ) : (
              <p className="mt-6 text-gray-500">Allocation details coming soon.</p>
            )}
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-chadi-green/20 p-6">
              <h3 className="font-bold text-chadi-green">Transparency</h3>
              <p className="mt-2 text-sm text-gray-600">
                Clear reporting on how funds are raised and spent.
              </p>
            </div>
            <div className="rounded-2xl border border-chadi-green/20 p-6">
              <h3 className="font-bold text-chadi-green">Accountability</h3>
              <p className="mt-2 text-sm text-gray-600">
                Governance practices that keep our team answerable to the
                communities we serve.
              </p>
            </div>
            <div className="rounded-2xl border border-chadi-green/20 p-6">
              <h3 className="font-bold text-chadi-green">Measurable Impact</h3>
              <p className="mt-2 text-sm text-gray-600">
                Programs tracked against real outcomes, not just activity.
              </p>
            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-chadi-green p-10 text-center text-white">
            <h2 className="text-2xl font-bold">Want the full picture?</h2>
            <p className="mt-3 text-white/80">
              Reach out to our team for detailed financial and program reports.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-block rounded-lg bg-chadi-gold px-6 py-3 font-semibold text-black"
            >
              Request a Report
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Transparency;
