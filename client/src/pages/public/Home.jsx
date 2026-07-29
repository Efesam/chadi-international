import Seo from "../../components/common/Seo";
import Hero from "../../components/home/Hero";
import AboutPreview from "../../components/home/AboutPreview";
import VisionMission from "../../components/home/VisionMission";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import ImpactCounter from "../../components/home/ImpactCounter";
import Newsletter from "../../components/common/Newsletter";
import FeaturedProjects from "../../components/home/FeaturedProjects";
import UpcomingEvents from "../../components/home/UpcomingEvents";
import PartnersSection from "../../components/home/PartnersSection";
import LatestNews from "../../components/home/LatestNews";
import SocialProof from "../../components/home/SocialProof";
import CallToAction from "../../components/home/CallToAction";
import SuccessStories from "../../components/home/SuccessStories";
import TeamShowcase from "../../components/common/TeamShowcase";


function Home() {
  return (
    <>
      <Seo
        path="/"
        description="CHADI International empowers marginalized individuals and underserved communities in Nigeria and across Africa through health, education, livelihood and community development programs."
      />

      <Hero />

      <AboutPreview />

      <VisionMission />

      <WhyChooseUs />

      <ImpactCounter />

      <FeaturedProjects />

      <TeamShowcase />

      <SuccessStories />

      <UpcomingEvents />

      <PartnersSection />

      <LatestNews />

      <SocialProof />

      <CallToAction />

      <Newsletter />
    </>
  );
}

export default Home;
