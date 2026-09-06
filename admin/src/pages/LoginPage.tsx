import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { ADMIN_PRESET_USERS } from "../mocks/adminData";
import type { AdminRole } from "../types";

export function LoginPage() {
  const { login, quickLogin } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@harvestandhome.com");
  const [password, setPassword] = useState("admin123");
  const [role, setRole] = useState<AdminRole>("super_admin");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid administrator email address.");
      return;
    }
    if (!password) {
      setError("Please enter your admin password.");
      return;
    }

    const success = login(email.trim(), role);
    if (success) {
      navigate("/");
    } else {
      setError("Invalid administrative credentials.");
    }
  }

  function handlePresetClick(presetId: string) {
    quickLogin(presetId);
    navigate("/");
  }

  return (
    <div className="login-screen-container">
      <div className="login-card">
        <div className="login-brand-header">
          <div className="login-brand-icon">🌿</div>
          <h1 className="login-brand-title">Admin Console</h1>
          <p className="login-brand-desc">
            Harvest &amp; Home Food Delivery Portal
          </p>
        </div>

        {/* Quick Demo Logins */}
        <div className="login-presets-section">
          <span className="login-presets-label">⚡ 1-Click Demo Profiles</span>
          <div className="presets-btns-row">
            {ADMIN_PRESET_USERS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="preset-btn"
                onClick={() => handlePresetClick(preset.id)}
                id={`btn-preset-${preset.role}`}
              >
                <div>{preset.name.split(" ")[0]}</div>
                <div style={{ fontSize: "0.68rem", color: "var(--ink-faint)" }}>
                  {preset.role.replace("_", " ")}
                </div>
              </button>
            ))}
          </div>
        </div>

        {error && <div className="login-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@store.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-role">
              Administrative Role
            </label>
            <select
              id="login-role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
            >
              <option value="super_admin">Super Admin (All Restaurants)</option>
              <option value="store_manager">Store Manager</option>
              <option value="kitchen_lead">Kitchen Lead / Expediter</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "11px", marginTop: 6 }}
            id="btn-login-submit"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--ink-faint)" }}>
          Phase 2 Click-Through Prototype with Mocked Data
        </div>
      </div>
    </div>
  );
}
