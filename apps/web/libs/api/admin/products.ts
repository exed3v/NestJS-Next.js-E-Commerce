import { AdminVariant } from "@/types/admin";
import { fetchClient } from "../client";

export const adminProductsApi = {
  getAll: () => fetchClient("/products"),
  getById: (id: string) => fetchClient(`/products/${id}`),
  create: (data: FormData) =>
    fetchClient("/products", { method: "POST", body: data }),
  update: (id: string, data: FormData) =>
    fetchClient(`/products/${id}`, { method: "PATCH", body: data }),
  delete: (id: string) => fetchClient(`/products/${id}`, { method: "DELETE" }),

  // Variantes
  addVariant: (productId: string, data: AdminVariant) =>
    fetchClient(`/products/${productId}/variants`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateVariant: (variantId: string, data: AdminVariant) =>
    fetchClient(`/products/variants/${variantId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteVariant: (variantId: string) =>
    fetchClient(`/products/variants/${variantId}`, { method: "DELETE" }),
};
