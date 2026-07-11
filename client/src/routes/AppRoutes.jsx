import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import RequireAdmin from "./RequireAdmin";
import PublicRoute from "./PublicRoute";

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

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Dashboard from "../pages/dashboard/Dashboard";
import ManagePrograms from "../pages/dashboard/ManagePrograms";
import ManageProjects from "../pages/dashboard/ManageProjects";
import ManageNews from "../pages/dashboard/ManageNews";
import ManageEvents from "../pages/dashboard/ManageEvents";
import ManageTeam from "../pages/dashboard/ManageTeam";
import ManageGallery from "../pages/dashboard/ManageGallery";
import ManagePartners from "../pages/dashboard/ManagePartners";
import ManageStories from "../pages/dashboard/ManageStories";
import ManageMessages from "../pages/dashboard/ManageMessages";
import ManageVolunteers from "../pages/dashboard/ManageVolunteers";
import ManageDonations from "../pages/dashboard/ManageDonations";
import ManageUsers from "../pages/dashboard/ManageUsers";
import Settings from "../pages/dashboard/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:slug" element={<ProgramsDetails />} />

        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetails />} />

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

        <Route path="/get-involved" element={<GetInvolved />} />

        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin auth pages - redirect to the dashboard if already signed in */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
        </Route>
      </Route>

      {/* Admin dashboard - requires a signed-in session */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/programs" element={<ManagePrograms />} />
          <Route path="/admin/projects" element={<ManageProjects />} />
          <Route path="/admin/news" element={<ManageNews />} />
          <Route path="/admin/events" element={<ManageEvents />} />
          <Route path="/admin/team" element={<ManageTeam />} />
          <Route path="/admin/gallery" element={<ManageGallery />} />
          <Route path="/admin/partners" element={<ManagePartners />} />
          <Route path="/admin/stories" element={<ManageStories />} />
          <Route path="/admin/messages" element={<ManageMessages />} />
          <Route path="/admin/volunteers" element={<ManageVolunteers />} />
          <Route path="/admin/donations" element={<ManageDonations />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
