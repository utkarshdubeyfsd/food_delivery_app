import type { MenuItem } from "../types";
import { useCart } from "../context/CartContext";

export function MenuItemRow({ item }: { item: MenuItem }) {
  const { lines, addItem, removeItem } = useCart();
  const line = lines.find((l) => l.menuItem.id === item.id);

  return (
    <div className="menu-item">
      <div className="menu-item__info">
        <p className="menu-item__name">{item.name}</p>
        <p className="menu-item__desc">{item.description}</p>
        <p className="menu-item__price">${item.price.toFixed(2)}</p>
      </div>
      {line ? (
        <div className="qty-stepper">
          <button onClick={() => removeItem(item.id)} aria-label={`Remove one ${item.name}`}>
            −
          </button>
          <span>{line.quantity}</span>
          <button onClick={() => addItem(item)} aria-label={`Add one more ${item.name}`}>
            +
          </button>
        </div>
      ) : (
        <button className="btn-add" onClick={() => addItem(item)}>
          Add
        </button>
      )}
    </div>
  );
}
