import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import CardGridSkeleton from "../../components/common/CardGridSkeleton";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import { useCollection } from "../../hooks/useCollection";
import { galleryApi } from "../../services/api";
import Newsletter from "../../components/common/Newsletter";

function Gallery() {
  const { t, i18n } = useTranslation();
  const { data: photos, loading, error } = useCollection(() => galleryApi.list(i18n.language), [i18n.language]);

  return (
    <>
      <Seo
        title={t("gallery.seoTitle")}
        path="/gallery"
        description={t("gallery.seoDescription")}
      />

      <PageHeader
        title={t("gallery.title")}
        subtitle={t("gallery.subtitle")}
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <CardGridSkeleton count={6} columns={3} />
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : photos.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              {t("gallery.empty")}
            </p>
          ) : (
            <StaggerGrid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <StaggerItem key={photo.id}>
                  <figure className="overflow-hidden rounded-xl bg-chadi-cream shadow-sm">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      loading="lazy"
                      className="h-72 w-full object-cover"
                    />
                    <figcaption className="p-5 font-semibold text-chadi-green dark:text-chadi-lightgreen">
                      {photo.title}
                    </figcaption>
                  </figure>
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

export default Gallery;
