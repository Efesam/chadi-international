import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { partnersApi } from "../../services/api";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";

// Shown only until real partners are added via Admin > Partners, so the
// section never ships looking empty before the CMS has content.
const fallbackPartnerTypes = [
  "Community leaders",
  "Health teams",
  "Schools",
  "Donors",
  "Volunteers",
  "Local organizations",
];

function PartnersSection() {
  const { data, loading } = useCollection(partnersApi.list);
  const partners = (data || []).slice(0, 6);

  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <Reveal direction="left">
          <div>
            <p className="font-semibold uppercase tracking-widest text-chadi-gold-dark">
              Partnerships
            </p>
            <h2 className="mt-3 text-4xl font-bold text-chadi-green">
              Built With Communities
            </h2>
            <p className="mt-5 leading-8 text-gray-600">
              CHADI collaborates with trusted partners to deliver programs that
              are practical, accountable and rooted in local realities.
            </p>
            <Link
              to="/partners"
              className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:scale-105"
            >
              Partner With Us
            </Link>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[68px] animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : partners.length > 0 ? (
          <StaggerGrid className="grid gap-4 sm:grid-cols-2">
            {partners.map((partner) => (
              <StaggerItem key={partner.id}>
                <div className="flex h-full items-center gap-3 rounded-xl bg-chadi-cream p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      loading="lazy"
                      className="h-10 w-10 shrink-0 rounded-full bg-white object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chadi-green text-sm font-bold text-white">
                      {partner.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="font-semibold text-chadi-green">{partner.name}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        ) : (
          <StaggerGrid className="grid gap-4 sm:grid-cols-2">
            {fallbackPartnerTypes.map((type) => (
              <StaggerItem key={type}>
                <div className="rounded-xl bg-chadi-cream p-6 font-semibold text-chadi-green shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  {type}
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </section>
  );
}

export default PartnersSection;
