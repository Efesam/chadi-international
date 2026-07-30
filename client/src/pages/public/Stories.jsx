import { useState } from "react";
import { FaExpand } from "react-icons/fa";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Skeleton from "../../components/common/Skeleton";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import Reveal from "../../components/common/Reveal";
import Lightbox from "../../components/common/Lightbox";
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
  const { data, loading, error } = useCollection(storiesApi.list);
  const [featuredOpen, setFeaturedOpen] = useState(false);

  const stories = data || [];
  // The first story leads as a full-bleed feature (mirrors a "featured
  // video" hero, in photo form) only once there's at least one more story
  // to fill the list below it - otherwise it'd show the only story twice.
  const hasFeature = stories.length > 1 && Boolean(stories[0]?.image);
  const featured = hasFeature ? stories[0] : null;
  const remaining = hasFeature ? stories.slice(1) : stories;

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

      {featured && (
        <section className="bg-white py-20 dark:bg-gray-900">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
            <Reveal direction="left">
              <span className="font-semibold uppercase tracking-widest text-chadi-gold-dark">
                In Their Words
              </span>
              <h2 className="mt-4 text-4xl font-bold text-chadi-green sm:text-5xl">
                The stories numbers can't tell.
              </h2>
              <p className="mt-6 max-w-xl leading-8 text-gray-600 dark:text-gray-300">
                From the children of SOVCEST to the families of HELP - real
                stories from the communities CHADI serves, captured with
                dignity and told in their own words.
              </p>
              <a
                href="#all-stories"
                className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:scale-105"
              >
                Read Their Stories
              </a>
            </Reveal>

            <Reveal direction="right" delay={0.15}>
              <button
                type="button"
                onClick={() => setFeaturedOpen(true)}
                aria-label={`View ${featured.title} fullscreen`}
                className="group relative block h-96 w-full overflow-hidden rounded-3xl shadow-xl"
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-black/40 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                  Featured Story
                </span>
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-chadi-green transition group-hover:scale-110">
                    <FaExpand size={20} />
                  </span>
                </span>
                <span className="absolute bottom-5 left-5 right-5 text-left">
                  <span className="block text-xs font-semibold uppercase tracking-widest text-white/70">
                    CHADI &middot; Stories
                  </span>
                  <span className="mt-1 block text-xl font-bold text-white">
                    {featured.title}
                  </span>
                </span>
              </button>
            </Reveal>
          </div>
        </section>
      )}

      <section id="all-stories" className="scroll-mt-24 bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl space-y-8 px-6">
          {loading ? (
            <StoriesSkeleton />
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : remaining.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              We're gathering stories from the field. Check back soon.
            </p>
          ) : (
            <StaggerGrid className="space-y-8">
              {remaining.map((story) => (
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
                      <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
                        {story.excerpt}
                      </p>
                      {story.content && (
                        <div
                          className="prose prose-sm mt-4 max-w-none text-gray-600 dark:text-gray-300"
                          dangerouslySetInnerHTML={{ __html: story.content }}
                        />
                      )}
                      {story.personName && (
                        <p className="mt-5 font-semibold text-gray-700 dark:text-gray-200">
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

      {featured && (
        <Lightbox
          items={[{ type: "image", url: featured.image, caption: featured.title }]}
          index={featuredOpen ? 0 : null}
          onClose={() => setFeaturedOpen(false)}
          onNavigate={() => {}}
        />
      )}

      <Newsletter />
    </>
  );
}

export default Stories;
