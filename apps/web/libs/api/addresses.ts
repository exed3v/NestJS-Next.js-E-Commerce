import { fetchClient } from "./client";
import { Address, AddressInput } from "../types";

export const addressesApi = {
  getAll: (): Promise<Address[]> => fetchClient("/addresses"),

  getById: (id: string): Promise<Address> => fetchClient(`/addresses/${id}`),

  create: (data: AddressInput): Promise<Address> =>
    fetchClient("/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<AddressInput>): Promise<Address> =>
    fetchClient(`/addresses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    fetchClient(`/addresses/${id}`, { method: "DELETE" }),
};
