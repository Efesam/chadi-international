import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Skeleton from "../../components/common/Skeleton";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import { useCollection } from "../../hooks/useCollection";
import { storiesApi } from "../../services/api";
import Newsletter from "../../components/common/Newsletter";

// Stories render as full-width horizontal cards (image rail + text), not a
// grid of square cards, so they get their own skeleton shape instead of the
// generic CardGridSkeleton used by the photo-grid pages.
function StoriesSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="grid gap-6 rounded-xl bg-chadi-cream p-6 shadow-sm md:grid-cols-[220px_1fr]">
          <Skeleton className="h-56 w-full" />
          <div className="space-y-3 py-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </>
  );
}

function Stories() {
  const { data: stories, loading, error } = useCollection(storiesApi.list);

  return (
    <>
      <Seo
        title="Impact Stories"
        path="/stories"
        description="Read real stories of practical change from communities supported by CHADI International."
      />

      <PageHeader
        title="Impact Stories"
        subtitle="Stories of practical change from CHADI-supported communities."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl space-y-8 px-6">
          {loading ? (
            <StoriesSkeleton />
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : stories.length === 0 ? (
            <p className="text-center text-gray-500">
              We're gathering stories from the field. Check back soon.
            </p>
          ) : (
            <StaggerGrid className="space-y-8">
              {stories.map((story) => (
                <StaggerItem key={story.id}>
                  <article className="grid gap-6 rounded-xl bg-chadi-cream p-6 shadow-sm md:grid-cols-[220px_1fr]">
                    {story.image && (
                      <img
                        src={story.image}
                        alt={story.title}
                        loading="lazy"
                        className="h-56 w-full rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-chadi-gold-dark">{story.program}</p>
                      <h2 className="mt-2 text-3xl font-bold text-chadi-green">
                        {story.title}
                      </h2>
                      <p className="mt-4 leading-7 text-gray-600">
                        {story.excerpt}
                      </p>
                      {story.content && (
                        <div
                          className="prose prose-sm mt-4 max-w-none text-gray-600"
                          dangerouslySetInnerHTML={{ __html: story.content }}
                        />
                      )}
                      {story.personName && (
                        <p className="mt-5 font-semibold text-gray-700">
                          Featuring: {story.personName}
                        </p>
                      )}
                    </div>
                  </article>
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

export default Stories;
