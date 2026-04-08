"use client";

import { createContext, useContext, ReactNode } from "react";
import { RegisterInput, User, LoginInput } from "@/libs/types";
import { useMe, useLogin, useRegister, useLogout } from "@/libs/hooks/useAuth";

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading } = useMe();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (email: string, password: string) => {
    const input: LoginInput = { email, password };
    await loginMutation.mutateAsync(input);
  };

  const register = async (data: RegisterInput) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
