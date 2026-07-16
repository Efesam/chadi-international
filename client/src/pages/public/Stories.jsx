import PageHeader from "../../components/common/PageHeader";
import CardGridSkeleton from "../../components/common/CardGridSkeleton";
import { useCollection } from "../../hooks/useCollection";
import { storiesApi } from "../../services/api";

function Stories() {
  const { data: stories, loading, error } = useCollection(storiesApi.list);

  return (
    <>
      <PageHeader
        title="Impact Stories"
        subtitle="Stories of practical change from CHADI-supported communities."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl space-y-8 px-6">
          {loading ? (
            <CardGridSkeleton count={2} columns={2} />
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : stories.length === 0 ? (
            <p className="text-center text-gray-500">
              We're gathering stories from the field. Check back soon.
            </p>
          ) : (
            stories.map((story) => (
              <article
                key={story.id}
                className="grid gap-6 rounded-xl bg-chadi-cream p-6 shadow-sm md:grid-cols-[220px_1fr]"
              >
                {story.image && (
                  <img
                    src={story.image}
                    alt={story.title}
                    loading="lazy"
                    className="h-56 w-full rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-chadi-gold">{story.program}</p>
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
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default Stories;
