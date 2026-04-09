"use client";

import { createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";
import {
  useCartQuery,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "@/libs/hooks/useCart";
import { CartItem } from "@/libs/types";

interface CartContextType {
  items: CartItem[];
  addItem: (
    productId: string,
    productName: string,
    price: number,
    variantId: string | undefined,
    quantity: number,
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { data: cart, isLoading } = useCartQuery();
  const addToCart = useAddToCart();
  const updateItem = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const items = cart?.items || [];
  const totalItems = cart?.totalItems || 0;
  const subtotal = cart?.subtotal || 0;

  const addItem = async (
    productId: string,
    productName: string,
    price: number,
    variantId: string | undefined,
    quantity: number,
  ) => {
    try {
      await addToCart.mutateAsync({
        productId,
        variantId,
        quantity,
      });
      toast.success(`${productName} añadido al carrito`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al añadir";
      toast.error(message);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeItemMutation.mutateAsync(itemId);
      toast.info("Producto eliminado del carrito");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al eliminar";
      toast.error(message);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    try {
      await updateItem.mutateAsync({ itemId, data: { quantity } });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al actualizar";
      toast.error(message);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartMutation.mutateAsync();
      toast.info("Carrito vaciado");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al vaciar";
      toast.error(message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
