import { useState } from "react";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import CardGridSkeleton from "../../components/common/CardGridSkeleton";
import Reveal from "../../components/common/Reveal";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import BlogCard from "../../components/ui/BlogCard";
import { useCollection } from "../../hooks/useCollection";
import { blogApi } from "../../services/api";
import Newsletter from "../../components/common/Newsletter";

function Blog() {
  const { t, i18n } = useTranslation();
  const { data, loading, error } = useCollection(() => blogApi.list(i18n.language), [i18n.language]);
  const posts = data || [];
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(posts.map((post) => post.category).filter(Boolean))];
  const filteredPosts = category === "All" ? posts : posts.filter((post) => post.category === category);

  return (
    <>
      <Seo title={t("blog.seoTitle")} path="/blog" description={t("blog.seoDescription")} />

      <PageHeader title={t("blog.title")} subtitle={t("blog.subtitle")} />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <CardGridSkeleton count={6} columns={3} />
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">{t("blog.empty")}</p>
          ) : (
            <>
              {categories.length > 2 && (
                <Reveal className="mb-10 flex flex-wrap gap-3">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        category === item
                          ? "bg-chadi-green text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {item === "All" ? t("blog.allFilter") : item}
                    </button>
                  ))}
                </Reveal>
              )}

              {filteredPosts.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">{t("blog.noMatch")}</p>
              ) : (
                <StaggerGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPosts.map((post) => (
                    <StaggerItem key={post.id}>
                      <BlogCard post={post} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              )}
            </>
          )}
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default Blog;
