import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Projects from "../pages/public/Projects";
import Programs from "../pages/public/Programs";
import ProgramsDetails from "../pages/public/ProgramsDetails";
import News from "../pages/public/News";
import NewsDetails from "../pages/public/NewsDetails";
import Team from "../pages/public/Team";
import Events from "../pages/public/Events";
import Gallery from "../pages/public/Gallery";
import Stories from "../pages/public/Stories";
import Partners from "../pages/public/Partners";
import Resources from "../pages/public/Resources";
import FAQ from "../pages/public/FAQ";
import Careers from "../pages/public/Careers";
import Volunteer from "../pages/public/Volunteer";
import Privacy from "../pages/public/Privacy";
import Terms from "../pages/public/Terms";
import ProjectDetails from "../pages/public/ProjectDetails";
import GetInvolved from "../pages/public/GetInvolved";
import Contact from "../pages/public/Contact";
import Donate from "../pages/public/Donate";
import NotFound from "../pages/public/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:slug" element={<ProgramsDetails />} />

        <Route path="/projects" element={<Projects />} />
        <Route
          path="/projects/:slug"
          element={<ProjectDetails />}
        />

        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetails />} />

        <Route path="/team" element={<Team />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/careers" element={<Careers />} />

        <Route
          path="/get-involved"
          element={<GetInvolved />}
        />

        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
