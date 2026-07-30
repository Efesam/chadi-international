import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import NewsCard from "../../components/ui/NewsCard";
import CardGridSkeleton from "../../components/common/CardGridSkeleton";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import { useCollection } from "../../hooks/useCollection";
import { newsApi } from "../../services/api";
import Newsletter from "../../components/common/Newsletter";

function News() {
  const { t, i18n } = useTranslation();
  const { data: news, loading, error } = useCollection(() => newsApi.list(i18n.language), [i18n.language]);

  return (
    <>
      <Seo
        title={t("news.seoTitle")}
        path="/news"
        description={t("news.seoDescription")}
      />

      <PageHeader
        title={t("news.title")}
        subtitle={t("news.subtitle")}
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <CardGridSkeleton count={6} columns={3} />
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : news.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">{t("news.empty")}</p>
          ) : (
            <StaggerGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article) => (
                <StaggerItem key={article.id}>
                  <NewsCard article={article} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default News;
