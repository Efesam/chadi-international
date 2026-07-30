import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import Reveal from "../../components/common/Reveal";

function NotFound() {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-32 text-center dark:bg-gray-900">
      <Seo title={t("notFound.seoTitle")} noindex />
      <Reveal className="mx-auto max-w-3xl px-6">
        <p className="font-semibold uppercase tracking-widest text-chadi-gold-dark dark:text-chadi-gold">
          {t("notFound.eyebrow")}
        </p>
        <h1 className="mt-4 text-4xl font-bold text-chadi-green sm:text-5xl dark:text-chadi-lightgreen">
          {t("notFound.title")}
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          {t("notFound.description")}
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
        >
          {t("notFound.backHome")}
        </Link>
      </Reveal>
    </section>
  );
}

export default NotFound;
