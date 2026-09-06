import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import type { AdminMenuItem } from "../types";
import { INITIAL_ADMIN_MENU_ITEMS } from "../mocks/adminData";

interface MenuContextValue {
  items: AdminMenuItem[];
  categories: string[];
  addItem: (itemData: Omit<AdminMenuItem, "id">) => AdminMenuItem;
  updateItem: (item: AdminMenuItem) => void;
  deleteItem: (id: string) => void;
  toggleAvailability: (id: string) => void;
  getItem: (id: string) => AdminMenuItem | undefined;
}

const MenuContext = createContext<MenuContextValue | null>(null);

const STORAGE_MENU_KEY = "harvest_admin_menu_items";

export function MenuProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AdminMenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MENU_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ADMIN_MENU_ITEMS;
  });

  function persist(newItems: AdminMenuItem[]) {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_MENU_KEY, JSON.stringify(newItems));
    } catch {
      // ignore
    }
  }

  function addItem(itemData: Omit<AdminMenuItem, "id">): AdminMenuItem {
    const newId = `m_${Date.now().toString().slice(-5)}`;
    const createdItem: AdminMenuItem = {
      ...itemData,
      id: newId,
    };
    const next = [createdItem, ...items];
    persist(next);
    return createdItem;
  }

  function updateItem(updated: AdminMenuItem) {
    const next = items.map((it) => (it.id === updated.id ? updated : it));
    persist(next);
  }

  function deleteItem(id: string) {
    const next = items.filter((it) => it.id !== id);
    persist(next);
  }

  function toggleAvailability(id: string) {
    const next = items.map((it) =>
      it.id === id ? { ...it, isAvailable: !it.isAvailable } : it
    );
    persist(next);
  }

  function getItem(id: string): AdminMenuItem | undefined {
    return items.find((it) => it.id === id);
  }

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  return (
    <MenuContext.Provider
      value={{
        items,
        categories,
        addItem,
        updateItem,
        deleteItem,
        toggleAvailability,
        getItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within a MenuProvider");
  return ctx;
}
