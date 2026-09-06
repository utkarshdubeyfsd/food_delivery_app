export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTimeMins: number;
  emoji: string;
  priceRange: "$" | "$$" | "$$$";
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

export interface CartLine {
  menuItem: MenuItem;
  quantity: number;
}

export interface Address {
  line1: string;
  city: string;
  zip: string;
  instructions?: string;
}

export interface PaymentDetails {
  cardholderName: string;
  cardNumberLast4: string;
}

export type OrderStatus = "placed" | "accepted" | "preparing" | "out_for_delivery" | "delivered";

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  "placed",
  "accepted",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Order placed",
  accepted: "Restaurant accepted",
  preparing: "Preparing your food",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: Address;
  status: OrderStatus;
  placedAt: number;
}

export interface MockUser {
  name: string;
  email: string;
}
