import { fetchClient } from "../client";
import { User, UpdateUserInput } from "../../types";

export const adminUsersApi = {
  getAll: (): Promise<User[]> => fetchClient("/users"),

  getById: (id: string): Promise<User> => fetchClient(`/users/${id}`),

  update: (id: string, data: UpdateUserInput): Promise<User> =>
    fetchClient(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    fetchClient(`/users/${id}`, { method: "DELETE" }),
};
