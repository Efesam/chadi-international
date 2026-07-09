import PageHeader from "../../components/common/PageHeader";
import { useCollection } from "../../hooks/useCollection";
import { galleryApi } from "../../services/api";

function Gallery() {
  const { data: photos, loading, error } = useCollection(galleryApi.list);

  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="A glimpse into CHADI programs, projects and community impact."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading gallery...</p>
          ) : error ? (
            <p className="text-center font-semibold text-red-600">{error}</p>
          ) : photos.length === 0 ? (
            <p className="text-center text-gray-500">
              Photos are on the way. Check back soon to see CHADI's work in pictures.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <figure
                  key={photo.id}
                  className="overflow-hidden rounded-xl bg-chadi-cream shadow-sm"
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="h-72 w-full object-cover"
                  />
                  <figcaption className="p-5 font-semibold text-chadi-green">
                    {photo.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Gallery;
