import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err) {
      setError(err.message || "Could not reset password");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <>
        <h1 className="text-2xl font-bold text-chadi-green">Invalid Link</h1>
        <p className="mt-2 text-sm text-gray-600">
          This reset link is missing its token. Request a new one from the
          forgot password page.
        </p>
        <Link
          to="/admin/forgot-password"
          className="mt-6 block text-center text-sm font-semibold text-chadi-green hover:text-chadi-gold"
        >
          Request a new link
        </Link>
      </>
    );
  }

  if (done) {
    return (
      <>
        <h1 className="text-2xl font-bold text-chadi-green">Password Updated</h1>
        <p className="mt-2 text-sm text-gray-600">Redirecting you to login...</p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-chadi-green">Reset Password</h1>
      <p className="mt-2 text-sm text-gray-600">Choose a new password below.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">New Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Confirm Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
          />
        </label>

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}

export default ResetPassword;
