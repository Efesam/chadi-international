import PageHeader from "../../components/common/PageHeader";
import NewsCard from "../../components/ui/NewsCard";
import { news } from "../../data/news";

function News() {
  return (
    <>
      <PageHeader
        title="News"
        subtitle="Latest updates from CHADI."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default News;
