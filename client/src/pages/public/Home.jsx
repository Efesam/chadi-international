import Hero from "../../components/home/Hero";
import AboutPreview from "../../components/home/AboutPreview";
import Purpose from "../../components/home/Purpose";
import ProgramsSection from "../../components/home/ProgramsSection";
import ImpactCounter from "../../components/home/ImpactCounter";
import Newsletter from "../../components/common/Newsletter";
import FeaturedProjects from "../../components/home/FeaturedProjects";
import UpcomingEvents from "../../components/home/UpcomingEvents";
import PartnersSection from "../../components/home/PartnersSection";
import LatestNews from "../../components/home/LatestNews";
import CallToAction from "../../components/home/CallToAction";
import SuccessStories from "../../components/home/SuccessStories";

function Home() {
  return (
    <>
      <Hero />

      <AboutPreview />

      <Purpose />

      <ImpactCounter />

      <ProgramsSection />

      <FeaturedProjects />

      <SuccessStories />

      <UpcomingEvents />

      <PartnersSection />

      <LatestNews />

      <CallToAction />

      <Newsletter />
    </>
  );
}

export default Home;
