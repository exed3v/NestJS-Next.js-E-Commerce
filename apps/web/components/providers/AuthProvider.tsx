"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getUserFromStorage = (): User | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("auth-user");
  return stored ? JSON.parse(stored) : null;
};

const saveUserToStorage = (user: User) => {
  localStorage.setItem("auth-user", JSON.stringify(user));
};

const removeUserFromStorage = () => {
  localStorage.removeItem("auth-user");
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(getUserFromStorage());
    setMounted(true);
  }, []);

  const login = (email: string, name?: string) => {
    const u: User = { name: name || email.split("@")[0], email };
    saveUserToStorage(u);
    setUser(u);
  };

  const logout = () => {
    removeUserFromStorage();
    setUser(null);
  };

  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
