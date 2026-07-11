import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaCalendarAlt,
  FaUsers,
  FaImages,
  FaHandshake,
  FaBookOpen,
  FaEnvelope,
  FaHandsHelping,
  FaDonate,
  FaUserShield,
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaLayerGroup,
  FaNewspaper,
} from "react-icons/fa";
import Logo from "../components/common/Logo";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/admin/programs", label: "Programs", icon: FaLayerGroup },
  { to: "/admin/projects", label: "Projects", icon: FaProjectDiagram },
  { to: "/admin/news", label: "News", icon: FaNewspaper },
  { to: "/admin/events", label: "Events", icon: FaCalendarAlt },
  { to: "/admin/team", label: "Team", icon: FaUsers },
  { to: "/admin/gallery", label: "Gallery", icon: FaImages },
  { to: "/admin/partners", label: "Partners", icon: FaHandshake },
  { to: "/admin/stories", label: "Stories", icon: FaBookOpen },
  { to: "/admin/messages", label: "Messages", icon: FaEnvelope },
  { to: "/admin/volunteers", label: "Volunteers", icon: FaHandsHelping },
  { to: "/admin/donations", label: "Donations", icon: FaDonate },
  { to: "/admin/users", label: "Admin Users", icon: FaUserShield, adminOnly: true },
  { to: "/admin/settings", label: "Settings", icon: FaCog, adminOnly: true },
];

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || user?.role === "admin");

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-chadi-green transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Logo light />
          <button
            type="button"
            className="text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="mt-2 space-y-1 px-4">
          {visibleNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-chadi-gold text-black"
                    : "text-chadi-lightgreen hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-white/10 p-4">
          <p className="truncate px-2 text-sm font-semibold text-white">
            {user?.name}
          </p>
          <p className="truncate px-2 text-xs text-chadi-lightgreen">{user?.email}</p>
          <button
            type="button"
            onClick={signOut}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            <FaSignOutAlt /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4 lg:hidden">
          <Logo />
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-chadi-green"
            aria-label="Open menu"
          >
            <FaBars size={22} />
          </button>
        </header>

        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
