import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import StaggerGrid, { StaggerItem } from "../../components/common/StaggerGrid";
import volunteerImage from "../../assets/projects/green-africa.jpg";
import partnerImage from "../../assets/projects/clean-water.jpg";
import donateImage from "../../assets/projects/maternal-health.jpg";
import Newsletter from "../../components/common/Newsletter";

const OPPORTUNITY_KEYS = [
  { key: "volunteer", image: volunteerImage, path: "/volunteer" },
  { key: "partner", image: partnerImage, path: "/contact" },
  { key: "donate", image: donateImage, path: "/donate" },
];

function GetInvolved() {
  const { t } = useTranslation();
  const opportunities = OPPORTUNITY_KEYS.map(({ key, image, path }) => ({
    key,
    image,
    path,
    title: t(`getInvolved.${key}.title`),
    description: t(`getInvolved.${key}.description`),
    action: t(`getInvolved.${key}.action`),
  }));

  return (
    <>
      <Seo
        title={t("getInvolved.seoTitle")}
        path="/get-involved"
        description={t("getInvolved.seoDescription")}
      />

      <PageHeader
        title={t("getInvolved.title")}
        subtitle={t("getInvolved.subtitle")}
      />

      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          <StaggerGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((item) => (
              <StaggerItem key={item.key}>
                <div className="overflow-hidden rounded-3xl bg-chadi-cream shadow-lg">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-8">
                    <h2 className="text-3xl font-bold text-chadi-green dark:text-chadi-lightgreen">
                      {item.title}
                    </h2>
                    <p className="mt-5 leading-7 text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                    <Link
                      to={item.path}
                      className="mt-8 inline-block rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black"
                    >
                      {item.action}
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

export default GetInvolved;
