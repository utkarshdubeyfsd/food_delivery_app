import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useOrders } from "../context/OrdersContext";
import { IncomingOrderBanner } from "../components/IncomingOrderBanner";
import { OrderDetailsModal } from "../components/OrderDetailsModal";
import type { AdminOrder } from "../types";

export function AdminLayout() {
  const { user, logout, restaurants, selectedRestaurantId, setSelectedRestaurantId } =
    useAdminAuth();
  const {
    orders,
    simulateIncomingOrder,
    autoSimulate,
    setAutoSimulate,
    soundEnabled,
    setSoundEnabled,
    updateOrderStatus,
    cancelOrder,
  } = useOrders();
  const navigate = useNavigate();

  const [inspectingOrder, setInspectingOrder] = useState<AdminOrder | null>(null);

  // Active incoming orders count for badge
  const pendingOrdersCount = orders.filter(
    (o) =>
      (selectedRestaurantId === "all" || o.restaurantId === selectedRestaurantId) &&
      (o.status === "placed" || o.status === "accepted" || o.status === "preparing")
  ).length;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleTriggerSimulation() {
    simulateIncomingOrder(
      selectedRestaurantId !== "all" ? selectedRestaurantId : undefined
    );
  }

  return (
    <div className="admin-shell">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="brand-badge">
            <div className="brand-icon">🌿</div>
            <div className="brand-text">
              <h2>Harvest &amp; Home</h2>
              <span className="brand-subtitle">Admin Console</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Management</span>

          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            id="nav-overview"
          >
            <div className="nav-link-content">
              <span>📊</span>
              <span>Overview</span>
            </div>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            id="nav-orders"
          >
            <div className="nav-link-content">
              <span>📋</span>
              <span>Live Orders</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="nav-badge" id="badge-pending-orders">
                {pendingOrdersCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/menu"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            id="nav-menu"
          >
            <div className="nav-link-content">
              <span>🍽️</span>
              <span>Menu Catalog</span>
            </div>
          </NavLink>

          <span className="nav-section-label" style={{ marginTop: 12 }}>
            Settings &amp; App
          </span>

          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            id="nav-settings"
          >
            <div className="nav-link-content">
              <span>⚙️</span>
              <span>Store Settings</span>
            </div>
          </NavLink>

          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
            style={{ marginTop: 8 }}
            title="Open customer food delivery application in a new tab"
          >
            <div className="nav-link-content">
              <span>🛍️</span>
              <span>Customer Storefront</span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>↗</span>
          </a>
        </nav>

        {/* User Pill / Logout */}
        <div className="sidebar-footer">
          {user && (
            <div className="admin-profile-pill">
              <div className="user-info">
                <div className="user-avatar">{user.name.charAt(0)}</div>
                <div className="user-meta">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role-tag">{user.role.replace("_", " ")}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                title="Log Out"
                id="btn-sidebar-logout"
              >
                🚪
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="admin-content">
        {/* Top bar Header */}
        <header className="admin-header">
          <div className="header-left">
            <div className="restaurant-select-wrapper">
              <select
                className="restaurant-select"
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                id="header-restaurant-select"
              >
                <option value="all">🌐 All Locations (Multi-Store)</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.emoji} {r.name}
                  </option>
                ))}
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          <div className="header-actions">
            {/* Simulation pill */}
            <div className="sim-controls-pill">
              <span className="sim-label">
                <span>Simulation</span>
              </span>

              <button
                type="button"
                className="btn-simulate"
                onClick={handleTriggerSimulation}
                title="Simulate a new incoming customer order right now"
                id="btn-simulate-order"
              >
                <span>⚡</span>
                <span>+ Simulate Order</span>
              </button>

              <button
                type="button"
                className="btn-icon btn-sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Mute notification sound" : "Enable order chime"}
                id="btn-toggle-sound"
              >
                {soundEnabled ? "🔔" : "🔕"}
              </button>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: "0.72rem",
                  color: "#854d0e",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                title="Automatically create simulated incoming orders every 25 seconds"
              >
                <input
                  type="checkbox"
                  checked={autoSimulate}
                  onChange={(e) => setAutoSimulate(e.target.checked)}
                />
                Auto
              </label>
            </div>
          </div>
        </header>

        {/* Child Pages */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>

      {/* Global incoming order toast banner */}
      <IncomingOrderBanner onInspectOrder={(order) => setInspectingOrder(order)} />

      {/* Order inspection modal */}
      <OrderDetailsModal
        order={inspectingOrder}
        onClose={() => setInspectingOrder(null)}
        onUpdateStatus={(id, status, note) => {
          updateOrderStatus(id, status, note);
          if (inspectingOrder && inspectingOrder.id === id) {
            setInspectingOrder({
              ...inspectingOrder,
              status,
              history: [
                ...inspectingOrder.history,
                { status, timestamp: Date.now(), note },
              ],
            });
          }
        }}
        onCancelOrder={(id, reason) => {
          cancelOrder(id, reason);
          if (inspectingOrder && inspectingOrder.id === id) {
            setInspectingOrder({
              ...inspectingOrder,
              status: "cancelled",
              history: [
                ...inspectingOrder.history,
                { status: "cancelled", timestamp: Date.now(), note: reason },
              ],
            });
          }
        }}
      />
    </div>
  );
}
