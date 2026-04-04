"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    productId: string,
    productName: string,
    price: number,
    size: string,
    color: string,
    quantity: number,
    image?: string,
  ) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("cart");
  return stored ? JSON.parse(stored) : [];
};

const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(getCartFromStorage());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveCartToStorage(items);
    }
  }, [items, mounted]);

  const addItem = (
    productId: string,
    productName: string,
    price: number,
    size: string,
    color: string,
    quantity: number,
    image?: string,
  ) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === productId && i.size === size && i.color === color,
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [
        ...prev,
        { productId, productName, price, size, color, quantity, image },
      ];
    });
    toast.success(`${productName} añadido al carrito`);
  };

  const removeItem = (productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(i.productId === productId && i.size === size && i.color === color),
      ),
    );
    toast.info("Producto eliminado del carrito");
  };

  const updateQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

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
