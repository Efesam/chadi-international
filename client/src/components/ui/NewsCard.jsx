import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NewsCard({ article }) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800">
      <div className="h-56 bg-gray-200 dark:bg-gray-700" />

      <div className="p-6">
        <span className="text-sm font-semibold text-chadi-gold-dark dark:text-chadi-gold">
          {article.category}
        </span>

        <h3 className="mt-3 text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
          {article.title}
        </h3>

        <p className="mt-4 text-gray-600 dark:text-gray-300">
          {article.excerpt}
        </p>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          {article.date}
        </p>

        <Link
          to={`/news/${article.slug}`}
          className="mt-6 inline-block font-semibold text-chadi-green hover:text-chadi-gold-dark dark:text-chadi-lightgreen dark:hover:text-chadi-gold"
        >
          {t("common.newsCard.readArticle")}
        </Link>
      </div>
    </div>
  );
}

export default NewsCard;
