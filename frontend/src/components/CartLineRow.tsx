import type { CartLine } from "../types";

interface Props {
  line: CartLine;
  onAdd?: () => void;
  onRemove?: () => void;
}

export function CartLineRow({ line, onAdd, onRemove }: Props) {
  const editable = onAdd && onRemove;
  return (
    <li className="cart-list__row">
      <span>{line.menuItem.name}</span>
      {editable ? (
        <div className="qty-stepper">
          <button onClick={onRemove} aria-label={`Remove one ${line.menuItem.name}`}>
            −
          </button>
          <span>{line.quantity}</span>
          <button onClick={onAdd} aria-label={`Add one more ${line.menuItem.name}`}>
            +
          </button>
        </div>
      ) : (
        <span className="cart-list__qty">× {line.quantity}</span>
      )}
      <span className="cart-list__price">${(line.menuItem.price * line.quantity).toFixed(2)}</span>
    </li>
  );
}
