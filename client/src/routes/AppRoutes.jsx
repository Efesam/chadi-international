import { lazy, Suspense } from "react";
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
import Transparency from "../pages/public/Transparency";
import Governance from "../pages/public/Governance";
import Search from "../pages/public/Search";
import Terms from "../pages/public/Terms";
import ProjectDetails from "../pages/public/ProjectDetails";
import GetInvolved from "../pages/public/GetInvolved";
import Contact from "../pages/public/Contact";
import Donate from "../pages/public/Donate";
import NotFound from "../pages/public/NotFound";

// The admin dashboard (and its rich text editor, etc.) is a completely
// separate "app within an app" that only staff ever visit - lazy-loading it
// keeps all that extra weight out of every public visitor's first page load.
const Login = lazy(() => import("../pages/auth/Login"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const ManageProjects = lazy(() => import("../pages/dashboard/ManageProjects"));
const ManageNews = lazy(() => import("../pages/dashboard/ManageNews"));
const ManageEvents = lazy(() => import("../pages/dashboard/ManageEvents"));
const ManageTeam = lazy(() => import("../pages/dashboard/ManageTeam"));
const ManageGallery = lazy(() => import("../pages/dashboard/ManageGallery"));
const ManagePartners = lazy(() => import("../pages/dashboard/ManagePartners"));
const ManageStories = lazy(() => import("../pages/dashboard/ManageStories"));
const ManageTestimonials = lazy(() => import("../pages/dashboard/ManageTestimonials"));
const ManageFaqs = lazy(() => import("../pages/dashboard/ManageFaqs"));
const ManageReports = lazy(() => import("../pages/dashboard/ManageReports"));
const ManageBoard = lazy(() => import("../pages/dashboard/ManageBoard"));
const ManageMessages = lazy(() => import("../pages/dashboard/ManageMessages"));
const ManageVolunteers = lazy(() => import("../pages/dashboard/ManageVolunteers"));
const ManageDonations = lazy(() => import("../pages/dashboard/ManageDonations"));
const ManageUsers = lazy(() => import("../pages/dashboard/ManageUsers"));
const Settings = lazy(() => import("../pages/dashboard/Settings"));

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-chadi-cream">
      <p className="font-semibold text-chadi-green">Loading...</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

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
        <Route path="/transparency" element={<Transparency />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="/search" element={<Search />} />
        <Route path="/terms" element={<Terms />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin auth pages - redirect to the dashboard if already signed in */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminLoading />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/admin/forgot-password"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ForgotPassword />
              </Suspense>
            }
          />
          <Route
            path="/admin/reset-password"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ResetPassword />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* Admin dashboard - requires a signed-in session */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <Suspense fallback={<AdminLoading />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageProjects />
              </Suspense>
            }
          />
          <Route
            path="/admin/news"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageNews />
              </Suspense>
            }
          />
          <Route
            path="/admin/events"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageEvents />
              </Suspense>
            }
          />
          <Route
            path="/admin/team"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageTeam />
              </Suspense>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageGallery />
              </Suspense>
            }
          />
          <Route
            path="/admin/partners"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManagePartners />
              </Suspense>
            }
          />
          <Route
            path="/admin/stories"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageStories />
              </Suspense>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageTestimonials />
              </Suspense>
            }
          />
          <Route
            path="/admin/faqs"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageFaqs />
              </Suspense>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageReports />
              </Suspense>
            }
          />
          <Route
            path="/admin/board"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageBoard />
              </Suspense>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageMessages />
              </Suspense>
            }
          />
          <Route
            path="/admin/volunteers"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageVolunteers />
              </Suspense>
            }
          />
          <Route
            path="/admin/donations"
            element={
              <Suspense fallback={<AdminLoading />}>
                <ManageDonations />
              </Suspense>
            }
          />
          <Route element={<RequireAdmin />}>
            <Route
              path="/admin/users"
              element={
                <Suspense fallback={<AdminLoading />}>
                  <ManageUsers />
                </Suspense>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <Suspense fallback={<AdminLoading />}>
                  <Settings />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
