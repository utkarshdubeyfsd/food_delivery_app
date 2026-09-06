import { createContext, useContext, useState, type ReactNode } from "react";
import type { MockUser } from "../types";

interface AuthContextValue {
  user: MockUser | null;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  // These don't call a backend — they just simulate "being logged in" so the
  // rest of the prototype (checkout, account) has a user to work with.
  function login(email: string) {
    setUser({ name: email.split("@")[0], email });
  }

  function signup(name: string, email: string) {
    setUser({ name, email });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
