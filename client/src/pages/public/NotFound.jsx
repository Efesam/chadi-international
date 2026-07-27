import { Link } from "react-router-dom";
import Seo from "../../components/common/Seo";
import Reveal from "../../components/common/Reveal";

function NotFound() {
  return (
    <section className="bg-white py-32 text-center">
      <Seo title="Page Not Found" noindex />
      <Reveal className="mx-auto max-w-3xl px-6">
        <p className="font-semibold uppercase tracking-widest text-chadi-gold-dark">
          404
        </p>
        <h1 className="mt-4 text-4xl font-bold text-chadi-green sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
        >
          Back Home
        </Link>
      </Reveal>
    </section>
  );
}

export default NotFound;
