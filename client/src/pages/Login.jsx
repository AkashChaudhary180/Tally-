import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-semibold text-ink mb-2">
            Welcome back
          </h1>
          <p className="text-ink-light text-sm">Log in to settle up with your people.</p>
        </div>

        <form onSubmit={handleSubmit} className="receipt-card p-8 space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-ink-light mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line rounded px-3 py-2.5 bg-paper focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-ink-light mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line rounded px-3 py-2.5 bg-paper focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-rust text-sm bg-rust-light px-3 py-2 rounded">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper font-medium py-2.5 rounded hover:bg-ink/90 transition disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-ink-light mt-6">
          New here?{" "}
          <Link to="/signup" className="text-rust font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;