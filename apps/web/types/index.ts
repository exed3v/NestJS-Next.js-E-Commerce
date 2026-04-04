export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  variants: ProductVariant[];
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface User {
  name: string;
  email: string;
}
