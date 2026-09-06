import type { OrderStatus } from "../types";
import { ORDER_STATUS_MAP } from "../types";

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const meta = ORDER_STATUS_MAP[status] || {
    label: status,
    badgeClass: "badge--placed",
    iconEmoji: "•",
  };

  return (
    <span
      className={`status-badge ${meta.badgeClass} ${size === "sm" ? "btn-sm" : ""}`}
      id={`order-status-${status}`}
    >
      <span className="status-dot" />
      <span>{meta.label}</span>
    </span>
  );
}
