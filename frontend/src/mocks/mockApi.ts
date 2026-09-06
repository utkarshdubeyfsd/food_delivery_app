import { MOCK_RESTAURANTS } from "./restaurants";
import { MOCK_MENUS } from "./menus";
import type { Restaurant, MenuItem } from "../types";

// Fake latency so loading states are visible/testable in the click-through
// prototype. Swap the bodies of these functions for real `fetch` calls when
// the backend is wired up — nothing that calls this module needs to change.
function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const mockApi = {
  getRestaurants(): Promise<Restaurant[]> {
    return delay(MOCK_RESTAURANTS);
  },

  getRestaurant(id: string): Promise<Restaurant | undefined> {
    return delay(MOCK_RESTAURANTS.find((r) => r.id === id));
  },

  getMenu(restaurantId: string): Promise<MenuItem[]> {
    return delay(MOCK_MENUS.filter((m) => m.restaurantId === restaurantId));
  },
};
