import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Projects from "../pages/public/Projects";
import GetInvolved from "../pages/public/GetInvolved";
import Contact from "../pages/public/Contact";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/projects" element={<Projects />} />

<Route path="/projects/:slug" element={<ProjectDetails />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/get-involved" element={<GetInvolved />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;