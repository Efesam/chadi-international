import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Guards the auth pages (login, forgot/reset password) so an already
 * signed-in admin gets sent straight to the dashboard instead of the form.
 */
function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-chadi-cream">
        <p className="font-semibold text-chadi-green">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
