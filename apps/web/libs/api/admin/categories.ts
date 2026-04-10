import { fetchClient } from "../client";
import { Category } from "../../types";

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export const adminCategoriesApi = {
  getAll: (): Promise<Category[]> => fetchClient("/categories"),

  getById: (id: string): Promise<Category> => fetchClient(`/categories/${id}`),

  create: (data: CreateCategoryData): Promise<Category> =>
    fetchClient("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: CreateCategoryData): Promise<Category> =>
    fetchClient(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    fetchClient(`/categories/${id}`, { method: "DELETE" }),
};
