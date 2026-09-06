import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartLineRow } from "../components/CartLineRow";

export function CartPage() {
  const { lines, subtotal, addItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (lines.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <p className="status-text">Add something tasty from a restaurant to get started.</p>
        <Link className="btn-primary btn-link" to="/">
          Browse restaurants
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Your cart</h1>

      <ul className="cart-list">
        {lines.map((line) => (
          <CartLineRow
            key={line.menuItem.id}
            line={line}
            onAdd={() => addItem(line.menuItem)}
            onRemove={() => removeItem(line.menuItem.id)}
          />
        ))}
      </ul>

      <div className="cart-total">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <button className="btn-primary" onClick={() => navigate("/checkout")}>
        Go to checkout
      </button>
    </div>
  );
}
