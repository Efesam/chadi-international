import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import DetailSkeleton from "../../components/common/DetailSkeleton";
import Reveal from "../../components/common/Reveal";
import { useCollection } from "../../hooks/useCollection";
import { blogApi } from "../../services/api";
import Newsletter from "../../components/common/Newsletter";

function BlogDetails() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const { data: post, loading, error } = useCollection(() => blogApi.get(slug, i18n.language), [slug, i18n.language]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !post) {
    return (
      <section className="bg-white py-28 text-center dark:bg-gray-900">
        <Seo title={t("blog.notFound.title")} noindex />
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold text-chadi-green dark:text-chadi-lightgreen">
            {t("blog.notFound.title")}
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{t("blog.notFound.description")}</p>
          <Link
            to="/blog"
            className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
          >
            {t("blog.notFound.back")}
          </Link>
        </div>
      </section>
    );
  }

  // The SEO topic isn't shown to readers - it's a specific search intent
  // (e.g. "Sickle cell prevention") this post targets, folded into the meta
  // description so search engines have more to match against than the
  // excerpt alone provides.
  const description = [post.excerpt, post.seoTopic].filter(Boolean).join(" ") ||
    t("blog.seoFallbackDescription", { title: post.title });

  return (
    <>
      <Seo title={post.title} path={`/blog/${slug}`} description={description} image={post.image} />

      <article className="bg-white py-16 dark:bg-gray-900 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
              {post.category && (
                <span className="rounded-full bg-chadi-green px-4 py-2 text-white">{post.category}</span>
              )}
              {post.campaign && (
                <span className="rounded-full bg-chadi-lightgreen px-4 py-2 text-chadi-green">{post.campaign}</span>
              )}
            </div>

            <h1 className="mt-6 text-3xl font-bold text-chadi-green dark:text-chadi-lightgreen sm:text-4xl">
              {post.title}
            </h1>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {[post.date, post.author].filter(Boolean).join(" · ")}
            </p>

            {post.image && (
              <div className="mt-8 overflow-hidden rounded-3xl shadow-lg">
                <img src={post.image} alt={post.title} className="h-72 w-full object-cover sm:h-96" />
              </div>
            )}

            <div
              className="prose prose-lg mt-10 max-w-none text-gray-700 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </Reveal>

          <Link
            to="/blog"
            className="mt-12 inline-block font-semibold text-chadi-green hover:text-chadi-gold-dark dark:text-chadi-lightgreen dark:hover:text-chadi-gold"
          >
            {t("blog.notFound.back")}
          </Link>
        </div>
      </article>

      <Newsletter />
    </>
  );
}

export default BlogDetails;
