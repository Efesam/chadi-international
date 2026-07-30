import { Outlet, Link } from "react-router-dom";
import Logo from "../components/common/Logo";

function AuthLayout() {
  // Fixed light cream, not the reactive bg-chadi-cream utility - this is a
  // staff-only auth flow (like the rest of the admin dashboard), so it
  // intentionally never participates in the public site's dark mode.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFBE6] px-6 py-12">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg sm:p-10">
        <Outlet />
      </div>

      <Link
        to="/"
        className="mt-8 text-sm font-semibold text-chadi-green hover:text-chadi-gold-dark"
      >
        &larr; Back to the CHADI website
      </Link>
    </div>
  );
}

export default AuthLayout;
