import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { news } from "../../data/news";

function NewsDetails() {
  const { slug } = useParams();
  const article = news.find((item) => item.slug === slug);

  if (!article) {
    return (
      <section className="bg-white py-28 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold text-chadi-green">
            Article Not Found
          </h1>
          <p className="mt-4 text-gray-600">
            The update you are looking for may have moved.
          </p>
          <Link
            to="/news"
            className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
          >
            Back to News
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader title={article.title} subtitle={article.excerpt} />

      <article className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-gray-500">
            <span className="rounded-full bg-chadi-gold px-4 py-2 text-black">
              {article.category}
            </span>
            <span>{article.date}</span>
            <span>{article.author}</span>
          </div>

          <div className="mt-10 space-y-6 text-lg leading-8 text-gray-700">
            {article.content
              .trim()
              .split("\n\n")
              .map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
          </div>

          <Link
            to="/news"
            className="mt-12 inline-block font-semibold text-chadi-green hover:text-chadi-gold"
          >
            Back to News
          </Link>
        </div>
      </article>
    </>
  );
}

export default NewsDetails;
