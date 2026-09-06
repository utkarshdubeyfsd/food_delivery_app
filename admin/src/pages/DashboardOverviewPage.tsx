import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useOrders } from "../context/OrdersContext";
import { useMenu } from "../context/MenuContext";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { OrderDetailsModal } from "../components/OrderDetailsModal";
import type { AdminOrder } from "../types";
import { ORDER_STATUS_MAP } from "../types";

export function DashboardOverviewPage() {
  const { selectedRestaurantId, activeRestaurant } = useAdminAuth();
  const { orders, updateOrderStatus, cancelOrder, simulateIncomingOrder } = useOrders();
  const { items } = useMenu();

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Filter based on active store
  const filteredOrders = orders.filter(
    (o) => selectedRestaurantId === "all" || o.restaurantId === selectedRestaurantId
  );
  const filteredItems = items.filter(
    (m) => selectedRestaurantId === "all" || m.restaurantId === selectedRestaurantId
  );

  const totalRevenue = filteredOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = filteredOrders.filter((o) => o.status === "placed");
  const inKitchenOrders = filteredOrders.filter(
    (o) => o.status === "accepted" || o.status === "preparing"
  );
  const inTransitOrders = filteredOrders.filter((o) => o.status === "out_for_delivery");

  const recentOrders = filteredOrders.slice(0, 5);

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: 4 }}>
            {activeRestaurant ? `${activeRestaurant.emoji} ${activeRestaurant.name} Overview` : "All Locations Overview"}
          </h1>
          <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem" }}>
            Real-time operations monitor, live incoming orders, and menu status.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => simulateIncomingOrder(selectedRestaurantId !== "all" ? selectedRestaurantId : undefined)}
            id="btn-overview-simulate"
          >
            ⚡ Test New Order
          </button>
          <Link to="/orders" className="btn btn-primary" id="btn-overview-view-all-orders">
            View Live Orders ({filteredOrders.length})
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          label="Today's Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          subtext="From active & fulfilled orders"
          icon="💰"
          colorScheme="green"
        />
        <StatCard
          label="Pending Review"
          value={pendingOrders.length}
          subtext={pendingOrders.length > 0 ? "Requires kitchen confirmation" : "All orders acknowledged"}
          icon="🔔"
          colorScheme="amber"
        />
        <StatCard
          label="Kitchen / In Prep"
          value={inKitchenOrders.length}
          subtext="Cooking & expeditor stage"
          icon="👨‍🍳"
          colorScheme="purple"
        />
        <StatCard
          label="Out for Delivery"
          value={inTransitOrders.length}
          subtext="With courier on route"
          icon="🛵"
          colorScheme="blue"
        />
      </div>

      {/* Two Column Layout: Recent Orders & Quick Controls */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, marginTop: 12 }}>
        {/* Recent Orders Table */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", padding: 20, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: "1.15rem" }}>Recent Incoming Orders</h3>
            <Link to="/orders" style={{ fontSize: "0.82rem", color: "var(--primary)", fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--ink-muted)" }}>
              No orders found for this location. Click "Test New Order" above to generate one!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recentOrders.map((order) => {
                const nextAction = ORDER_STATUS_MAP[order.status]?.nextStatus;
                const actionLabel = ORDER_STATUS_MAP[order.status]?.actionLabel;

                return (
                  <div
                    key={order.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 14px",
                      backgroundColor: "var(--surface-subtle)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.95rem" }}>
                          {order.id}
                        </span>
                        <StatusBadge status={order.status} size="sm" />
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--ink-secondary)", marginTop: 2 }}>
                        {order.customer.name} • {order.items.length} items • ${order.total.toFixed(2)}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Inspect
                      </button>
                      {nextAction && order.status !== "cancelled" && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => updateOrderStatus(order.id, nextAction)}
                        >
                          {actionLabel || "Advance"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Store & Menu Overview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Menu Snapshot */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", padding: 20, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: "1.15rem" }}>Menu Management</h3>
              <Link to="/menu" style={{ fontSize: "0.82rem", color: "var(--primary)", fontWeight: 600 }}>
                Manage Menu &rarr;
              </Link>
            </div>

            <p style={{ fontSize: "0.86rem", color: "var(--ink-secondary)", marginBottom: 16 }}>
              Total of <strong>{filteredItems.length} menu items</strong> registered for this location.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: 12, backgroundColor: "#ecfdf5", borderRadius: "var(--radius-md)", border: "1px solid #a7f3d0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#065f46", textTransform: "uppercase" }}>
                  In Stock
                </span>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#065f46" }}>
                  {filteredItems.filter((i) => i.isAvailable).length}
                </div>
              </div>

              <div style={{ padding: 12, backgroundColor: "#fef2f2", borderRadius: "var(--radius-md)", border: "1px solid #fecaca" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#991b1b", textTransform: "uppercase" }}>
                  Sold Out
                </span>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#991b1b" }}>
                  {filteredItems.filter((i) => !i.isAvailable).length}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Link to="/menu" className="btn btn-secondary" style={{ width: "100%" }}>
                + Add or Edit Menu Items
              </Link>
            </div>
          </div>

          {/* Quick Guide */}
          <div
            style={{
              background: "linear-gradient(135deg, #0e382c 0%, #174b3d 100%)",
              color: "#ffffff",
              borderRadius: "var(--radius-lg)",
              padding: 20,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h4 style={{ color: "#ffffff", marginBottom: 6, fontSize: "1.05rem" }}>
              Phase 2 Mocked Features
            </h4>
            <ul style={{ fontSize: "0.82rem", lineHeight: 1.6, paddingLeft: 18, opacity: 0.9 }}>
              <li>Full menu management with Add, Edit, Delete &amp; Stock toggles.</li>
              <li>Order feed with step-by-step status transitions.</li>
              <li>Simulation button creates realistic live orders with sounds.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={(id, status, note) => {
          updateOrderStatus(id, status, note);
          if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder({
              ...selectedOrder,
              status,
              history: [...selectedOrder.history, { status, timestamp: Date.now(), note }],
            });
          }
        }}
        onCancelOrder={(id, reason) => {
          cancelOrder(id, reason);
          if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder({
              ...selectedOrder,
              status: "cancelled",
              history: [...selectedOrder.history, { status: "cancelled", timestamp: Date.now(), note: reason }],
            });
          }
        }}
      />
    </div>
  );
}
