import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import Newsletter from "../../components/common/Newsletter";
import { useCollection } from "../../hooks/useCollection";
import { faqsApi } from "../../services/api";

function FAQ() {
  const { t, i18n } = useTranslation();
  const { data: faqs, loading, error } = useCollection(() => faqsApi.list(i18n.language), [i18n.language]);

  return (
    <>
      <Seo
        title={t("faq.seoTitle")}
        path="/faq"
        description={t("faq.seoDescription")}
      />

      <PageHeader
        title={t("faq.title")}
        subtitle={t("faq.subtitle")}
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">{t("faq.loading")}</p>
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : faqs.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">{t("faq.empty")}</p>
          ) : (
            <StaggerGrid className="space-y-5">
              {faqs.map((item) => (
                <StaggerItem key={item.id}>
                  <article className="rounded-xl bg-chadi-cream p-6">
                    <h2 className="text-2xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                      {item.question}
                    </h2>
                    <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">{item.answer}</p>
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

export default FAQ;
