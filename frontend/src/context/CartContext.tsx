import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartLine, MenuItem } from "../types";

interface CartContextValue {
  restaurantId: string | null;
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [lines, setLines] = useState<CartLine[]>([]);

  function addItem(item: MenuItem) {
    setLines((prev) => {
      // Starting an order from a different restaurant replaces the cart —
      // mirrors how most delivery apps handle a single active order.
      if (restaurantId && restaurantId !== item.restaurantId) {
        setRestaurantId(item.restaurantId);
        return [{ menuItem: item, quantity: 1 }];
      }
      if (!restaurantId) setRestaurantId(item.restaurantId);

      const existing = prev.find((l) => l.menuItem.id === item.id);
      if (existing) {
        return prev.map((l) =>
          l.menuItem.id === item.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  }

  function removeItem(itemId: string) {
    setLines((prev) => {
      const next = prev
        .map((l) => (l.menuItem.id === itemId ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0);
      if (next.length === 0) setRestaurantId(null);
      return next;
    });
  }

  function clearCart() {
    setLines([]);
    setRestaurantId(null);
  }

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.menuItem.price * l.quantity, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{ restaurantId, lines, itemCount, subtotal, addItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
