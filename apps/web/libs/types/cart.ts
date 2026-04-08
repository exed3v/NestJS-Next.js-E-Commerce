import { ProductImage, ProductVariant } from "./product";

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: ProductImage[];
  };
  variant?: ProductVariant | null;
}

export interface Cart {
  id: string;
  userId: string;
  expiresAt: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
