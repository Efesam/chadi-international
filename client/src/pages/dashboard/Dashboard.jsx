import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaHandsHelping,
  FaDonate,
  FaProjectDiagram,
  FaCalendarAlt,
  FaUsers,
  FaImages,
  FaHandshake,
  FaBookOpen,
  FaEnvelopeOpenText,
  FaMoneyBillWave,
} from "react-icons/fa";
import { getAdminSummary } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const cards = [
  {
    key: "totalRaised",
    label: "Total Raised",
    icon: FaMoneyBillWave,
    to: "/admin/donations",
    format: (value) => `₦${Number(value || 0).toLocaleString()}`,
  },
  { key: "completedPayments", label: "Completed Donations", icon: FaDonate, to: "/admin/donations" },
  { key: "unreadMessages", label: "Unread Messages", icon: FaEnvelope, to: "/admin/messages" },
  { key: "volunteers", label: "Volunteer Applications", icon: FaHandsHelping, to: "/admin/volunteers" },
  { key: "donationInterests", label: "Donation Interest", icon: FaDonate, to: "/admin/donations" },
  { key: "newsletterSubscribers", label: "Newsletter Subscribers", icon: FaEnvelopeOpenText, to: "/admin/messages" },
  { key: "projects", label: "Projects", icon: FaProjectDiagram, to: "/admin/projects" },
  { key: "events", label: "Events", icon: FaCalendarAlt, to: "/admin/events" },
  { key: "team", label: "Team Members", icon: FaUsers, to: "/admin/team" },
  { key: "gallery", label: "Gallery Photos", icon: FaImages, to: "/admin/gallery" },
  { key: "partners", label: "Partners", icon: FaHandshake, to: "/admin/partners" },
  { key: "stories", label: "Stories", icon: FaBookOpen, to: "/admin/stories" },
];

function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminSummary()
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-chadi-green">
        Welcome back{user?.name ? `, ${user.name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Here's what's happening across the CHADI International website.
      </p>

      {loading ? (
        <p className="mt-8 text-gray-500">Loading overview...</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map(({ key, label, icon: Icon, to, format }) => (
            <Link
              key={key}
              to={to}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Icon className="text-chadi-green" size={22} />
              <p className="mt-4 text-3xl font-black text-gray-900">
                {format ? format(summary?.[key]) : summary?.[key] ?? 0}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-500">{label}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
