import { Link } from "react-router-dom";
import { FaFileDownload, FaFilePdf } from "react-icons/fa";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import AllocationChart from "../../components/ui/AllocationChart";
import Reveal from "../../components/common/Reveal";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import { useCollection } from "../../hooks/useCollection";
import { getSettings, reportsApi } from "../../services/api";
import reportImage from "../../assets/projects/community-health.jpg";
import Newsletter from "../../components/common/Newsletter";

function Transparency() {
  const { data: settings, loading } = useCollection(getSettings);
  const { data: reportsData, loading: reportsLoading } = useCollection(reportsApi.list);
  const allocation = settings?.fundAllocation || [];
  const reports = reportsData || [];

  return (
    <>
      <Seo
        title="Transparency"
        path="/transparency"
        description="See how CHADI International allocates and reports on donations, with a commitment to transparency and accountability."
      />

      <PageHeader
        title="Our Commitment"
        subtitle="Transparency. Accountability. Impact."
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
              We are committed to using every resource responsibly and
              ensuring measurable, lasting impact in the communities we serve.
              Every donation is tracked from the moment it's given to the
              outcome it helps create.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-14 rounded-3xl bg-chadi-cream p-10">
            <h2 className="text-2xl font-bold text-chadi-green">
              Where Your Donation Goes
            </h2>

            {loading ? (
              <p className="mt-6 text-gray-500 dark:text-gray-400">Loading...</p>
            ) : allocation.length > 0 ? (
              <div className="mt-8">
                <AllocationChart data={allocation} />
              </div>
            ) : (
              <p className="mt-6 text-gray-500 dark:text-gray-400">
                We publish a full allocation breakdown here as soon as it's finalized for the
                current reporting period. In the meantime, reach out below for our latest report.
              </p>
            )}
          </Reveal>

          {!reportsLoading && reports.length > 0 && (
            <Reveal delay={0.15} className="mt-14">
              <h2 className="text-2xl font-bold text-chadi-green">
                Reports &amp; Financial Statements
              </h2>
              <StaggerGrid className="mt-6 grid gap-4 sm:grid-cols-2">
                {reports.map((report) => (
                  <StaggerItem key={report.id}>
                    <a
                      href={report.file}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-4 rounded-2xl border border-chadi-green/20 p-5 transition hover:border-chadi-green hover:shadow-md"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-chadi-green/10 text-chadi-green">
                        <FaFilePdf size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-chadi-green">
                          {report.title}
                        </span>
                        {report.year && (
                          <span className="block text-sm text-gray-500 dark:text-gray-400">{report.year}</span>
                        )}
                      </span>
                      <FaFileDownload className="shrink-0 text-gray-400 dark:text-gray-500" />
                    </a>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Reveal>
          )}

          <StaggerGrid className="mt-14 grid gap-6 sm:grid-cols-3">
            <StaggerItem>
              <div className="rounded-2xl border border-chadi-green/20 p-6">
                <h3 className="font-bold text-chadi-green">Transparency</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Clear reporting on how funds are raised and spent.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-2xl border border-chadi-green/20 p-6">
                <h3 className="font-bold text-chadi-green">Accountability</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Governance practices that keep our team answerable to the
                  communities we serve.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-2xl border border-chadi-green/20 p-6">
                <h3 className="font-bold text-chadi-green">Measurable Impact</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Programs tracked against real outcomes, not just activity.
                </p>
              </div>
            </StaggerItem>
          </StaggerGrid>

          <Reveal
            className="relative mt-14 overflow-hidden rounded-3xl bg-chadi-green bg-cover bg-center p-10 text-center text-white"
            style={{ backgroundImage: `url(${reportImage})` }}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-chadi-green/70 via-chadi-green/80 to-chadi-green/90" />
            <div className="relative">
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
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default Transparency;
