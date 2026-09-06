import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="empty-state">
        <h2>You're not signed in</h2>
        <p className="status-text">Sign in to see your account details and order history.</p>
        <Link className="btn-primary btn-link" to="/login">
          Sign in
        </Link>
      </div>
    );
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div>
      <h1 className="page-title">Account</h1>
      <div className="account-card">
        <p className="menu-item__name">{user.name}</p>
        <p className="status-text">{user.email}</p>
      </div>
      <Link className="link-back" to="/orders">
        View order history →
      </Link>
      <button className="btn-primary btn-danger" onClick={handleLogout}>
        Sign out
      </button>
    </div>
  );
}
