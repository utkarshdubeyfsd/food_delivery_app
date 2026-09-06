import { Link, Navigate, useParams } from "react-router-dom";
import { useOrders } from "../context/OrdersContext";
import { CartLineRow } from "../components/CartLineRow";

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useOrders();
  const order = orderId ? getOrder(orderId) : undefined;

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="confirmation">
      <span className="confirmation__badge" aria-hidden="true">
        ✓
      </span>
      <h2>Order placed</h2>
      <p className="status-text">
        Order {order.id} from {order.restaurantName} is on its way to {order.address.line1},{" "}
        {order.address.city}.
      </p>

      <ul className="cart-list">
        {order.items.map((line) => (
          <CartLineRow key={line.menuItem.id} line={line} />
        ))}
      </ul>

      <div className="cart-total cart-total--muted">
        <span>Delivery fee</span>
        <span>${order.deliveryFee.toFixed(2)}</span>
      </div>
      <div className="cart-total">
        <span>Total</span>
        <span>${order.total.toFixed(2)}</span>
      </div>

      <Link className="btn-primary btn-link" to={`/orders/${order.id}`}>
        Track order
      </Link>
      <Link className="link-back checkout-form__back" to="/">
        Start a new order
      </Link>
    </div>
  );
}
