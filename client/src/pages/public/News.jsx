import PageHeader from "../../components/common/PageHeader";
import NewsCard from "../../components/ui/NewsCard";
import { useCollection } from "../../hooks/useCollection";
import { newsApi } from "../../services/api";

function News() {
  const { data: news, loading, error } = useCollection(newsApi.list);

  return (
    <>
      <PageHeader
        title="News"
        subtitle="Latest updates from CHADI."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading news...</p>
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : news.length === 0 ? (
            <p className="text-center text-gray-500">No news articles yet.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default News;
