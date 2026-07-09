import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const data = await forgotPassword(email);
      setMessage(
        data.devResetToken
          ? `${data.message} (dev mode - reset link: /admin/reset-password?token=${data.devResetToken})`
          : data.message
      );
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-chadi-green">Forgot Password</h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter your admin email and we'll generate a password reset link.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p className="break-words text-sm font-semibold text-chadi-green">{message}</p>
        )}
      </form>

      <Link
        to="/admin/login"
        className="mt-6 block text-center text-sm font-semibold text-chadi-green hover:text-chadi-gold"
      >
        Back to login
      </Link>
    </>
  );
}

export default ForgotPassword;
