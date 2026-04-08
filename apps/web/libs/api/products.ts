import { fetchClient } from "./client";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  images: { url: string; isMain: boolean }[];
  category?: { id: string; name: string };
  variants?: [];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export const productsApi = {
  getAll: (params?: URLSearchParams): Promise<ProductsResponse> =>
    fetchClient(`/products?${params?.toString() || ""}`),

  getBySlug: (slug: string): Promise<Product> =>
    fetchClient(`/products/slug/${slug}`),
};
