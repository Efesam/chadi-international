
import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { newsApi } from "../../services/api";
import NewsCard from "../ui/NewsCard";
import CardGridSkeleton from "../common/CardGridSkeleton";
import Reveal from "../common/Reveal";
import StaggerGrid, { StaggerItem } from "../common/StaggerGrid";

function LatestNews() {
  const { data, loading } = useCollection(newsApi.list);
  const latest = (data || []).slice(0, 2);

  if (!loading && latest.length === 0) return null;

  return (
    <section className="bg-chadi-cream py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-semibold uppercase tracking-widest text-chadi-gold">
                Latest News
              </p>
              <h2 className="mt-3 text-4xl font-bold text-chadi-green">
                Updates From CHADI
              </h2>
              <p className="mt-4 max-w-2xl text-gray-600">
                Follow program milestones, field activities and community stories.
              </p>
            </div>

            <Link
              to="/news"
              className="font-semibold text-chadi-green hover:text-chadi-gold"
            >
              View All News
            </Link>
          </div>
        </Reveal>

        {loading ? (
          <CardGridSkeleton count={2} columns={2} />
        ) : (
          <StaggerGrid className="grid gap-8 md:grid-cols-2">
            {latest.map((article) => (
              <StaggerItem key={article.id}>
                <NewsCard article={article} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </section>
  );
}

export default LatestNews;
