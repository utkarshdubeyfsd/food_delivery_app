import { Link } from "react-router-dom";
import { useOrders } from "../context/OrdersContext";
import { ORDER_STATUS_LABELS } from "../types";

export function OrdersListPage() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <h2>No orders yet</h2>
        <p className="status-text">Orders you place will show up here.</p>
        <Link className="btn-primary btn-link" to="/">
          Browse restaurants
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Your orders</h1>
      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.id}>
            <Link className="order-list__row" to={`/orders/${order.id}`}>
              <div>
                <p className="menu-item__name">{order.restaurantName}</p>
                <p className="status-text">
                  {order.id} · {ORDER_STATUS_LABELS[order.status]}
                </p>
              </div>
              <span className="cart-list__price">${order.total.toFixed(2)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
