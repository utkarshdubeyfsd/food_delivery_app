import { useState } from "react";
import type { AdminOrder, OrderStatus } from "../types";
import { ORDER_STATUS_MAP, ORDER_STATUS_SEQUENCE } from "../types";
import { StatusBadge } from "./StatusBadge";

interface OrderDetailsModalProps {
  order: AdminOrder | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  onCancelOrder: (orderId: string, reason?: string) => void;
}

export function OrderDetailsModal({
  order,
  onClose,
  onUpdateStatus,
  onCancelOrder,
}: OrderDetailsModalProps) {
  const [customNote, setCustomNote] = useState("");

  if (!order) return null;

  const statusMeta = ORDER_STATUS_MAP[order.status];
  const nextStatus = statusMeta.nextStatus;

  function handleAdvance() {
    if (!nextStatus || !order) return;
    onUpdateStatus(order.id, nextStatus, customNote.trim() || undefined);
    setCustomNote("");
  }

  function handleCancel() {
    if (!order) return;
    const reason = window.prompt("Reason for cancellation (optional):", "Customer requested cancellation");
    if (reason !== null) {
      onCancelOrder(order.id, reason);
    }
  }

  const currentStepIndex = ORDER_STATUS_SEQUENCE.indexOf(order.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="order-id" style={{ fontSize: "1.2rem" }}>{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>
              {order.restaurantName} • Placed {new Date(order.placedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="modal-body order-details-drawer">
          {/* Status Progression Bar */}
          {order.status !== "cancelled" ? (
            <div
              style={{
                backgroundColor: "var(--surface-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "16px 20px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="timeline-track">
                {ORDER_STATUS_SEQUENCE.map((step, idx) => {
                  const isCompleted = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;
                  const label = ORDER_STATUS_MAP[step].label;

                  return (
                    <div
                      key={step}
                      className={`timeline-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                    >
                      <div className="step-node">
                        {isCompleted ? "✓" : idx + 1}
                      </div>
                      <span className="step-label">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
                color: "#991b1b",
                fontSize: "0.88rem",
              }}
            >
              ❌ This order was cancelled.
            </div>
          )}

          {/* Customer & Delivery Information */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              backgroundColor: "#ffffff",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: 16,
            }}
          >
            <div>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--ink-faint)" }}>
                Customer Information
              </span>
              <div style={{ fontWeight: 600, marginTop: 4, color: "var(--ink-primary)" }}>
                {order.customer.name}
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--ink-secondary)" }}>
                📞 {order.customer.phone}
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--ink-muted)" }}>
                ✉️ {order.customer.email}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--ink-faint)" }}>
                Delivery Destination
              </span>
              <div style={{ fontWeight: 600, marginTop: 4, color: "var(--ink-primary)" }}>
                {order.address.line1}
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--ink-secondary)" }}>
                {order.address.city}, {order.address.zip}
              </div>
              {order.address.instructions && (
                <div style={{ fontSize: "0.78rem", color: "var(--accent-hover)", marginTop: 4 }}>
                  ℹ️ "{order.address.instructions}"
                </div>
              )}
            </div>
          </div>

          {/* Itemized Bill */}
          <div>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 8, display: "block" }}>
              Order Breakdown ({order.items.reduce((s, i) => s + i.quantity, 0)} items)
            </span>
            <div
              style={{
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
              }}
            >
              {order.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderBottom: i < order.items.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    backgroundColor: i % 2 === 0 ? "#ffffff" : "var(--surface-subtle)",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--ink-primary)", fontSize: "0.9rem" }}>
                      {item.quantity}x {item.name}
                    </span>
                    {item.specialInstructions && (
                      <span style={{ display: "block", fontSize: "0.76rem", color: "var(--accent-hover)" }}>
                        Note: {item.specialInstructions}
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--ink-primary)" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div
                style={{
                  backgroundColor: "var(--surface-subtle)",
                  borderTop: "1px solid var(--border-medium)",
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  fontSize: "0.84rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-secondary)" }}>
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-secondary)" }}>
                  <span>Estimated Delivery Fee</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-secondary)" }}>
                  <span>Estimated Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--ink-primary)",
                    paddingTop: 6,
                    borderTop: "1px dashed var(--border-medium)",
                  }}
                >
                  <span>Grand Total</span>
                  <span style={{ color: "var(--primary)" }}>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline History */}
          <div>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 8, display: "block" }}>
              Event Log &amp; Audit Trail
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {order.history.map((ev, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.78rem",
                    padding: "6px 10px",
                    backgroundColor: "var(--surface-subtle)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <div>
                    <strong style={{ textTransform: "capitalize", color: "var(--ink-primary)" }}>
                      {ORDER_STATUS_MAP[ev.status]?.label || ev.status}
                    </strong>
                    {ev.note && <span style={{ color: "var(--ink-secondary)", marginLeft: 6 }}>— {ev.note}</span>}
                  </div>
                  <span style={{ color: "var(--ink-faint)" }}>
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick status update note */}
          {nextStatus && order.status !== "cancelled" && (
            <div className="form-group" style={{ marginTop: 4 }}>
              <label className="form-label" htmlFor="order-note-input">
                Optional Status Update Note
              </label>
              <input
                id="order-note-input"
                type="text"
                className="form-input"
                placeholder="e.g. Courier Dave picked up hot bag from counter"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: "space-between" }}>
          <div>
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleCancel}
                id="btn-cancel-order"
              >
                Cancel Order
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            {nextStatus && order.status !== "cancelled" && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAdvance}
                id="btn-advance-status"
              >
                {statusMeta.actionLabel || `Advance to ${nextStatus}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
