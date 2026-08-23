import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCollection } from "../../hooks/useCollection";
import { blogApi } from "../../services/api";
import BlogCard from "../ui/BlogCard";
import CardGridSkeleton from "../common/CardGridSkeleton";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";

function LatestBlog() {
  const { t, i18n } = useTranslation();
  const { data, loading } = useCollection(() => blogApi.list(i18n.language), [i18n.language]);
  const posts = data || [];
  // Prefers posts an admin has actually marked "Featured on homepage", but
  // falls back to the latest ones so this section doesn't just disappear
  // the moment new posts exist but nobody's checked that box yet.
  const featured = posts.filter((post) => post.featured);
  const shown = (featured.length > 0 ? featured : posts).slice(0, 3);

  if (!loading && shown.length === 0) return null;

  return (
    <section className="bg-white py-24 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-semibold uppercase tracking-widest text-chadi-gold-dark dark:text-chadi-gold">
                {t("home.latestBlog.eyebrow")}
              </p>
              <h2 className="mt-3 text-4xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                {t("home.latestBlog.title")}
              </h2>
              <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
                {t("home.latestBlog.subtitle")}
              </p>
            </div>

            <Link
              to="/blog"
              className="inline-block py-1.5 font-semibold text-chadi-green hover:text-chadi-gold-dark dark:text-chadi-lightgreen dark:hover:text-chadi-gold"
            >
              {t("home.latestBlog.viewAll")}
            </Link>
          </div>
        </Reveal>

        {loading ? (
          <CardGridSkeleton count={3} columns={3} />
        ) : (
          <StaggerGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((post) => (
              <StaggerItem key={post.id}>
                <BlogCard post={post} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </section>
  );
}

export default LatestBlog;
