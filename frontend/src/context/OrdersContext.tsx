import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Address, CartLine, Order, OrderStatus } from "../types";
import { ORDER_STATUS_SEQUENCE } from "../types";

interface OrdersContextValue {
  orders: Order[];
  placeOrder: (args: {
    restaurantId: string;
    restaurantName: string;
    items: CartLine[];
    address: Address;
  }) => Order;
  getOrder: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

const DELIVERY_FEE = 2.99;
const STATUS_STEP_MS = 6000; // how often a mock order advances to its next status

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearInterval);
    };
  }, []);

  function placeOrder({
    restaurantId,
    restaurantName,
    items,
    address,
  }: {
    restaurantId: string;
    restaurantName: string;
    items: CartLine[];
    address: Address;
  }): Order {
    const subtotal = items.reduce((sum, l) => sum + l.menuItem.price * l.quantity, 0);
    const order: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurantId,
      restaurantName,
      items,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total: subtotal + DELIVERY_FEE,
      address,
      status: "placed",
      placedAt: Date.now(),
    };

    setOrders((prev) => [order, ...prev]);
    startMockProgression(order.id);
    return order;
  }

  function startMockProgression(orderId: string) {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o;
          const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(o.status);
          const nextStatus: OrderStatus | undefined = ORDER_STATUS_SEQUENCE[currentIndex + 1];
          if (!nextStatus) {
            clearInterval(interval);
            return o;
          }
          if (nextStatus === "delivered") clearInterval(interval);
          return { ...o, status: nextStatus };
        })
      );
    }, STATUS_STEP_MS);
    timers.current.push(interval);
  }

  function getOrder(id: string) {
    return orders.find((o) => o.id === id);
  }

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, getOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
}
