import { Link, Navigate, useParams } from "react-router-dom";
import { useOrders } from "../context/OrdersContext";
import { StatusTimeline } from "../components/StatusTimeline";
import { ORDER_STATUS_LABELS } from "../types";

export function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useOrders();
  const order = orderId ? getOrder(orderId) : undefined;

  if (!order) return <Navigate to="/orders" replace />;

  return (
    <div>
      <Link className="link-back" to="/orders">
        ← All orders
      </Link>

      <h1 className="page-title">Order {order.id}</h1>
      <p className="status-text">
        {order.restaurantName} · {ORDER_STATUS_LABELS[order.status]}
      </p>

      <StatusTimeline status={order.status} />

      <div className="order-summary">
        <h4 className="menu-section__title">Delivering to</h4>
        <p className="status-text">
          {order.address.line1}, {order.address.city} {order.address.zip}
        </p>

        <h4 className="menu-section__title">Items</h4>
        <ul className="cart-list">
          {order.items.map((line) => (
            <li key={line.menuItem.id} className="cart-list__row">
              <span>
                {line.quantity} × {line.menuItem.name}
              </span>
              <span className="cart-list__price">
                ${(line.menuItem.price * line.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="cart-total">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
