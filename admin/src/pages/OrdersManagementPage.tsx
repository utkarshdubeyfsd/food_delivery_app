import { useState, useMemo } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useOrders } from "../context/OrdersContext";
import { StatusBadge } from "../components/StatusBadge";
import { OrderDetailsModal } from "../components/OrderDetailsModal";
import type { AdminOrder, OrderStatus } from "../types";
import { ORDER_STATUS_MAP } from "../types";

type StatusFilterTab = "all" | OrderStatus;

export function OrdersManagementPage() {
  const { selectedRestaurantId, activeRestaurant } = useAdminAuth();
  const {
    orders,
    updateOrderStatus,
    cancelOrder,
    simulateIncomingOrder,
  } = useOrders();

  const [activeTab, setActiveTab] = useState<StatusFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectingOrder, setInspectingOrder] = useState<AdminOrder | null>(null);

  // Filter orders by active location, tab, and search
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStore =
        selectedRestaurantId === "all" || order.restaurantId === selectedRestaurantId;
      const matchesTab = activeTab === "all" || order.status === activeTab;
      const matchesSearch =
        !searchQuery.trim() ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery) ||
        order.address.line1.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStore && matchesTab && matchesSearch;
    });
  }, [orders, selectedRestaurantId, activeTab, searchQuery]);

  // Tab counts
  const counts = useMemo(() => {
    const base = orders.filter(
      (o) => selectedRestaurantId === "all" || o.restaurantId === selectedRestaurantId
    );
    return {
      all: base.length,
      placed: base.filter((o) => o.status === "placed").length,
      accepted: base.filter((o) => o.status === "accepted").length,
      preparing: base.filter((o) => o.status === "preparing").length,
      out_for_delivery: base.filter((o) => o.status === "out_for_delivery").length,
      delivered: base.filter((o) => o.status === "delivered").length,
      cancelled: base.filter((o) => o.status === "cancelled").length,
    };
  }, [orders, selectedRestaurantId]);

  function formatTimeAgo(timestamp: number) {
    const elapsedMinutes = Math.floor((Date.now() - timestamp) / (60 * 1000));
    if (elapsedMinutes < 1) return "Just now";
    if (elapsedMinutes === 1) return "1 min ago";
    if (elapsedMinutes < 60) return `${elapsedMinutes} mins ago`;
    const hours = Math.floor(elapsedMinutes / 60);
    return `${hours}h ago`;
  }

  return (
    <div>
      {/* Header */}
      <div className="orders-page-header">
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: 4 }}>
            Incoming Orders &amp; Dispatch
            {activeRestaurant && ` — ${activeRestaurant.name}`}
          </h1>
          <p style={{ color: "var(--ink-muted)", fontSize: "0.92rem" }}>
            Monitor incoming customer tickets, update kitchen progress, and manage live courier dispatch.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            simulateIncomingOrder(
              selectedRestaurantId !== "all" ? selectedRestaurantId : undefined
            )
          }
          id="btn-trigger-order-simulation"
        >
          <span>⚡</span>
          <span>Simulate Incoming Order</span>
        </button>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="toolbar-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by order #ORD-xxxx, customer name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="orders-search-input"
          />
        </div>

        <div className="filter-pills-row">
          <button
            type="button"
            className={`filter-pill ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Orders ({counts.all})
          </button>
          <button
            type="button"
            className={`filter-pill ${activeTab === "placed" ? "active" : ""}`}
            onClick={() => setActiveTab("placed")}
            style={{ color: counts.placed > 0 ? "#b45309" : undefined, fontWeight: counts.placed > 0 ? 700 : undefined }}
          >
            🔔 Placed ({counts.placed})
          </button>
          <button
            type="button"
            className={`filter-pill ${activeTab === "accepted" ? "active" : ""}`}
            onClick={() => setActiveTab("accepted")}
          >
            Accepted ({counts.accepted})
          </button>
          <button
            type="button"
            className={`filter-pill ${activeTab === "preparing" ? "active" : ""}`}
            onClick={() => setActiveTab("preparing")}
          >
            🍳 Preparing ({counts.preparing})
          </button>
          <button
            type="button"
            className={`filter-pill ${activeTab === "out_for_delivery" ? "active" : ""}`}
            onClick={() => setActiveTab("out_for_delivery")}
          >
            🛵 In Transit ({counts.out_for_delivery})
          </button>
          <button
            type="button"
            className={`filter-pill ${activeTab === "delivered" ? "active" : ""}`}
            onClick={() => setActiveTab("delivered")}
          >
            Delivered ({counts.delivered})
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📦</div>
          <h3 style={{ marginBottom: 6 }}>No Orders in this view</h3>
          <p style={{ color: "var(--ink-muted)", fontSize: "0.9rem", maxWidth: 400, margin: "0 auto 16px" }}>
            There are currently no tickets matching this tab. Click the button below to generate a real-time incoming order.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              simulateIncomingOrder(
                selectedRestaurantId !== "all" ? selectedRestaurantId : undefined
              )
            }
          >
            + Create Simulated Order
          </button>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => {
            const statusConfig = ORDER_STATUS_MAP[order.status];
            const nextStatus = statusConfig.nextStatus;
            const actionLabel = statusConfig.actionLabel;

            return (
              <div
                key={order.id}
                className={`order-card ${order.status === "placed" ? "highlight" : ""}`}
                id={`order-card-${order.id}`}
              >
                <div>
                  <div className="order-card-header">
                    <div className="order-id-group">
                      <span className="order-id">{order.id}</span>
                      <span className="order-store-name">
                        🏪 {order.restaurantName}
                      </span>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="order-customer-row">
                      <span className="customer-name">{order.customer.name}</span>
                      <span className="order-time">{formatTimeAgo(order.placedAt)}</span>
                    </div>

                    <div className="order-address-box">
                      📍 {order.address.line1}, {order.address.city}
                      {order.address.instructions && (
                        <div style={{ color: "var(--accent)", fontStyle: "italic", marginTop: 2 }}>
                          "{order.address.instructions}"
                        </div>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="order-items-list">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="order-item-row">
                          <span>
                            <span className="order-item-qty">{it.quantity}x</span>
                            {it.name}
                          </span>
                          <span className="order-item-price">
                            ${(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <div>
                    <span style={{ fontSize: "0.74rem", color: "var(--ink-muted)", display: "block" }}>
                      Total Amount
                    </span>
                    <span className="order-total-amount">${order.total.toFixed(2)}</span>
                  </div>

                  <div className="order-actions-group">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setInspectingOrder(order)}
                      id={`btn-inspect-${order.id}`}
                    >
                      Details
                    </button>

                    {nextStatus && order.status !== "cancelled" && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => updateOrderStatus(order.id, nextStatus)}
                        id={`btn-status-action-${order.id}`}
                      >
                        {actionLabel} &rarr;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Inspector */}
      <OrderDetailsModal
        order={inspectingOrder}
        onClose={() => setInspectingOrder(null)}
        onUpdateStatus={(id, status, note) => {
          updateOrderStatus(id, status, note);
          if (inspectingOrder && inspectingOrder.id === id) {
            setInspectingOrder({
              ...inspectingOrder,
              status,
              history: [...inspectingOrder.history, { status, timestamp: Date.now(), note }],
            });
          }
        }}
        onCancelOrder={(id, reason) => {
          cancelOrder(id, reason);
          if (inspectingOrder && inspectingOrder.id === id) {
            setInspectingOrder({
              ...inspectingOrder,
              status: "cancelled",
              history: [...inspectingOrder.history, { status: "cancelled", timestamp: Date.now(), note: reason }],
            });
          }
        }}
      />
    </div>
  );
}
