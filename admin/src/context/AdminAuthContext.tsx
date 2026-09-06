import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AdminRole, AdminUser, Restaurant } from "../types";
import { ADMIN_PRESET_USERS, MOCK_ADMIN_RESTAURANTS } from "../mocks/adminData";

interface AdminAuthContextValue {
  user: AdminUser | null;
  selectedRestaurantId: string; // 'all' or specific restaurant ID
  restaurants: Restaurant[];
  login: (email: string, role?: AdminRole, restaurantId?: string) => boolean;
  quickLogin: (presetUserId: string) => void;
  logout: () => void;
  setSelectedRestaurantId: (id: string) => void;
  activeRestaurant: Restaurant | null;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const STORAGE_USER_KEY = "harvest_admin_user";
const STORAGE_STORE_KEY = "harvest_admin_selected_store";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default logged in with Alex Sterling (Super Admin) for seamless demo evaluation
    return ADMIN_PRESET_USERS[0];
  });

  const [selectedRestaurantId, setSelectedRestaurantIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STORE_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return "all";
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch {
      // ignore
    }
  }, [user]);

  function setSelectedRestaurantId(id: string) {
    setSelectedRestaurantIdState(id);
    try {
      localStorage.setItem(STORAGE_STORE_KEY, id);
    } catch {
      // ignore
    }
  }

  function login(email: string, role: AdminRole = "store_manager", restaurantId?: string): boolean {
    if (!email || !email.includes("@")) return false;

    // Check if preset email
    const preset = ADMIN_PRESET_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (preset) {
      setUser(preset);
      if (preset.assignedRestaurantId) {
        setSelectedRestaurantId(preset.assignedRestaurantId);
      }
      return true;
    }

    const newUser: AdminUser = {
      id: `u_${Math.floor(1000 + Math.random() * 9000)}`,
      name: email.split("@")[0].replace(".", " "),
      email,
      role,
      assignedRestaurantId: restaurantId,
    };
    setUser(newUser);
    if (restaurantId) {
      setSelectedRestaurantId(restaurantId);
    }
    return true;
  }

  function quickLogin(presetUserId: string) {
    const preset = ADMIN_PRESET_USERS.find((u) => u.id === presetUserId);
    if (preset) {
      setUser(preset);
      if (preset.assignedRestaurantId) {
        setSelectedRestaurantId(preset.assignedRestaurantId);
      } else {
        setSelectedRestaurantId("all");
      }
    }
  }

  function logout() {
    setUser(null);
  }

  const activeRestaurant =
    selectedRestaurantId === "all"
      ? null
      : MOCK_ADMIN_RESTAURANTS.find((r) => r.id === selectedRestaurantId) || null;

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        selectedRestaurantId,
        restaurants: MOCK_ADMIN_RESTAURANTS,
        login,
        quickLogin,
        logout,
        setSelectedRestaurantId,
        activeRestaurant,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}
