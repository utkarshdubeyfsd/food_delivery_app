import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    // Mock only — any email/password combination "succeeds".
    login(email.trim());
    navigate("/account");
  }

  return (
    <div className="auth-page">
      <h1 className="page-title">Welcome back</h1>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>
        <button type="submit" className="btn-primary">
          Sign in
        </button>
      </form>
      <p className="status-text auth-page__switch">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}
