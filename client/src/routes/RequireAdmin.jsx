import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Wraps routes that only the "admin" role should reach (Admin Users,
 * Settings). An "editor" who navigates here directly (the nav link is
 * already hidden for them) sees a clear message instead of a broken page -
 * the real enforcement happens server-side either way.
 */
function RequireAdmin() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-chadi-green">Admins Only</h1>
        <p className="mt-3 text-gray-600">
          Your account doesn't have access to this page. Ask an admin if you
          need something changed here.
        </p>
      </div>
    );
  }

  return <Outlet />;
}

export default RequireAdmin;
