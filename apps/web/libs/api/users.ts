import { User, UpdateUserInput } from "../types";
import { fetchClient } from "./client";

export const usersApi = {
  // Usuario autenticado (sobre sí mismo)
  getMe: (): Promise<User> => fetchClient("/users/me"),

  updateMe: (data: UpdateUserInput): Promise<User> =>
    fetchClient("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteMe: (): Promise<void> => fetchClient("/users/me", { method: "DELETE" }),
};
