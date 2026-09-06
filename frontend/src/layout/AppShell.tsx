import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export function AppShell() {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="topbar">
        <span className="topbar__logo" onClick={() => navigate("/")} role="button" tabIndex={0}>
          Harvest &amp; Home
        </span>
        {user ? (
          <span className="topbar__user">Hi, {user.name}</span>
        ) : (
          <button className="topbar__signin" onClick={() => navigate("/login")}>
            Sign in
          </button>
        )}
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/" end className="bottom-nav__link">
          <span aria-hidden="true">🏠</span>
          Home
        </NavLink>
        <NavLink to="/cart" className="bottom-nav__link">
          <span aria-hidden="true">🛒</span>
          Cart
          {itemCount > 0 && <span className="bottom-nav__badge">{itemCount}</span>}
        </NavLink>
        <NavLink to="/orders" className="bottom-nav__link">
          <span aria-hidden="true">📦</span>
          Orders
        </NavLink>
        <NavLink to="/account" className="bottom-nav__link">
          <span aria-hidden="true">👤</span>
          Account
        </NavLink>
      </nav>
    </div>
  );
}
