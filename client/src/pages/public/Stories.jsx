import PageHeader from "../../components/common/PageHeader";
import { projects } from "../../data/projects";

function Stories() {
  const stories = projects.slice(0, 4);

  return (
    <>
      <PageHeader
        title="Impact Stories"
        subtitle="Stories of practical change from CHADI-supported communities."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl space-y-8 px-6">
          {stories.map((story) => (
            <article
              key={story.id}
              className="grid gap-6 rounded-xl bg-chadi-cream p-6 shadow-sm md:grid-cols-[220px_1fr]"
            >
              <img
                src={story.image}
                alt={story.title}
                className="h-56 w-full rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold text-chadi-gold">
                  {story.location}
                </p>
                <h2 className="mt-2 text-3xl font-bold text-chadi-green">
                  {story.title}
                </h2>
                <p className="mt-4 leading-7 text-gray-600">
                  {story.summary}
                </p>
                <p className="mt-5 font-semibold text-gray-700">
                  Beneficiaries: {story.beneficiaries}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default Stories;
