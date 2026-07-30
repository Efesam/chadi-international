import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import DetailSkeleton from "../../components/common/DetailSkeleton";
import Reveal from "../../components/common/Reveal";
import { useCollection } from "../../hooks/useCollection";
import { newsApi } from "../../services/api";
import Newsletter from "../../components/common/Newsletter";

function NewsDetails() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const { data: article, loading, error } = useCollection(() => newsApi.get(slug, i18n.language), [slug, i18n.language]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !article) {
    return (
      <section className="bg-white py-28 text-center dark:bg-gray-900">
        <Seo title={t("news.notFound.title")} noindex />
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold text-chadi-green dark:text-chadi-lightgreen">
            {t("news.notFound.title")}
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {t("news.notFound.description")}
          </p>
          <Link
            to="/news"
            className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
          >
            {t("news.notFound.back")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={article.title}
        path={`/news/${slug}`}
        description={article.excerpt || `Read the latest from CHADI International: ${article.title}.`}
        image={article.image}
      />

      <PageHeader title={article.title} subtitle={article.excerpt} />

      <article className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
              <span className="rounded-full bg-chadi-gold px-4 py-2 text-black">
                {article.category}
              </span>
              <span>{article.date}</span>
              <span>{article.author}</span>
            </div>

            <div
              className="prose prose-lg mt-10 max-w-none text-gray-700 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: article.content || "" }}
            />
          </Reveal>

          <Link
            to="/news"
            className="mt-12 inline-block font-semibold text-chadi-green hover:text-chadi-gold-dark dark:text-chadi-lightgreen dark:hover:text-chadi-gold"
          >
            {t("news.notFound.back")}
          </Link>
        </div>
      </article>

      <Newsletter />
    </>
  );
}

export default NewsDetails;
