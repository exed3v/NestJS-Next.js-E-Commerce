import { fetchClient } from "./client";
import { LoginInput, RegisterInput, AuthResponse } from "../types";

export const authApi = {
  login: (data: LoginInput): Promise<AuthResponse> =>
    fetchClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterInput): Promise<AuthResponse> =>
    fetchClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: (): Promise<{ message: string }> =>
    fetchClient("/auth/logout", { method: "POST" }),
};
