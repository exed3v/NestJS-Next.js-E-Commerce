import { fetchClient } from "./client";
import { Cart, AddToCartInput, UpdateCartItemInput, CartItem } from "../types";

export const cartApi = {
  getCart: (): Promise<Cart> => fetchClient("/cart"),

  addItem: (data: AddToCartInput): Promise<CartItem> =>
    fetchClient("/cart/items", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateItem: (itemId: string, data: UpdateCartItemInput): Promise<CartItem> =>
    fetchClient(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  removeItem: (itemId: string): Promise<void> =>
    fetchClient(`/cart/items/${itemId}`, { method: "DELETE" }),

  clearCart: (): Promise<void> =>
    fetchClient("/cart/clear", { method: "DELETE" }),
};
