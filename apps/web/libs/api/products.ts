import { fetchClient } from "./client";
import { Product } from "../types";

export interface ProductsFilters {
  categoryIds?: string[]; // ✅ Cambiado a array
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

export const productsApi = {
  getAll: (
    filters?: ProductsFilters,
  ): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const params = new URLSearchParams();

    if (filters?.categoryIds) {
      filters.categoryIds.forEach((id) => params.append("categoryId", id));
    }
    if (filters?.search) params.append("search", filters.search);
    if (filters?.minPrice !== undefined)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.isFeatured !== undefined)
      params.append("isFeatured", filters.isFeatured.toString());
    if (filters?.page !== undefined)
      params.append("page", filters.page.toString());
    if (filters?.limit !== undefined)
      params.append("limit", filters.limit.toString());

    const query = params.toString();
    return fetchClient(`/products${query ? `?${query}` : ""}`);
  },

  getBySlug: (slug: string): Promise<Product> =>
    fetchClient(`/products/slug/${slug}`),

  getById: (id: string): Promise<Product> => fetchClient(`/products/${id}`),
};
