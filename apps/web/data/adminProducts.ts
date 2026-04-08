import { products } from "@/data/products";
import { AdminProduct } from "@/types/admin";

const STORAGE_KEY = "noirstore-admin-products";

const defaultProducts: AdminProduct[] = products.map((p) => ({
  ...p,
  images: [p.image],
}));

export const getAdminProducts = (): AdminProduct[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultProducts;
  } catch {
    return defaultProducts;
  }
};

export const saveAdminProducts = (list: AdminProduct[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};
