import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import Newsletter from "../../components/common/Newsletter";
import { projectsApi, newsApi, eventsApi, blogApi } from "../../services/api";

function matches(query, ...fields) {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return fields.some((field) => String(field || "").toLowerCase().includes(q));
}

function ResultGroup({ title, items, renderItem }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-10 first:mt-0">
      <h2 className="text-sm font-bold uppercase tracking-widest text-chadi-gold-dark dark:text-chadi-gold">
        {title} ({items.length})
      </h2>
      <div className="mt-4 space-y-4">{items.map(renderItem)}</div>
    </div>
  );
}

function ResultRow({ to, title, description }) {
  return (
    <Link
      to={to}
      className="block rounded-xl border border-gray-100 p-5 transition hover:border-chadi-green hover:shadow-sm"
    >
      <p className="font-bold text-chadi-green dark:text-chadi-lightgreen">{title}</p>
      {description && <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">{description}</p>}
    </Link>
  );
}

/**
 * A single search across the three content types most worth finding
 * (Projects, News, Events) - fetches each collection once on mount and
 * filters client-side. Fine at this site's content volume; would need a
 * real search index/backend if the collections grow into the thousands.
 */
function Search() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState({ projects: [], news: [], events: [], blog: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      projectsApi.list(i18n.language),
      newsApi.list(i18n.language),
      eventsApi.list(i18n.language),
      blogApi.list(i18n.language),
    ])
      .then(([projects, news, events, blog]) => setData({ projects, news, events, blog }))
      .finally(() => setLoading(false));
  }, [i18n.language]);

  useEffect(() => {
    setSearchParams(query ? { q: query } : {}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reacting to `query`; re-running on setSearchParams identity changes would fight the URL sync it performs
  }, [query]);

  const results = useMemo(
    () => ({
      projects: data.projects.filter((p) => matches(query, p.title, p.summary, p.program, p.location)),
      news: data.news.filter((n) => matches(query, n.title, n.excerpt, n.category)),
      events: data.events.filter((e) => matches(query, e.title, e.description, e.type, e.location)),
      blog: data.blog.filter((post) => matches(query, post.title, post.excerpt, post.category, post.campaign)),
    }),
    [data, query]
  );

  const hasQuery = query.trim().length > 0;
  const totalResults = results.projects.length + results.news.length + results.events.length + results.blog.length;

  return (
    <>
      <Seo title={t("search.seoTitle")} path="/search" noindex description={t("search.seoDescription")} />

      <PageHeader title={t("search.title")} subtitle={t("search.subtitle")} />

      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl px-6">
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full rounded-xl border border-gray-200 px-5 py-4 text-lg outline-none focus:border-chadi-green"
          />

          {loading ? (
            <p className="mt-8 text-center text-gray-500 dark:text-gray-400">{t("search.loading")}</p>
          ) : !hasQuery ? (
            <p className="mt-8 text-center text-gray-500 dark:text-gray-400">{t("search.prompt")}</p>
          ) : totalResults === 0 ? (
            <p className="mt-8 text-center text-gray-500 dark:text-gray-400">{t("search.noResults", { query })}</p>
          ) : (
            <div>
              <ResultGroup
                title={t("search.projects")}
                items={results.projects}
                renderItem={(project) => (
                  <ResultRow
                    key={project.id}
                    to={`/projects/${project.slug}`}
                    title={project.title}
                    description={project.summary}
                  />
                )}
              />
              <ResultGroup
                title={t("search.news")}
                items={results.news}
                renderItem={(article) => (
                  <ResultRow
                    key={article.id}
                    to={`/news/${article.slug}`}
                    title={article.title}
                    description={article.excerpt}
                  />
                )}
              />
              <ResultGroup
                title={t("search.events")}
                items={results.events}
                renderItem={(event) => (
                  <ResultRow
                    key={event.id}
                    to="/events"
                    title={event.title}
                    description={event.description}
                  />
                )}
              />
              <ResultGroup
                title={t("search.blog")}
                items={results.blog}
                renderItem={(post) => (
                  <ResultRow
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    title={post.title}
                    description={post.excerpt}
                  />
                )}
              />
            </div>
          )}
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default Search;
