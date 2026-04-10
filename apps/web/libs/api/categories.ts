import { fetchClient } from "./client";
import { Category } from "../types";

export const categoriesApi = {
  getAll: (): Promise<Category[]> => fetchClient("/categories"),

  getById: (id: string): Promise<Category> => fetchClient(`/categories/${id}`),

  getBySlug: (slug: string): Promise<Category> =>
    fetchClient(`/categories/slug/${slug}`),
};
