import Seo from "../../components/common/Seo";
import PageHeader from "../../components/common/PageHeader";
import OurStory from "../../components/about/OurStory";
import VisionMission from "../../components/home/VisionMission";
import CoreValues from "../../components/about/CoreValues";
import ImpactTimeline from "../../components/about/ImpactTimeline";
import TeamPreview from "../../components/about/TeamPreview";
import Newsletter from "../../components/common/Newsletter";

function About() {
  return (
    <>
      <Seo
        title="About Us"
        path="/about"
        description="Learn about CHADI International's mission, vision and the story behind our work empowering marginalized individuals and underserved communities."
      />

      <PageHeader
        title="About CHADI"
        subtitle="Empowering Marginalized Individuals & Underserved Communities"
      />

      <OurStory />

      <VisionMission />

      <CoreValues />

      <ImpactTimeline />

      <TeamPreview />

      <Newsletter />
    </>
  );
}

export default About;
