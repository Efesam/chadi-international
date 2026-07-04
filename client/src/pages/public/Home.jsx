import Hero from "../../components/home/Hero";
import AboutPreview from "../../components/home/AboutPreview";
import VisionMission from "../../components/home/VisionMission";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import ProgramsSection from "../../components/home/ProgramsSection";
import ImpactCounter from "../../components/home/ImpactCounter";
// import FeaturedProjects from "../../components/home/FeaturedProjects";
// import SuccessStories from "../../components/home/SuccessStories";
// import PartnersSection from "../../components/home/PartnersSection";
// import LatestNews from "../../components/home/LatestNews";
import Newsletter from "../../components/common/Newsletter";
import FeaturedProjects from "../../components/home/FeaturedProjects";


function Home() {
  return (
    <>
      <Hero />

      <AboutPreview />

      <VisionMission />

      <WhyChooseUs />

      <ProgramsSection />

      <ImpactCounter />

       <FeaturedProjects /> 

      {/* <SuccessStories /> */}

      {/* <PartnersSection /> */}

      {/* <LatestNews /> */}

      <Newsletter />
    </>
  );
}

export default Home;