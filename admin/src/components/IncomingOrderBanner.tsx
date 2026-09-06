import { useOrders } from "../context/OrdersContext";
import type { AdminOrder } from "../types";

interface IncomingOrderBannerProps {
  onInspectOrder: (order: AdminOrder) => void;
}

export function IncomingOrderBanner({ onInspectOrder }: IncomingOrderBannerProps) {
  const { latestIncomingOrder, dismissLatestIncomingOrder, updateOrderStatus } = useOrders();

  if (!latestIncomingOrder) return null;

  function handleAccept() {
    if (!latestIncomingOrder) return;
    updateOrderStatus(latestIncomingOrder.id, "accepted", "Accepted via live order banner");
    dismissLatestIncomingOrder();
  }

  function handleView() {
    if (!latestIncomingOrder) return;
    onInspectOrder(latestIncomingOrder);
    dismissLatestIncomingOrder();
  }

  return (
    <div className="order-toast-container">
      <div className="order-toast">
        <div className="order-toast-header">
          <div className="order-toast-title">
            <span>🔔</span>
            <span>New Incoming Order!</span>
          </div>
          <button
            type="button"
            className="order-toast-close"
            onClick={dismissLatestIncomingOrder}
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>

        <div className="order-toast-body">
          <strong>{latestIncomingOrder.id}</strong> from{" "}
          <strong>{latestIncomingOrder.customer.name}</strong> at{" "}
          <em>{latestIncomingOrder.restaurantName}</em>
          <div style={{ marginTop: 2, color: "var(--ink-muted)" }}>
            {latestIncomingOrder.items.length} items • Total ${latestIncomingOrder.total.toFixed(2)}
          </div>
        </div>

        <div className="order-toast-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleAccept}
            id="btn-toast-accept"
          >
            Accept Now
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleView}
            id="btn-toast-view"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
