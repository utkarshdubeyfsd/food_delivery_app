export type AdminRole = "super_admin" | "store_manager" | "kitchen_lead";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  assignedRestaurantId?: string; // If null/empty, can manage all
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTimeMins: number;
  emoji: string;
  priceRange: "$" | "$$" | "$$$";
  address: string;
  phone: string;
  isOpen: boolean;
}

export type DietaryTag =
  | "veg"
  | "non-veg"
  | "vegan"
  | "gluten-free"
  | "spicy"
  | "chef-special";

export interface AdminMenuItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  category: string;
  description: string;
  isAvailable: boolean;
  preparationTimeMins?: number;
  tags?: DietaryTag[];
  emoji?: string;
}

export type OrderStatus =
  | "placed"
  | "accepted"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  "placed",
  "accepted",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export interface StatusMeta {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeClass: string;
  nextStatus?: OrderStatus;
  actionLabel?: string;
  actionClass?: string;
  iconEmoji: string;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, StatusMeta> = {
  placed: {
    label: "New Order",
    color: "#b45309",
    bgColor: "#fef3c7",
    borderColor: "#fcd34d",
    badgeClass: "badge--placed",
    nextStatus: "accepted",
    actionLabel: "Accept Order",
    actionClass: "btn--accept",
    iconEmoji: "🔔",
  },
  accepted: {
    label: "Accepted",
    color: "#1d4ed8",
    bgColor: "#dbeafe",
    borderColor: "#93c5fd",
    badgeClass: "badge--accepted",
    nextStatus: "preparing",
    actionLabel: "Start Cooking",
    actionClass: "btn--primary",
    iconEmoji: "👨‍🍳",
  },
  preparing: {
    label: "Preparing",
    color: "#6d28d9",
    bgColor: "#ede9fe",
    borderColor: "#c4b5fd",
    badgeClass: "badge--preparing",
    nextStatus: "out_for_delivery",
    actionLabel: "Dispatch for Delivery",
    actionClass: "btn--dispatch",
    iconEmoji: "🍳",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "#0e7490",
    bgColor: "#cffafe",
    borderColor: "#67e8f9",
    badgeClass: "badge--delivery",
    nextStatus: "delivered",
    actionLabel: "Mark Delivered",
    actionClass: "btn--delivered",
    iconEmoji: "🛵",
  },
  delivered: {
    label: "Delivered",
    color: "#047857",
    bgColor: "#d1fae5",
    borderColor: "#6ee7b7",
    badgeClass: "badge--delivered",
    iconEmoji: "✅",
  },
  cancelled: {
    label: "Cancelled",
    color: "#b91c1c",
    bgColor: "#fee2e2",
    borderColor: "#fca5a5",
    badgeClass: "badge--cancelled",
    iconEmoji: "❌",
  },
};

export interface OrderCustomer {
  name: string;
  phone: string;
  email: string;
}

export interface OrderAddress {
  line1: string;
  city: string;
  zip: string;
  instructions?: string;
}

export interface OrderItemLine {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  specialInstructions?: string;
}

export interface OrderHistoryEvent {
  status: OrderStatus;
  timestamp: number;
  note?: string;
}

export interface AdminOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  customer: OrderCustomer;
  items: OrderItemLine[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  address: OrderAddress;
  paymentMethod: string;
  status: OrderStatus;
  placedAt: number;
  estimatedDeliveryMins: number;
  history: OrderHistoryEvent[];
  notes?: string;
}
