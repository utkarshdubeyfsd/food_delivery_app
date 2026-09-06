import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AdminOrder, OrderItemLine, OrderStatus } from "../types";
import {
  INITIAL_ADMIN_ORDERS,
  MOCK_ADMIN_RESTAURANTS,
  SAMPLE_SIMULATION_CUSTOMERS,
} from "../mocks/adminData";
import { useMenu } from "./MenuContext";

interface OrdersContextValue {
  orders: AdminOrder[];
  latestIncomingOrder: AdminOrder | null;
  dismissLatestIncomingOrder: () => void;
  updateOrderStatus: (orderId: string, nextStatus: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  simulateIncomingOrder: (restaurantId?: string) => AdminOrder;
  autoSimulate: boolean;
  setAutoSimulate: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  getOrder: (id: string) => AdminOrder | undefined;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

const STORAGE_ORDERS_KEY = "harvest_admin_orders";

// Synthesize pleasant two-tone chime via Web Audio API
function playChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch {
    // AudioContext blocked or not allowed in headless mode
  }
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { items: allMenuItems } = useMenu();

  const [orders, setOrders] = useState<AdminOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ADMIN_ORDERS;
  });

  const [latestIncomingOrder, setLatestIncomingOrder] = useState<AdminOrder | null>(null);
  const [autoSimulate, setAutoSimulate] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const autoSimIntervalRef = useRef<number | null>(null);

  function persist(newOrders: AdminOrder[]) {
    setOrders(newOrders);
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(newOrders));
    } catch {
      // ignore
    }
  }

  function dismissLatestIncomingOrder() {
    setLatestIncomingOrder(null);
  }

  function updateOrderStatus(orderId: string, nextStatus: OrderStatus, note?: string) {
    const next = orders.map((order) => {
      if (order.id !== orderId) return order;
      const historyEvent = {
        status: nextStatus,
        timestamp: Date.now(),
        note: note || `Status updated to ${nextStatus}`,
      };
      return {
        ...order,
        status: nextStatus,
        history: [...order.history, historyEvent],
      };
    });
    persist(next);
  }

  function cancelOrder(orderId: string, reason?: string) {
    updateOrderStatus(orderId, "cancelled", reason || "Cancelled by store manager");
  }

  function simulateIncomingOrder(preferredRestaurantId?: string): AdminOrder {
    // Pick restaurant
    const targetStore =
      (preferredRestaurantId &&
        preferredRestaurantId !== "all" &&
        MOCK_ADMIN_RESTAURANTS.find((r) => r.id === preferredRestaurantId)) ||
      MOCK_ADMIN_RESTAURANTS[Math.floor(Math.random() * MOCK_ADMIN_RESTAURANTS.length)];

    // Pick 1-3 available items from this restaurant
    const storeMenuItems = allMenuItems.filter(
      (m) => m.restaurantId === targetStore.id && m.isAvailable
    );
    const availablePool = storeMenuItems.length > 0 ? storeMenuItems : allMenuItems;

    const itemCount = Math.min(availablePool.length, Math.floor(Math.random() * 2) + 1);
    const shuffled = [...availablePool].sort(() => 0.5 - Math.random());
    const selectedItems = shuffled.slice(0, itemCount);

    const orderLines: OrderItemLine[] = selectedItems.map((item) => ({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: Math.floor(Math.random() * 2) + 1,
      category: item.category,
      specialInstructions:
        Math.random() > 0.6 ? "Please include extra napkins and cutlery." : undefined,
    }));

    const subtotal = Number(
      orderLines.reduce((sum, l) => sum + l.price * l.quantity, 0).toFixed(2)
    );
    const deliveryFee = 2.99;
    const tax = Number((subtotal * 0.0825).toFixed(2));
    const total = Number((subtotal + deliveryFee + tax).toFixed(2));

    const customerMeta =
      SAMPLE_SIMULATION_CUSTOMERS[
        Math.floor(Math.random() * SAMPLE_SIMULATION_CUSTOMERS.length)
      ];

    const orderIdNum = Math.floor(9430 + Math.random() * 560);
    const newOrder: AdminOrder = {
      id: `ORD-${orderIdNum}`,
      restaurantId: targetStore.id,
      restaurantName: targetStore.name,
      customer: {
        name: customerMeta.name,
        phone: customerMeta.phone,
        email: customerMeta.email,
      },
      items: orderLines,
      subtotal,
      deliveryFee,
      tax,
      total,
      address: {
        line1: `${Math.floor(100 + Math.random() * 800)} California St, Suite ${Math.floor(10 + Math.random() * 90)}`,
        city: customerMeta.city,
        zip: customerMeta.zip,
        instructions: "Call upon arrival",
      },
      paymentMethod: "Card (Online Pre-paid)",
      status: "placed",
      placedAt: Date.now(),
      estimatedDeliveryMins: targetStore.deliveryTimeMins,
      history: [
        {
          status: "placed",
          timestamp: Date.now(),
          note: "New order placed via online mobile app",
        },
      ],
      notes: "Auto-synced from customer channel.",
    };

    const next = [newOrder, ...orders];
    persist(next);
    setLatestIncomingOrder(newOrder);

    if (soundEnabled) {
      playChime();
    }

    return newOrder;
  }

  // Handle auto simulation
  useEffect(() => {
    if (autoSimulate) {
      autoSimIntervalRef.current = window.setInterval(() => {
        simulateIncomingOrder();
      }, 25000);
    } else if (autoSimIntervalRef.current) {
      clearInterval(autoSimIntervalRef.current);
      autoSimIntervalRef.current = null;
    }

    return () => {
      if (autoSimIntervalRef.current) {
        clearInterval(autoSimIntervalRef.current);
      }
    };
  }, [autoSimulate, allMenuItems, orders, soundEnabled]);

  function getOrder(id: string): AdminOrder | undefined {
    return orders.find((o) => o.id === id);
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        latestIncomingOrder,
        dismissLatestIncomingOrder,
        updateOrderStatus,
        cancelOrder,
        simulateIncomingOrder,
        autoSimulate,
        setAutoSimulate,
        soundEnabled,
        setSoundEnabled,
        getOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
}
