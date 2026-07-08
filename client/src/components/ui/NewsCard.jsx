import { Link } from "react-router-dom";

function NewsCard({ article }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-xl">
      <div className="h-56 bg-gray-200" />

      <div className="p-6">
        <span className="text-sm font-semibold text-chadi-gold">
          {article.category}
        </span>

        <h3 className="mt-3 text-2xl font-bold text-chadi-green">
          {article.title}
        </h3>

        <p className="mt-4 text-gray-600">
          {article.excerpt}
        </p>

        <p className="mt-6 text-sm text-gray-500">
          {article.date}
        </p>

        <Link
          to={`/news/${article.slug}`}
          className="mt-6 inline-block font-semibold text-chadi-green hover:text-chadi-gold"
        >
          Read Article →
        </Link>
      </div>
    </div>
  );
}

export default NewsCard;
