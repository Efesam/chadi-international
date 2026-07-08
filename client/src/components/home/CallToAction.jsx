import { Link } from "react-router-dom";

function CallToAction() {
  return (
    <section className="bg-chadi-green py-20 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-4xl font-bold">
            Ready to support lasting community impact?
          </h2>
          <p className="mt-4 max-w-3xl text-white/85">
            Volunteer, partner, donate or invite CHADI into a community need
            that deserves practical action.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/volunteer"
            className="rounded-lg bg-chadi-gold px-6 py-3 font-semibold text-black"
          >
            Volunteer
          </Link>
          <Link
            to="/donate"
            className="rounded-lg border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-chadi-green"
          >
            Donate
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
