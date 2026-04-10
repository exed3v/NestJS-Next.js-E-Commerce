import { fetchClient } from "./client";
import { Product } from "../types";

export interface ProductsFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
}

export const productsApi = {
  getAll: (filters?: ProductsFilters): Promise<Product[]> => {
    const params = new URLSearchParams();

    if (filters?.categoryId) params.append("categoryId", filters.categoryId);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.minPrice !== undefined)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.isFeatured !== undefined)
      params.append("isFeatured", filters.isFeatured.toString());

    const query = params.toString();
    return fetchClient(`/products${query ? `?${query}` : ""}`);
  },

  getBySlug: (slug: string): Promise<Product> =>
    fetchClient(`/products/slug/${slug}`),

  getById: (id: string): Promise<Product> => fetchClient(`/products/${id}`),
};
