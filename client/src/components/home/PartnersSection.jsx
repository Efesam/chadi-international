import { Link } from "react-router-dom";

const partners = [
  "Community leaders",
  "Health teams",
  "Schools",
  "Donors",
  "Volunteers",
  "Local organizations",
];

function PartnersSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="font-semibold uppercase tracking-widest text-chadi-gold">
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
            className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white"
          >
            Partner With Us
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {partners.map((partner) => (
            <div
              key={partner}
              className="rounded-xl bg-chadi-cream p-6 font-semibold text-chadi-green shadow-sm"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;
