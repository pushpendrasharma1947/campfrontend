import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);
      const token = data?.token || data?.accessToken || "";
      if (!token) {
        throw new Error("Invalid response from server");
      }

      login(token);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Login failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-1 text-sm text-slate-600">Enter your email and password to continue.</p>

        {error ? (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{' '}
          <button
            type="button"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
          .
        </p>
      </div>
    </main>
  );
}
