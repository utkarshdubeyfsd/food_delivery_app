import type { AdminMenuItem, AdminOrder, OrderStatus, Restaurant } from "../types";
import { INITIAL_ADMIN_MENU_ITEMS, INITIAL_ADMIN_ORDERS, MOCK_ADMIN_RESTAURANTS } from "./adminData";

// Emulate slight async network timing for realism
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAdminApi = {
  async getRestaurants(): Promise<Restaurant[]> {
    await delay(60);
    return [...MOCK_ADMIN_RESTAURANTS];
  },

  async getMenuItems(restaurantId?: string): Promise<AdminMenuItem[]> {
    await delay(60);
    if (!restaurantId || restaurantId === "all") {
      return [...INITIAL_ADMIN_MENU_ITEMS];
    }
    return INITIAL_ADMIN_MENU_ITEMS.filter((item) => item.restaurantId === restaurantId);
  },

  async getOrders(restaurantId?: string): Promise<AdminOrder[]> {
    await delay(60);
    if (!restaurantId || restaurantId === "all") {
      return [...INITIAL_ADMIN_ORDERS];
    }
    return INITIAL_ADMIN_ORDERS.filter((order) => order.restaurantId === restaurantId);
  },

  async updateOrderStatus(_orderId: string, _status: OrderStatus, _note?: string): Promise<boolean> {
    await delay(40);
    return true;
  },

  async saveMenuItem(item: AdminMenuItem): Promise<AdminMenuItem> {
    await delay(50);
    return item;
  },

  async deleteMenuItem(_id: string): Promise<boolean> {
    await delay(50);
    return true;
  },
};
