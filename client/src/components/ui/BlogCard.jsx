import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function BlogCard({ post }) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
    >
      <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-chadi-green to-[#1c3d16] text-white/70">
            <span className="text-sm font-semibold uppercase tracking-widest">{t("common.blogCard.story")}</span>
          </div>
        )}

        {post.category && (
          <span className="absolute left-4 top-4 rounded-full bg-chadi-green px-3 py-1.5 text-xs font-semibold text-white shadow">
            {post.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {post.campaign && (
          <span className="mb-2 inline-block w-fit rounded-full bg-chadi-lightgreen px-3 py-1 text-xs font-semibold text-chadi-green">
            {post.campaign}
          </span>
        )}

        <h3 className="text-2xl font-bold text-chadi-green transition group-hover:text-chadi-gold-dark dark:text-chadi-lightgreen dark:group-hover:text-chadi-gold">
          {post.title}
        </h3>

        <p className="mt-4 flex-1 text-gray-600 dark:text-gray-300">{post.excerpt}</p>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {[post.date, post.author].filter(Boolean).join(" · ")}
          </p>
          <span className="font-semibold text-chadi-green group-hover:text-chadi-gold-dark dark:text-chadi-lightgreen dark:group-hover:text-chadi-gold">
            {t("common.blogCard.readStory")}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
