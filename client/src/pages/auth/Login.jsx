import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-chadi-green">Admin Login</h1>
      <p className="mt-2 text-sm text-gray-600">
        Sign in to manage CHADI International's website content.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Password</span>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-chadi-green"
          />
        </label>

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-chadi-green px-6 py-3 font-semibold text-white transition hover:bg-chadi-gold hover:text-black disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <Link
        to="/admin/forgot-password"
        className="mt-6 block text-center text-sm font-semibold text-chadi-green hover:text-chadi-gold-dark"
      >
        Forgot your password?
      </Link>
    </>
  );
}

export default Login;
