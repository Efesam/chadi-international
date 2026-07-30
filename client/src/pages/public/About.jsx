import { useTranslation } from "react-i18next";
import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import OurStory from "../../components/about/OurStory";
import VisionMission from "../../components/home/VisionMission";
import CoreValues from "../../components/about/CoreValues";
import ImpactTimeline from "../../components/about/ImpactTimeline";
import TeamShowcase from "../../components/common/TeamShowcase";
import Newsletter from "../../components/common/Newsletter";

function About() {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t("about.seoTitle")}
        path="/about"
        description={t("about.seoDescription")}
      />

      <PageHeader
        title={t("about.pageTitle")}
        subtitle={t("about.pageSubtitle")}
      />

      <OurStory />

      <VisionMission />

      <CoreValues />

      <ImpactTimeline />

      <TeamShowcase />

      <Newsletter />
    </>
  );
}

export default About;
